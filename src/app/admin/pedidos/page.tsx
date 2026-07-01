import { createAdminClient } from '@/lib/supabase/server'
import { Order } from '@/types'
import Link from 'next/link'
import OrdersTable from './OrdersTable'

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>
}) {
  const { estado } = await searchParams
  const supabase = await createAdminClient()

  let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (estado && estado !== 'todos') query = query.eq('status', estado)

  const { data: orders } = await query

  const { data: counts } = await supabase.from('orders').select('status')
  const countByStatus = (counts ?? []).reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})
  const total = counts?.length ?? 0

  const tabs = [
    { key: 'todos',     label: 'Todos',     count: total },
    { key: 'pending',   label: 'Pendientes', count: countByStatus['pending']   ?? 0 },
    { key: 'paid',      label: 'Pagados',    count: countByStatus['paid']      ?? 0 },
    { key: 'shipped',   label: 'Enviados',   count: countByStatus['shipped']   ?? 0 },
    { key: 'delivered', label: 'Entregados', count: countByStatus['delivered'] ?? 0 },
    { key: 'cancelled', label: 'Cancelados', count: countByStatus['cancelled'] ?? 0 },
  ]

  const active = estado ?? 'todos'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <span className="text-sm text-gray-400">{total} en total</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit flex-wrap">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === 'todos' ? '/admin/pedidos' : `/admin/pedidos?estado=${tab.key}`}
            className={`px-3 py-1.5 rounded-md text-sm transition-all flex items-center gap-1.5 ${
              active === tab.key
                ? 'bg-white shadow-sm font-medium text-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                active === tab.key ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </Link>
        ))}
      </div>

      <OrdersTable orders={(orders ?? []) as Order[]} />
    </div>
  )
}
