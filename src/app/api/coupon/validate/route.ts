import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json() as { code: string; subtotal: number }

    if (!code || typeof subtotal !== 'number') {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Buscar cupón (case-insensitive)
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .ilike('code', code.trim())
      .eq('active', true)
      .single()

    if (error || !coupon) {
      return NextResponse.json({ error: 'Cupón no válido' }, { status: 404 })
    }

    // Verificar vencimiento
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: 'El cupón está vencido' }, { status: 400 })
    }

    // Verificar usos disponibles
    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ error: 'El cupón ya alcanzó su límite de usos' }, { status: 400 })
    }

    // Verificar monto mínimo
    if (coupon.min_amount && subtotal < coupon.min_amount) {
      return NextResponse.json(
        { error: `Monto mínimo para este cupón: $${coupon.min_amount.toLocaleString('es-AR')}` },
        { status: 400 },
      )
    }

    // Calcular descuento
    let discount = 0
    if (coupon.discount_type === 'percentage') {
      discount = Math.round((subtotal * coupon.discount_value) / 100)
    } else {
      discount = Math.min(coupon.discount_value, subtotal)
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount, // monto final a descontar en ARS
    })
  } catch (err) {
    console.error('Coupon validate error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
