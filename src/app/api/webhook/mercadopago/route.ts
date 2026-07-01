import { NextRequest, NextResponse } from 'next/server'
import MercadoPago, { Payment } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/server'
import { resend } from '@/lib/email/resend'
import { orderConfirmationHtml, adminOrderNotificationHtml } from '@/lib/email/templates'
import { CartItem } from '@/types'

const mp = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Solo procesar notificaciones de pagos
    if (body.type !== 'payment') {
      return NextResponse.json({ received: true })
    }

    const payment = new Payment(mp)
    const paymentData = await payment.get({ id: body.data.id })

    const orderId = paymentData.external_reference
    if (!orderId) return NextResponse.json({ received: true })

    const supabase = await createAdminClient()

    // Actualizar estado del pedido según el pago
    let status = 'pending'
    if (paymentData.status === 'approved') status = 'paid'
    if (paymentData.status === 'rejected') status = 'cancelled'

    await supabase
      .from('orders')
      .update({
        status,
        mp_payment_id: String(paymentData.id),
      })
      .eq('id', orderId)

    // Si el pago fue aprobado: descontar stock + enviar emails
    if (paymentData.status === 'approved') {
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (order) {
        const items = order.items as CartItem[]

        // Descontar stock
        for (const item of items) {
          await supabase.rpc('decrement_stock', {
            variant_id: item.variant_id,
            qty: item.quantity,
          })
        }

        // Enviar emails si Resend está configurado
        const resendConfigured =
          process.env.RESEND_API_KEY &&
          process.env.RESEND_API_KEY !== 'your_resend_api_key'

        if (resendConfigured) {
          const emailJobs = [
            // 1. Confirmación al comprador
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

          // 2. Notificación al admin (si hay email configurado)
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
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
