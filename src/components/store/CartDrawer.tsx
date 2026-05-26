'use client'

import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import Image from 'next/image'

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total } =
    useCartStore()

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold tracking-wide">
            Mi carrito ({items.length})
          </h2>
          <button
            onClick={toggleCart}
            className="hover:opacity-60 transition-opacity"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-sm">Tu carrito está vacío</p>
              <button
                onClick={toggleCart}
                className="text-sm text-black underline underline-offset-4"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.variant_id} className="flex gap-4">
                {/* Imagen */}
                <div className="relative w-20 h-24 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-tight">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Talle: {item.size}
                    {item.color ? ` · ${item.color}` : ''}
                  </p>
                  <p className="text-sm font-semibold">
                    {formatPrice(item.price)}
                  </p>

                  {/* Cantidad + eliminar */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() =>
                          updateQuantity(item.variant_id, item.quantity - 1)
                        }
                        className="px-2 py-1 hover:bg-gray-50"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.variant_id, item.quantity + 1)
                        }
                        className="px-2 py-1 hover:bg-gray-50"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.variant_id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="font-semibold">{formatPrice(total())}</span>
            </div>
            <p className="text-xs text-gray-400">
              Envío calculado al finalizar la compra
            </p>
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="block w-full bg-black text-white text-center py-4 text-sm tracking-widest font-medium hover:bg-gray-900 transition-colors"
            >
              FINALIZAR COMPRA
            </Link>
            <button
              onClick={toggleCart}
              className="block w-full text-center text-sm text-gray-500 hover:text-black transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
