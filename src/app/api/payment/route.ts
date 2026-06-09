import { NextRequest, NextResponse } from 'next/server'
import MercadoPago, { Payment } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/server'
import { CartItem } from '@/types'
import { resend } from '@/lib/email/resend'
import { orderConfirmationHtml, adminOrderNotificationHtml } from '@/lib/email/templates'

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

    const paymentBody = {
      transaction_amount: Number(order.total),
      token: formData.token,
      payment_method_id: formData.payment_method_id,
      installments: formData.installments ?? 1,
      issuer_id: formData.issuer_id ? Number(formData.issuer_id) : undefined,
      payer: {
        email: formData.payer?.email ?? order.customer_email,
        identification: formData.payer?.identification,
      },
      external_reference: orderId,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/mercadopago`,
      description: `Pedido KYMA #${orderId.slice(0, 8).toUpperCase()}`,
    }
    console.log('MP payment body:', JSON.stringify(paymentBody))

    const payment = new Payment(mp)
    const result = await payment.create({
      body: {
        transaction_amount: Number(order.total),
        token: formData.token,
        payment_method_id: formData.payment_method_id,
        installments: formData.installments ?? 1,
        issuer_id: formData.issuer_id ? Number(formData.issuer_id) : undefined,
        payer: {
          email: formData.payer?.email ?? order.customer_email,
          identification: formData.payer?.identification,
        },
        external_reference: orderId,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/mercadopago`,
        description: `Pedido KYMA #${orderId.slice(0, 8).toUpperCase()}`,
        additional_info: {
          items: (order.items as CartItem[]).map((item) => ({
            id: item.variant_id,
            title: `${item.name} - Talle ${item.size}`,
            unit_price: item.price,
            quantity: item.quantity,
          })),
          payer: {
            first_name: order.customer_name.split(' ')[0],
            last_name: order.customer_name.split(' ').slice(1).join(' ') || '',
            address: {
              street_name: order.customer_address,
            },
          },
        },
      },
    })

    // Actualizar estado en Supabase
    let status = 'pending'
    if (result.status === 'approved') status = 'paid'
    if (result.status === 'rejected') status = 'cancelled'

    await supabase
      .from('orders')
      .update({ status, mp_payment_id: String(result.id) })
      .eq('id', orderId)

    // Si aprobado: descontar stock + enviar emails
    if (result.status === 'approved') {
      const items = order.items as CartItem[]

      for (const item of items) {
        await supabase.rpc('decrement_stock', {
          variant_id: item.variant_id,
          qty: item.quantity,
        })
      }

      const resendConfigured =
        process.env.RESEND_API_KEY &&
        process.env.RESEND_API_KEY !== 'your_resend_api_key'

      if (resendConfigured) {
        const emailJobs = [
          resend.emails.send({
            from: 'KYMA <pedidos@kymaba.com.ar>',
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
              from: 'KYMA Sistema <pedidos@kymaba.com.ar>',
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

    return NextResponse.json({
      status: result.status,
      paymentId: result.id,
      orderId,
    })
  } catch (err) {
    console.error('Payment error:', JSON.stringify(err, Object.getOwnPropertyNames(err)))
    return NextResponse.json({ error: 'Error procesando el pago' }, { status: 500 })
  }
}
