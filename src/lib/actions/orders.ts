'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { OrderStatus } from '@/types'

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await createAdminClient()
  await supabase.from('orders').update({ status }).eq('id', id)
  revalidatePath(`/admin/pedidos/${id}`)
  revalidatePath('/admin/pedidos')
}
