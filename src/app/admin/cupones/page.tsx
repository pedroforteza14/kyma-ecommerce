export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/server'
import CouponManager from './CouponManager'

export default async function CuponesPage() {
  const supabase = await createAdminClient()

  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Cupones</h1>
        <p className="text-sm text-gray-500 mt-1">Creá y gestioná cupones de descuento</p>
      </div>

      <CouponManager initialCoupons={coupons ?? []} />
    </div>
  )
}
