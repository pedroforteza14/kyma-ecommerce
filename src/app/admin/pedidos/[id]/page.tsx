import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { updateOrderStatus } from '@/lib/actions/orders'
import { CartItem, Order, OrderStatus } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import TrackingForm from '@/components/admin/TrackingForm'

type Props = {
  params: Promise<{ id: string }>
}

const statusColors: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  paid:      'bg-green-100 text-green-800',
  shipped:   'bg-blue-100 text-blue-800',
  delivered: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  pending:   'Pendiente',
  paid:      'Pagado',
  shipped:   'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const allStatuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

const fmt = (price: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price)

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createAdminClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (!order) notFound()

  const items = order.items as CartItem[]

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <a href="/admin/pedidos" className="text-sm text-gray-500 hover:text-black transition-colors">
            ← Volver a pedidos
          </a>
          <h1 className="text-2xl font-bold mt-2">Pedido</h1>
          <p className="text-sm text-gray-400 font-mono mt-1">{order.id}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
          {statusLabels[order.status]}
        </span>
      </div>

      {/* Cliente + Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border rounded-lg p-5 space-y-2">
          <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-3">Cliente</h2>
          <p className="font-medium">{order.customer_name}</p>
          <a href={`mailto:${order.customer_email}`} className="text-sm text-blue-600 hover:underline block">
            {order.customer_email}
          </a>
          <a
            href={`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-600 hover:underline block"
          >
            📱 {order.customer_phone}
          </a>
          <p className="text-sm text-gray-600 pt-2 border-t mt-2">{order.customer_address}</p>
          <div className="flex gap-2 pt-3">
            <a
              href={`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${order.customer_name.split(' ')[0]}, te escribimos desde KYMA sobre tu pedido #${order.id.slice(0,8).toUpperCase()} 👋`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:${order.customer_email}?subject=Tu pedido KYMA %23${order.id.slice(0,8).toUpperCase()}`}
              className="flex-1 text-center text-xs border border-gray-300 px-3 py-2 rounded hover:border-black transition-colors"
            >
              Email
            </a>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-5 space-y-2">
          <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-3">Resumen</h2>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total</span>
            <span className="font-bold">{fmt(order.total)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Descuento ({order.coupon_code})</span>
              <span>-{fmt(order.discount)}</span>
            </div>
          )}
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
        <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-4">Productos</h2>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <div className="relative w-14 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.slug && (
                    <Link
                      href={`/producto/${item.slug}`}
                      target="_blank"
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Ver en tienda"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </Link>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Talle {item.size}{item.color ? ` · ${item.color}` : ''} · x{item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold">{fmt(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking de envío */}
      <div className="bg-white border rounded-lg p-5 mb-6">
        <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-4">
          Seguimiento de envío
        </h2>
        <TrackingForm
          orderId={id}
          currentCarrier={order.carrier}
          currentTracking={order.tracking_number}
        />
      </div>

      {/* Cambiar estado */}
      <div className="bg-white border rounded-lg p-5">
        <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-4">
          Actualizar estado manualmente
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
