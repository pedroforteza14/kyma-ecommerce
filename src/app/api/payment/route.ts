import { NextRequest, NextResponse } from 'next/server'
import MercadoPago, { Payment } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/server'
import { CartItem } from '@/types'
import { resend } from '@/lib/email/resend'
import { orderConfirmationHtml, adminOrderNotificationHtml, cashPaymentHtml } from '@/lib/email/templates'
import { sendCapiEvent } from '@/lib/meta/capi'

const mp = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, formData } = body as {
      orderId: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formData: Record<string, any>
    }

    const supabase = await createAdminClient()

    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    const payment = new Payment(mp)

    // Construir el body del pago según el tipo de medio
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentBody: Record<string, any> = {
      transaction_amount: Number(order.total),
      payment_method_id:  formData.payment_method_id,
      installments:       formData.installments ?? 1,
      payer: {
        email:          formData.payer?.email ?? order.customer_email,
        first_name:     formData.payer?.first_name ?? order.customer_name.split(' ')[0],
        last_name:      formData.payer?.last_name  ?? (order.customer_name.split(' ').slice(1).join(' ') || ''),
        ...(formData.payer?.identification ? { identification: formData.payer.identification } : {}),
      },
      external_reference:  orderId,
      description:         `Pedido KYMA #${orderId.slice(0, 8).toUpperCase()}`,
      // notification_url solo en producción (MP rechaza localhost)
      ...(process.env.NEXT_PUBLIC_APP_URL?.includes('localhost')
        ? {}
        : { notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/mercadopago` }),
      additional_info: {
        items: (order.items as CartItem[]).map((item) => ({
          id:         item.variant_id,
          title:      `${item.name} - Talle ${item.size}`,
          unit_price: item.price,
          quantity:   item.quantity,
        })),
        payer: {
          first_name: order.customer_name.split(' ')[0],
          last_name:  order.customer_name.split(' ').slice(1).join(' ') || '',
          address: { street_name: order.customer_address },
        },
      },
    }

    // Token solo para pagos con tarjeta (crédito / débito)
    if (formData.token)     paymentBody.token     = formData.token
    if (formData.issuer_id) paymentBody.issuer_id = Number(formData.issuer_id)

    // transaction_details para transferencias bancarias
    if (formData.transaction_details) {
      paymentBody.transaction_details = formData.transaction_details
    }

    const result = await payment.create({ body: paymentBody })

    // URL del ticket para pagos en efectivo
    const ticketUrl: string | null =
      (result as any).transaction_details?.external_resource_url ?? null

    // Actualizar estado en Supabase
    let status = 'pending'
    if (result.status === 'approved') status = 'paid'
    if (result.status === 'rejected') status = 'cancelled'

    await supabase
      .from('orders')
      .update({ status, mp_payment_id: String(result.id) })
      .eq('id', orderId)

    // Si aprobado: descontar stock + CAPI Purchase + enviar emails
    if (result.status === 'approved') {
      const items = order.items as CartItem[]

      for (const item of items) {
        await supabase.rpc('decrement_stock', {
          variant_id: item.variant_id,
          qty: item.quantity,
        })
      }

      // Meta Conversions API — Purchase server-side
      const clientIp =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        req.headers.get('x-real-ip') ??
        undefined
      const userAgent = req.headers.get('user-agent') ?? undefined

      await sendCapiEvent({
        eventName:      'Purchase',
        eventId:        `purchase_${orderId}`,
        eventSourceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/exito`,
        userData: {
          email:     order.customer_email,
          phone:     order.customer_phone,
          clientIp,
          userAgent,
        },
        customData: {
          currency: 'ARS',
          value:    Number(order.total),
          order_id: orderId,
          contents: (order.items as CartItem[]).map((item) => ({
            id:       item.variant_id,
            quantity: item.quantity,
          })),
        },
      })

      const resendConfigured =
        process.env.RESEND_API_KEY &&
        process.env.RESEND_API_KEY !== 'your_resend_api_key'

      if (resendConfigured) {
        const emailJobs = [
          resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? 'KYMA <onboarding@resend.dev>',
            to: [order.customer_email],
            subject: `¡Tu pedido fue confirmado! #${orderId.slice(0, 8).toUpperCase()}`,
            html: orderConfirmationHtml({
              customerName: order.customer_name,
              orderId,
              items,
              total: order.total,
              address: order.customer_address,
            }),
          }),
        ]

        if (process.env.ADMIN_EMAIL) {
          emailJobs.push(
            resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL ?? 'KYMA <onboarding@resend.dev>',
              to: [process.env.ADMIN_EMAIL],
              subject: `Nuevo pedido #${orderId.slice(0, 8).toUpperCase()} — ${order.customer_name}`,
              html: adminOrderNotificationHtml({
                orderId,
                customerName: order.customer_name,
                customerEmail: order.customer_email,
                customerPhone: order.customer_phone,
                address: order.customer_address,
                items,
                total: order.total,
              }),
            }),
          )
        }

        await Promise.all(emailJobs)
      }
    }

    // Email de ticket para pagos en efectivo pendientes
    if (
      (result.status === 'pending' || result.status === 'in_process') &&
      ticketUrl
    ) {
      const resendConfigured =
        process.env.RESEND_API_KEY &&
        process.env.RESEND_API_KEY !== 'your_resend_api_key'

      if (resendConfigured) {
        const items = order.items as CartItem[]
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? 'KYMA <onboarding@resend.dev>',
          to: [order.customer_email],
          subject: `Tu código de pago — Pedido #${orderId.slice(0, 8).toUpperCase()}`,
          html: cashPaymentHtml({
            customerName: order.customer_name,
            orderId,
            items,
            total: order.total,
            ticketUrl,
          }),
        })
      }
    }

    return NextResponse.json({
      status: result.status,
      paymentId: result.id,
      orderId,
      ticketUrl,
    })
  } catch (err: any) {
    console.error('Payment error:', JSON.stringify(err, Object.getOwnPropertyNames(err)))
    return NextResponse.json({ error: 'Error procesando el pago' }, { status: 500 })
  }
}
