import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resend } from '@/lib/email/resend'
import { abandonedCartHtml } from '@/lib/email/templates'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createAdminClient()

  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()

  const { data: carts } = await supabase
    .from('abandoned_carts')
    .select('*')
    .eq('reminder_sent', false)
    .eq('recovered', false)
    .lt('created_at', twoHoursAgo)
    .limit(20)

  if (!carts?.length) {
    return NextResponse.json({ sent: 0 })
  }

  const resendConfigured =
    process.env.RESEND_API_KEY &&
    process.env.RESEND_API_KEY !== 'your_resend_api_key'

  let sent = 0

  for (const cart of carts) {
    if (resendConfigured) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kyma-ecommerce.vercel.app'

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? 'KYMA <onboarding@resend.dev>',
          to: [cart.customer_email],
          subject: '¿Te olvidaste algo? Tu carrito te espera 🛒',
          html: abandonedCartHtml({
            customerName: cart.customer_name,
            items: cart.items,
            subtotal: cart.subtotal,
            checkoutUrl: `${appUrl}/checkout`,
          }),
        })
        sent++
      } catch (e) {
        console.error(`Error enviando email a ${cart.customer_email}:`, e)
      }
    }

    await supabase
      .from('abandoned_carts')
      .update({ reminder_sent: true })
      .eq('id', cart.id)
  }

  return NextResponse.json({ sent, total: carts.length })
}
