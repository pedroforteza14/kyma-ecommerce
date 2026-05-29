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
      <div className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm" onClick={toggleCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white z-50 flex flex-col animate-slide-left">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-display text-xl font-light tracking-wide">Mi carrito</h2>
            {items.length > 0 && (
              <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mt-0.5">
                {items.length} {items.length === 1 ? 'producto' : 'productos'}
              </p>
            )}
          </div>
          <button onClick={toggleCart} className="hover:opacity-50 transition-opacity">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <ShoppingBag size={44} strokeWidth={1} className="text-gray-200" />
              <div>
                <p className="font-display text-xl font-light text-gray-400 italic">Tu carrito está vacío</p>
                <p className="text-xs text-gray-300 mt-1 tracking-wide">Explorá la nueva colección</p>
              </div>
              <button
                onClick={toggleCart}
                className="text-[11px] tracking-[0.25em] uppercase border-b border-[#111] pb-0.5"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.variant_id} className="flex gap-4">
                {/* Imagen */}
                <div className="relative w-20 h-24 bg-[#f5f4f0] flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-2xl text-gray-200 italic">K</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1.5">
                  <p className="text-[13px] font-medium leading-snug">{item.name}</p>
                  <p className="text-[11px] text-gray-400 tracking-wide">
                    Talle {item.size}{item.color ? ` · ${item.color}` : ''}
                  </p>
                  <p className="text-[13px] font-medium">{formatPrice(item.price)}</p>

                  {/* Cantidad */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.variant_id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
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
          <div className="px-7 py-6 border-t border-gray-100 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-[0.2em] uppercase text-gray-400">Subtotal</span>
              <span className="font-display text-xl font-light">{formatPrice(total())}</span>
            </div>
            <p className="text-[10px] text-gray-400 tracking-wide">
              Envío calculado al finalizar la compra
            </p>
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="block w-full bg-[#111] text-white text-center py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-black/80 transition-colors"
            >
              Finalizar compra
            </Link>
            <button
              onClick={toggleCart}
              className="block w-full text-center text-[11px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#111] transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
