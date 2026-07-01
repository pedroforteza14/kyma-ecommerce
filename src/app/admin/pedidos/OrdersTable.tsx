'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Order } from '@/types'
import { updateOrderStatus } from '@/lib/actions/orders'

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  paid:      'bg-green-100 text-green-800',
  shipped:   'bg-blue-100 text-blue-800',
  delivered: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
}

const STATUS_LABELS: Record<string, string> = {
  pending:   'Pendiente',
  paid:      'Pagado',
  shipped:   'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const NEXT_STATUS: Record<string, { status: string; label: string; color: string } | null> = {
  pending:   { status: 'paid',      label: '✓ Marcar pagado',  color: 'bg-green-500 hover:bg-green-600 text-white' },
  paid:      { status: 'shipped',   label: '✓ Marcar enviado', color: 'bg-blue-500 hover:bg-blue-600 text-white'   },
  shipped:   { status: 'delivered', label: '✓ Entregado',      color: 'bg-purple-500 hover:bg-purple-600 text-white' },
  delivered: null,
  cancelled: null,
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [localOrders, setLocalOrders] = useState(orders)
  const [pending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusChange = (id: string, newStatus: string) => {
    setLoadingId(id)
    startTransition(async () => {
      await updateOrderStatus(id, newStatus as any)
      setLocalOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus as Order['status'] } : o))
      )
      setLoadingId(null)
    })
  }

  if (localOrders.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-12 text-center text-gray-400">
        No hay pedidos en esta categoría.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            {['#', 'Cliente', 'Total', 'Estado', 'Fecha', 'Acción rápida', ''].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 tracking-wide uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {localOrders.map((order) => {
            const next = NEXT_STATUS[order.status]
            const isLoading = loadingId === order.id

            return (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">

                {/* ID */}
                <td className="px-4 py-4 font-mono text-xs text-gray-400">
                  <Link href={`/admin/pedidos/${order.id}`} className="hover:text-black">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </Link>
                </td>

                {/* Cliente */}
                <td className="px-4 py-4">
                  <Link href={`/admin/pedidos/${order.id}`} className="font-medium hover:underline block">
                    {order.customer_name}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <a href={`mailto:${order.customer_email}`} className="text-xs text-gray-400 hover:text-blue-600 transition-colors truncate max-w-[160px]">
                      {order.customer_email}
                    </a>
                    {order.customer_phone && (
                      <a
                        href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded hover:bg-green-100 transition-colors flex-shrink-0"
                      >
                        WA
                      </a>
                    )}
                  </div>
                </td>

                {/* Total */}
                <td className="px-4 py-4 font-semibold">{fmt(order.total)}</td>

                {/* Estado */}
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </td>

                {/* Fecha */}
                <td className="px-4 py-4 text-gray-500 text-xs">
                  {new Date(order.created_at).toLocaleDateString('es-AR', {
                    day: '2-digit', month: '2-digit', year: '2-digit',
                  })}
                </td>

                {/* Acción rápida */}
                <td className="px-4 py-4">
                  {next ? (
                    <button
                      onClick={() => handleStatusChange(order.id, next.status)}
                      disabled={isLoading}
                      className={`text-xs px-3 py-1.5 rounded transition-colors ${next.color} disabled:opacity-50`}
                    >
                      {isLoading ? '...' : next.label}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>

                {/* Ver detalle */}
                <td className="px-4 py-4">
                  <Link href={`/admin/pedidos/${order.id}`} className="text-xs text-blue-600 hover:underline font-medium">
                    Ver →
                  </Link>
                </td>

              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
