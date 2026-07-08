'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateVariantStock(variantId: string, stock: number, productId: string) {
  const supabase = await createAdminClient()
  await supabase
    .from('product_variants')
    .update({ stock: Math.max(0, stock) })
    .eq('id', variantId)
  revalidatePath('/', 'layout')
}
