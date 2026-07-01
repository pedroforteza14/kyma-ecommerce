import { createAdminClient } from '@/lib/supabase/server'
import { Package, ShoppingBag, DollarSign, Clock } from 'lucide-react'
import { CartItem } from '@/types'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)

const fmtDate = (d: Date) =>
  d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })

export default async function AdminDashboard() {
  const supabase = await createAdminClient()

  // ── Queries paralelas ────────────────────────────────────────────────────
  const [
    { count: productCount },
    { count: orderCount },
    { data: paidOrders },
    { data: pendingOrders },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total, created_at').eq('status', 'paid'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('orders')
      .select('id, customer_name, total, status, created_at')
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  const totalRevenue = paidOrders?.reduce((acc, o) => acc + Number(o.total), 0) ?? 0

  // ── Ventas por día (últimos 7 días) ──────────────────────────────────────
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return d
  })

  const salesByDay = days.map((day) => {
    const next = new Date(day)
    next.setDate(day.getDate() + 1)
    const dayOrders = paidOrders?.filter((o) => {
      const t = new Date(o.created_at)
      return t >= day && t < next
    }) ?? []
    return {
      date: day,
      total: dayOrders.reduce((s, o) => s + Number(o.total), 0),
      count: dayOrders.length,
    }
  })

  const maxDayTotal = Math.max(...salesByDay.map((d) => d.total), 1)

  // ── Productos más vendidos ────────────────────────────────────────────────
  const allPaidOrders = await supabase
    .from('orders')
    .select('items')
    .eq('status', 'paid')

  const productSales: Record<string, { name: string; qty: number; revenue: number }> = {}

  for (const order of allPaidOrders.data ?? []) {
    const items = order.items as CartItem[]
    for (const item of items) {
      if (!productSales[item.name]) {
        productSales[item.name] = { name: item.name, qty: 0, revenue: 0 }
      }
      productSales[item.name].qty += item.quantity
      productSales[item.name].revenue += item.price * item.quantity
    }
  }

  const bestSellers = Object.values(productSales)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)

  const maxQty = Math.max(...bestSellers.map((p) => p.qty), 1)

  // ── Ingresos de hoy ──────────────────────────────────────────────────────
  const todayTotal = salesByDay[salesByDay.length - 1]?.total ?? 0

  const statusLabel: Record<string, { label: string; cls: string }> = {
    paid:      { label: 'Pagado',    cls: 'bg-green-100 text-green-700'  },
    pending:   { label: 'Pendiente', cls: 'bg-yellow-100 text-yellow-700'},
    cancelled: { label: 'Cancelado', cls: 'bg-red-100 text-red-600'      },
    shipped:   { label: 'Enviado',   cls: 'bg-blue-100 text-blue-700'    },
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Productos activos', value: productCount ?? 0,    icon: Package    },
          { label: 'Pedidos totales',   value: orderCount ?? 0,      icon: ShoppingBag},
          { label: 'Ingresos pagados',  value: fmt(totalRevenue),    icon: DollarSign },
          { label: 'Hoy',              value: fmt(todayTotal),       icon: DollarSign },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-lg p-5 border space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{label}</p>
              <Icon size={16} className="text-gray-300" />
            </div>
            <p className="text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* ── Ventas últimos 7 días ── */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-sm font-semibold mb-5 text-gray-700">Ventas — últimos 7 días</h2>
          <div className="flex items-end gap-2 h-36">
            {salesByDay.map((day, i) => {
              const heightPct = maxDayTotal > 0 ? (day.total / maxDayTotal) * 100 : 0
              const isToday = i === salesByDay.length - 1
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  {day.total > 0 && (
                    <span className="text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {fmt(day.total)}
                    </span>
                  )}
                  <div className="w-full flex items-end" style={{ height: '96px' }}>
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        isToday ? 'bg-[#111]' : 'bg-gray-200 group-hover:bg-gray-300'
                      }`}
                      style={{ height: `${Math.max(heightPct, day.total > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                  <span className={`text-[9px] uppercase tracking-wide ${isToday ? 'text-[#111] font-semibold' : 'text-gray-400'}`}>
                    {fmtDate(day.date).split(' ')[0]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Pedidos pendientes + recientes ── */}
        <div className="space-y-4">
          {/* Pendientes */}
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-800">{(pendingOrders as unknown as number) ?? 0}</p>
              <p className="text-xs text-yellow-600">Pedidos pendientes de pago</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid: más vendidos + últimos pedidos ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Más vendidos */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-sm font-semibold mb-5 text-gray-700">Más vendidos</h2>
          {bestSellers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sin ventas todavía</p>
          ) : (
            <div className="space-y-3">
              {bestSellers.map((product, i) => (
                <div key={product.name} className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-gray-700 truncate max-w-[200px]">
                      <span className="text-gray-400 mr-1.5">{i + 1}.</span>
                      {product.name}
                    </span>
                    <span className="text-gray-500 flex-shrink-0 ml-2">
                      {product.qty} ud.
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#111] rounded-full transition-all duration-500"
                      style={{ width: `${(product.qty / maxQty) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Últimos pedidos */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-sm font-semibold mb-5 text-gray-700">Últimos pedidos</h2>
          {!recentOrders?.length ? (
            <p className="text-sm text-gray-400 text-center py-8">Sin pedidos todavía</p>
          ) : (
            <div className="divide-y">
              {recentOrders.map((order) => {
                const s = statusLabel[order.status] ?? { label: order.status, cls: 'bg-gray-100 text-gray-500' }
                return (
                  <div key={order.id} className="py-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{order.customer_name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        #{order.id.slice(0, 8).toUpperCase()} ·{' '}
                        {new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.cls}`}>
                        {s.label}
                      </span>
                      <span className="text-xs font-medium">{fmt(Number(order.total))}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
