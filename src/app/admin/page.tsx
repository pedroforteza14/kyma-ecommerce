import { createAdminClient } from '@/lib/supabase/server'
import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createAdminClient()

  const [{ count: productCount }, { count: orderCount }, { data: revenue }] =
    await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total').eq('status', 'paid'),
    ])

  const totalRevenue =
    revenue?.reduce((acc, o) => acc + Number(o.total), 0) ?? 0

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)

  const stats = [
    { label: 'Productos activos', value: productCount ?? 0, icon: Package },
    { label: 'Pedidos totales', value: orderCount ?? 0, icon: ShoppingBag },
    { label: 'Ingresos pagados', value: formatPrice(totalRevenue), icon: DollarSign },
    { label: 'Tasa de conversión', value: '—', icon: TrendingUp },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-lg p-6 border space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{label}</p>
              <Icon size={18} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
