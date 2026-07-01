'use server'

import { createAdminClient } from '@/lib/supabase/server'

type CreateCouponInput = {
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_amount: number | null
  max_uses: number | null
  expires_at: string | null
}

export async function createCoupon(input: CreateCouponInput) {
  try {
    const supabase = await createAdminClient()

    const { data, error } = await supabase
      .from('coupons')
      .insert({
        code: input.code,
        description: input.description,
        discount_type: input.discount_type,
        discount_value: input.discount_value,
        min_amount: input.min_amount,
        max_uses: input.max_uses,
        expires_at: input.expires_at ? new Date(input.expires_at).toISOString() : null,
        active: true,
        used_count: 0,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return { error: 'Ya existe un cupón con ese código', coupon: null }
      }
      return { error: error.message, coupon: null }
    }

    return { error: null, coupon: data }
  } catch {
    return { error: 'Error al crear el cupón', coupon: null }
  }
}

export async function toggleCoupon(id: string, active: boolean) {
  try {
    const supabase = await createAdminClient()
    const { error } = await supabase
      .from('coupons')
      .update({ active })
      .eq('id', id)

    if (error) return { error: error.message }
    return { error: null }
  } catch {
    return { error: 'Error al actualizar el cupón' }
  }
}

export async function deleteCoupon(id: string) {
  try {
    const supabase = await createAdminClient()
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id)

    if (error) return { error: error.message }
    return { error: null }
  } catch {
    return { error: 'Error al eliminar el cupón' }
  }
}
