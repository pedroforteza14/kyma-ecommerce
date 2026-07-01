'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { CartItem, OrderStatus } from '@/types'
import { resend } from '@/lib/email/resend'
import { orderConfirmationHtml, shippingNotificationHtml } from '@/lib/email/templates'

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await createAdminClient()

  // Traer el pedido antes de actualizar para poder mandar el email
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  await supabase.from('orders').update({ status }).eq('id', id)

  // Si pasa a "pagado" Y antes NO estaba pagado → email de confirmación (evita duplicados)
  if (status === 'paid' && order && order.status !== 'paid') {
    const resendConfigured =
      process.env.RESEND_API_KEY &&
      process.env.RESEND_API_KEY !== 'your_resend_api_key'

    if (resendConfigured) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'KYMA <onboarding@resend.dev>',
        to: [order.customer_email],
        subject: `¡Tu pedido fue confirmado! #${id.slice(0, 8).toUpperCase()}`,
        html: orderConfirmationHtml({
          customerName: order.customer_name,
          orderId:      id,
          items:        order.items as CartItem[],
          total:        order.total,
          address:      order.customer_address,
        }),
      })
    }
  }

  revalidatePath(`/admin/pedidos/${id}`)
  revalidatePath('/admin/pedidos')
}

export async function updateOrderTracking(
  id: string,
  carrier: string,
  trackingNumber: string,
) {
  const supabase = await createAdminClient()

  // Traer el pedido para el email
  const { data: order } = await supabase
    .from('orders')
    .select('customer_name, customer_email, status')
    .eq('id', id)
    .single()

  // Guardar tracking + marcar como enviado
  await supabase
    .from('orders')
    .update({ tracking_number: trackingNumber, carrier, status: 'shipped' })
    .eq('id', id)

  // Email de notificación al cliente (si Resend está configurado)
  const resendConfigured =
    process.env.RESEND_API_KEY &&
    process.env.RESEND_API_KEY !== 'your_resend_api_key'

  if (resendConfigured && order) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'KYMA <onboarding@resend.dev>',
      to: [order.customer_email],
      subject: `Tu pedido está en camino 📦 #${id.slice(0, 8).toUpperCase()}`,
      html: shippingNotificationHtml({
        customerName: order.customer_name,
        orderId: id,
        carrier,
        trackingNumber,
      }),
    })
  }

  revalidatePath(`/admin/pedidos/${id}`)
  revalidatePath('/admin/pedidos')
}
