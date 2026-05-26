import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { updateOrderStatus } from '@/lib/actions/orders'
import { CartItem, Order, OrderStatus } from '@/types'
import Image from 'next/image'

type Props = {
  params: Promise<{ id: string }>
}

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

const allStatuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createAdminClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (!order) notFound()

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)

  const items = order.items as CartItem[]

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <a
            href="/admin/pedidos"
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            ← Volver a pedidos
          </a>
          <h1 className="text-2xl font-bold mt-2">Pedido</h1>
          <p className="text-sm text-gray-400 font-mono mt-1">{order.id}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Cliente */}
        <div className="bg-white border rounded-lg p-5 space-y-2">
          <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-3">
            Cliente
          </h2>
          <p className="font-medium">{order.customer_name}</p>
          <p className="text-sm text-gray-600">{order.customer_email}</p>
          <p className="text-sm text-gray-600">{order.customer_phone}</p>
          <p className="text-sm text-gray-600 pt-1 border-t">{order.customer_address}</p>
        </div>

        {/* Resumen */}
        <div className="bg-white border rounded-lg p-5 space-y-2">
          <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-3">
            Resumen
          </h2>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total</span>
            <span className="font-bold">{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fecha</span>
            <span>{new Date(order.created_at).toLocaleDateString('es-AR')}</span>
          </div>
          {order.mp_payment_id && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">MP ID</span>
              <span className="font-mono text-xs">{order.mp_payment_id}</span>
            </div>
          )}
        </div>
      </div>

      {/* Productos */}
      <div className="bg-white border rounded-lg p-5 mb-6">
        <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-4">
          Productos
        </h2>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <div className="relative w-14 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Talle {item.size}{item.color ? ` · ${item.color}` : ''} · x{item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cambiar estado */}
      <div className="bg-white border rounded-lg p-5">
        <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-4">
          Actualizar estado
        </h2>
        <div className="flex flex-wrap gap-2">
          {allStatuses.map((status) => (
            <form key={status} action={updateOrderStatus.bind(null, id, status)}>
              <button
                type="submit"
                disabled={order.status === status}
                className={`px-4 py-2 text-sm rounded border transition-all ${
                  order.status === status
                    ? 'bg-black text-white border-black cursor-default'
                    : 'border-gray-300 hover:border-black'
                }`}
              >
                {statusLabels[status]}
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  )
}
