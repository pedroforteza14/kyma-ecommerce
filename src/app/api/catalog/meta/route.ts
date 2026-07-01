import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { Product } from '@/types'

/**
 * Product catalog feed para Meta Ads (formato CSV).
 * Configurar en Meta Business Manager → Catálogos → Fuente de datos → URL del feed:
 *   https://kyma-ecommerce.vercel.app/api/catalog/meta
 *
 * Campos requeridos por Meta:
 *   id, title, description, availability, condition, price, link, image_link, brand
 */
export async function GET() {
  const supabase = await createAdminClient()
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kyma-ecommerce.vercel.app'

  const { data: products } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (!products?.length) {
    return new NextResponse('id,title\n', {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  // Cabecera CSV
  const headers = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'brand',
    'google_product_category',
    'sale_price',
  ]

  const csvEscape = (s: string) => `"${String(s ?? '').replace(/"/g, '""')}"`

  const rows = (products as Product[]).map((p) => {
    const totalStock = (p.variants ?? []).reduce((s, v) => s + (v.stock ?? 0), 0)
    const availability = totalStock > 0 ? 'in stock' : 'out of stock'
    const price = `${Number(p.price).toFixed(2)} ARS`
    const salePrice = p.original_price && p.original_price > p.price
      ? `${Number(p.price).toFixed(2)} ARS`
      : ''
    const imageLink = p.images?.[0] ?? ''
    const description = p.description ?? p.name

    return [
      csvEscape(p.id),
      csvEscape(p.name),
      csvEscape(description),
      csvEscape(availability),
      csvEscape('new'),
      csvEscape(price),
      csvEscape(`${APP_URL}/producto/${p.slug}`),
      csvEscape(imageLink),
      csvEscape('KYMA'),
      csvEscape('Apparel & Accessories > Clothing'),
      csvEscape(salePrice),
    ].join(',')
  })

  const csv = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Content-Disposition': 'inline; filename="kyma-catalog.csv"',
    },
  })
}
