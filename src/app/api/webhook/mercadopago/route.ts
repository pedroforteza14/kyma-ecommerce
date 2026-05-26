import { NextRequest, NextResponse } from 'next/server'
import MercadoPago, { Payment } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/server'

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

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
