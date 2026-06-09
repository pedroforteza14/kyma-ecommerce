import { NextRequest, NextResponse } from 'next/server'
import MercadoPago, { Preference } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/server'
import { CartItem } from '@/types'

const mp = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, address, items, total, coupon_code, discount } = body as {
      name: string
      email: string
      phone: string
      address: string
      items: CartItem[]
      total: number
      coupon_code: string | null
      discount: number
    }

    const supabase = await createAdminClient()

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        customer_address: address,
        items,
        total,
        status: 'pending',
        ...(coupon_code ? { coupon_code, discount } : {}),
      })
      .select()
      .single()

    if (!error && coupon_code) {
      await supabase.rpc('increment_coupon_uses', { coupon_code })
    }

    if (error) throw error

    // Crear preferencia de MP (opcional — el Brick funciona igual sin ella)
    let preferenceId: string | null = null
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL!
      const preference = new Preference(mp)
      const result = await preference.create({
        body: {
          items: items.map((item) => ({
            id: item.variant_id,
            title: `${item.name} - Talle ${item.size}`,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: 'ARS',
          })),
          payer: { name, email },
          external_reference: order.id,
          back_urls: {
            success: `${appUrl}/checkout/exito?order=${order.id}&total=${total}`,
            failure: `${appUrl}/checkout/error`,
            pending: `${appUrl}/checkout/pendiente?order=${order.id}`,
          },
          auto_return: 'approved',
          notification_url: `${appUrl}/api/webhook/mercadopago`,
        },
      })
      preferenceId = result.id ?? null
    } catch (mpErr) {
      // Si MP falla (ej. credenciales no configuradas), igual seguimos
      // El Brick puede inicializarse solo con el monto
      console.warn('MP preference creation failed (non-fatal):', mpErr)
    }

    return NextResponse.json({
      orderId: order.id,
      preferenceId,
    })
  } catch (err) {
    console.error('Create order error:', JSON.stringify(err, Object.getOwnPropertyNames(err)))
    return NextResponse.json({ error: 'Error creando el pedido' }, { status: 500 })
  }
}
