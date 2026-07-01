import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { CartItem } from '@/types'
import { resend } from '@/lib/email/resend'
import { bankTransferHtml, adminOrderNotificationHtml } from '@/lib/email/templates'

export async function POST(req: NextRequest) {
  try {
    const { orderId, discountedTotal, discountAmount } = await req.json()

    const supabase = await createAdminClient()

    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    // Aplicar 15% de descuento por transferencia y marcar como pendiente
    const finalTotal = discountedTotal ?? order.total
    await supabase
      .from('orders')
      .update({
        status:          'pending',
        payment_method:  'bank_transfer',
        total:           finalTotal,
        ...(discountAmount ? { discount: (order.discount ?? 0) + discountAmount } : {}),
      })
      .eq('id', orderId)

    // Enviar emails si Resend está configurado
    const resendConfigured =
      process.env.RESEND_API_KEY &&
      process.env.RESEND_API_KEY !== 'your_resend_api_key'

    if (resendConfigured) {
      const items = order.items as CartItem[]
      const from  = process.env.RESEND_FROM_EMAIL ?? 'KYMA <onboarding@resend.dev>'
      const jobs  = [
        // Email al cliente con datos bancarios
        resend.emails.send({
          from,
          to:      [order.customer_email],
          subject: `Datos para tu transferencia — Pedido #${orderId.slice(0, 8).toUpperCase()}`,
          html:    bankTransferHtml({
            customerName: order.customer_name,
            orderId,
            items,
            total: finalTotal,
          }),
        }),
      ]

      // Notificación al admin
      if (process.env.ADMIN_EMAIL) {
        jobs.push(
          resend.emails.send({
            from,
            to:      [process.env.ADMIN_EMAIL],
            subject: `Transferencia pendiente #${orderId.slice(0, 8).toUpperCase()} — ${order.customer_name}`,
            html:    adminOrderNotificationHtml({
              orderId,
              customerName:  order.customer_name,
              customerEmail: order.customer_email,
              customerPhone: order.customer_phone,
              address:       order.customer_address,
              items,
              total:         finalTotal,
            }),
          }),
        )
      }

      await Promise.all(jobs)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Bank transfer error:', err)
    return NextResponse.json({ error: 'Error procesando el pedido' }, { status: 500 })
  }
}
