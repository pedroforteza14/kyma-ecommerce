import { createAdminClient } from '@/lib/supabase/server'
import { CartItem } from '@/types'
import { TrendingUp, ShoppingBag, DollarSign, Users, Package } from 'lucide-react'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return fmt(n)
}

// ── Helpers de fecha (Buenos Aires UTC-3) ────────────────────────────────────
function startOf(period: 'day' | 'week' | 'month'): Date {
  const now = new Date()
  if (period === 'day') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }
  if (period === 'week') {
    const d = new Date(now)
    d.setDate(d.getDate() - d.getDay())
    d.setHours(0, 0, 0, 0)
    return d
  }
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

export default async function BalancePage() {
  const supabase = await createAdminClient()

  // Traer todos los pedidos del último año para los cálculos
  const yearAgo = new Date()
  yearAgo.setFullYear(yearAgo.getFullYear() - 1)

  const { data: orders = [] } = await supabase
    .from('orders')
    .select('id, total, status, items, created_at, coupon_code, discount')
    .gte('created_at', yearAgo.toISOString())
    .order('created_at', { ascending: true })

  const allOrders = orders ?? []

  // Solo pagados para revenue
  const paid = allOrders.filter((o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')

  // ── Métricas por período ──────────────────────────────────────────────────
  const now = new Date()
  const todayStart = startOf('day')
  const weekStart  = startOf('week')
  const monthStart = startOf('month')

  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 1)

  const filter = (from: Date, to = now) =>
    paid.filter((o) => {
      const d = new Date(o.created_at)
      return d >= from && d < to
    })

  const toRevenue = (list: typeof paid) => list.reduce((s, o) => s + Number(o.total), 0)

  const todayOrders    = filter(todayStart)
  const weekOrders     = filter(weekStart)
  const monthOrders    = filter(monthStart)
  const prevMonthOrders= filter(prevMonthStart, prevMonthEnd)

  const todayRevenue   = toRevenue(todayOrders)
  const weekRevenue    = toRevenue(weekOrders)
  const monthRevenue   = toRevenue(monthOrders)
  const prevMonthRev   = toRevenue(prevMonthOrders)

  const monthGrowth = prevMonthRev > 0
    ? Math.round(((monthRevenue - prevMonthRev) / prevMonthRev) * 100)
    : null

  const totalRevenue   = toRevenue(paid)
  const avgTicket      = paid.length > 0 ? totalRevenue / paid.length : 0

  // ── Pedidos por estado ────────────────────────────────────────────────────
  const byStatus = allOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  // ── Top productos ─────────────────────────────────────────────────────────
  const productMap = new Map<string, { name: string; qty: number; revenue: number }>()
  for (const order of paid) {
    const items = (order.items ?? []) as CartItem[]
    for (const item of items) {
      const key = item.name
      const cur = productMap.get(key) ?? { name: item.name, qty: 0, revenue: 0 }
      productMap.set(key, {
        name: item.name,
        qty: cur.qty + item.quantity,
        revenue: cur.revenue + item.price * item.quantity,
      })
    }
  }
  const topProducts = [...productMap.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // ── Gráfico diario (últimos 30 días) ─────────────────────────────────────
  const DAYS = 30
  const dailyMap = new Map<string, number>()
  for (let i = 0; i < DAYS; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (DAYS - 1 - i))
    dailyMap.set(d.toISOString().slice(0, 10), 0)
  }
  for (const order of paid) {
    const key = order.created_at.slice(0, 10)
    if (dailyMap.has(key)) {
      dailyMap.set(key, (dailyMap.get(key) ?? 0) + Number(order.total))
    }
  }
  const dailyData = [...dailyMap.entries()].map(([date, revenue]) => ({ date, revenue }))
  const maxRevenue = Math.max(...dailyData.map((d) => d.revenue), 1)

  const statusLabels: Record<string, string> = {
    pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado',
    delivered: 'Entregado', cancelled: 'Cancelado',
  }
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-400', paid: 'bg-green-500',
    shipped: 'bg-blue-500', delivered: 'bg-purple-500', cancelled: 'bg-red-400',
  }

  // ── Pedidos recientes ─────────────────────────────────────────────────────
  const recent = [...allOrders].reverse().slice(0, 8)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Balance</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen financiero del negocio</p>
      </div>

      {/* ── Métricas principales ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Hoy',
            value: fmtShort(todayRevenue),
            sub: `${todayOrders.length} pedido${todayOrders.length !== 1 ? 's' : ''}`,
            icon: DollarSign,
            color: 'text-green-600',
          },
          {
            label: 'Esta semana',
            value: fmtShort(weekRevenue),
            sub: `${weekOrders.length} pedido${weekOrders.length !== 1 ? 's' : ''}`,
            icon: TrendingUp,
            color: 'text-blue-600',
          },
          {
            label: 'Este mes',
            value: fmtShort(monthRevenue),
            sub: monthGrowth !== null
              ? `${monthGrowth >= 0 ? '+' : ''}${monthGrowth}% vs mes anterior`
              : `${monthOrders.length} pedidos`,
            icon: ShoppingBag,
            color: 'text-purple-600',
          },
          {
            label: 'Ticket promedio',
            value: fmtShort(avgTicket),
            sub: `${paid.length} pedido${paid.length !== 1 ? 's' : ''} cobrados`,
            icon: Users,
            color: 'text-orange-500',
          },
        ].map((card) => (
          <div key={card.label} className="bg-white border rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                {card.label}
              </p>
              <card.icon size={16} className={card.color} />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Gráfico ventas 30 días ── */}
        <div className="lg:col-span-2 bg-white border rounded-lg p-5">
          <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-6">
            Ventas — últimos 30 días
          </h2>
          <div className="flex items-end gap-[3px] h-40">
            {dailyData.map((d) => {
              const height = maxRevenue > 0 ? Math.max((d.revenue / maxRevenue) * 100, d.revenue > 0 ? 4 : 0) : 0
              const date = new Date(d.date + 'T12:00:00')
              const isToday = d.date === new Date().toISOString().slice(0, 10)
              return (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col items-center justify-end gap-1 group relative"
                >
                  {/* Tooltip */}
                  {d.revenue > 0 && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {fmt(d.revenue)}<br />
                      <span className="text-gray-400">
                        {date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  )}
                  <div
                    className={`w-full rounded-sm transition-all ${isToday ? 'bg-black' : 'bg-gray-200 group-hover:bg-gray-400'}`}
                    style={{ height: `${height}%`, minHeight: d.revenue > 0 ? '4px' : '2px' }}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            <span>
              {new Date(dailyData[0]?.date + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
            </span>
            <span>Hoy</span>
          </div>
        </div>

        {/* ── Pedidos por estado ── */}
        <div className="bg-white border rounded-lg p-5">
          <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-5">
            Por estado
          </h2>
          <div className="space-y-3">
            {Object.entries(byStatus)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => {
                const total = allOrders.length
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{statusLabels[status] ?? status}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${statusColors[status] ?? 'bg-gray-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            {allOrders.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Sin pedidos todavía</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Top productos + Recientes ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top productos */}
        <div className="bg-white border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-5">
            <Package size={14} className="text-gray-400" />
            <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
              Top productos
            </h2>
          </div>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Sin datos todavía</p>
            ) : (
              topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.qty} unidades</p>
                  </div>
                  <span className="text-sm font-semibold text-right">{fmtShort(p.revenue)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pedidos recientes */}
        <div className="bg-white border rounded-lg p-5">
          <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-5">
            Pedidos recientes
          </h2>
          <div className="space-y-3">
            {recent.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Sin pedidos todavía</p>
            ) : (
              recent.map((o) => (
                <a
                  key={o.id}
                  href={`/admin/pedidos/${o.id}`}
                  className="flex items-center justify-between hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded transition-colors"
                >
                  <div>
                    <p className="text-sm font-mono text-gray-500">#{o.id.slice(0, 8)}</p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(o.created_at).toLocaleDateString('es-AR', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{fmt(o.total)}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      { pending:'bg-yellow-100 text-yellow-700', paid:'bg-green-100 text-green-700',
                        shipped:'bg-blue-100 text-blue-700', delivered:'bg-purple-100 text-purple-700',
                        cancelled:'bg-red-100 text-red-700' }[o.status as string] ?? 'bg-gray-100 text-gray-600'
                    }`}>
                      {statusLabels[o.status as string] ?? o.status}
                    </span>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
