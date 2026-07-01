import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email, name, items, subtotal } = await req.json()

    if (!email || !items?.length) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    const { error } = await supabase.from('abandoned_carts').upsert(
      {
        customer_email: email,
        customer_name: name || null,
        items,
        subtotal,
        recovered: false,
        reminder_sent: false,
      },
      { onConflict: 'customer_email' }
    )

    if (error) {
      console.error('Error guardando carrito abandonado:', error.message)
      return NextResponse.json({ ok: false })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
