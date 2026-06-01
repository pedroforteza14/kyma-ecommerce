'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { OrderStatus } from '@/types'
import { resend } from '@/lib/email/resend'
import { shippingNotificationHtml } from '@/lib/email/templates'

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await createAdminClient()
  await supabase.from('orders').update({ status }).eq('id', id)
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
      from: 'KYMA <pedidos@kymaba.com.ar>',
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
