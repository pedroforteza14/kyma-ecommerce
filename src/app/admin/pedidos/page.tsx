import { createAdminClient } from '@/lib/supabase/server'
import { Order } from '@/types'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export default async function OrdersPage() {
  const supabase = await createAdminClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Pedidos</h1>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['#', 'Cliente', 'Total', 'Estado', 'Fecha', 'Acciones'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 tracking-wide uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders?.map((order: Order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-gray-400 font-mono text-xs">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-xs text-gray-500">{order.customer_email}</p>
                </td>
                <td className="px-4 py-4 font-semibold">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('es-AR')}
                </td>
                <td className="px-4 py-4">
                  <a
                    href={`/admin/pedidos/${order.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Ver detalle
                  </a>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  No hay pedidos todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
