'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export async function saveProduct(formData: FormData) {
  const supabase = await createAdminClient()

  const id = formData.get('id') as string | null
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = Number(formData.get('price'))
  const original_price = formData.get('original_price')
    ? Number(formData.get('original_price'))
    : null
  const category_id = formData.get('category_id') as string
  const is_active = formData.get('is_active') === 'true'
  const is_featured = formData.get('is_featured') === 'true'
  const images = (formData.get('images') as string)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const sizeStocksRaw = formData.get('sizeStocks') as string
  const sizeStocks: Record<string, number> = sizeStocksRaw ? JSON.parse(sizeStocksRaw) : {}

  const extraCategoryIdsRaw = formData.get('extraCategoryIds') as string
  const extra_category_ids: string[] = extraCategoryIdsRaw ? JSON.parse(extraCategoryIdsRaw) : []

  const productData = {
    name,
    slug: slugify(name),
    description,
    price,
    original_price,
    images,
    category_id,
    extra_category_ids,
    is_active,
    is_featured,
  }

  let productId = id

  if (id) {
    await supabase.from('products').update(productData).eq('id', id)
    await supabase.from('product_variants').delete().eq('product_id', id)
    if (Object.keys(sizeStocks).length > 0) {
      await supabase.from('product_variants').insert(
        Object.entries(sizeStocks).map(([size, stock]) => ({ product_id: id, size, stock }))
      )
    }
  } else {
    const { data: product } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()

    productId = product?.id ?? null

    if (product && Object.keys(sizeStocks).length > 0) {
      await supabase.from('product_variants').insert(
        Object.entries(sizeStocks).map(([size, stock]) => ({ product_id: product.id, size, stock }))
      )
    }
  }

  revalidatePath('/', 'layout')
  if (productId) {
    redirect(`/admin/productos/${productId}`)
  } else {
    redirect('/admin/productos')
  }
}

export async function toggleProductStatus(id: string, is_active: boolean) {
  const supabase = await createAdminClient()
  await supabase.from('products').update({ is_active }).eq('id', id)
  revalidatePath('/', 'layout')
}

export async function deleteProduct(id: string) {
  const supabase = await createAdminClient()
  await supabase.from('products').delete().eq('id', id)
  revalidatePath('/', 'layout')
  redirect('/admin/productos')
}
