import { NextRequest, NextResponse } from 'next/server'
import MercadoPago, { Preference } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/server'
import { CartItem } from '@/types'

const mp = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, address, items, total } = body as {
      name: string
      email: string
      phone: string
      address: string
      items: CartItem[]
      total: number
    }

    // Crear el pedido en Supabase (estado pendiente)
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
      })
      .select()
      .single()

    if (error) throw error

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!

    // Crear preferencia de MercadoPago
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
        payer: {
          name,
          email,
          phone: { area_code: '54', number: phone },
        },
        external_reference: order.id,
        back_urls: {
          success: `${appUrl}/checkout/exito?order=${order.id}`,
          failure: `${appUrl}/checkout/error`,
          pending: `${appUrl}/checkout/pendiente?order=${order.id}`,
        },
        auto_return: 'approved',
        notification_url: `${appUrl}/api/webhook/mercadopago`,
      },
    })

    return NextResponse.json({ init_point: result.init_point })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Error procesando el pago' }, { status: 500 })
  }
}
