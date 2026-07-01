'use client'

import { X, Minus, Plus, Trash2, ShoppingBag, Check } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import Image from 'next/image'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total } = useCartStore()
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal  = total()

  if (!isOpen) return null

  return (
    <>
      {/* ── Overlay ─────────────────────────────── */}
      <div
        className="fixed inset-0 bg-black/25 z-50 backdrop-blur-[2px]"
        onClick={toggleCart}
      />

      {/* ── Drawer ──────────────────────────────── */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-white z-50 flex flex-col animate-slide-left shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-gray-100">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-xl font-light tracking-wide">Carrito</h2>
            {itemCount > 0 && (
              <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
              </span>
            )}
          </div>
          <button
            onClick={toggleCart}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-sm"
            aria-label="Cerrar carrito"
          >
            <X size={17} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (

            /* ── Estado vacío ── */
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-8">
              <div className="w-16 h-16 rounded-full bg-[#f5f4f0] flex items-center justify-center">
                <ShoppingBag size={24} strokeWidth={1.2} className="text-gray-300" />
              </div>
              <div className="space-y-1.5">
                <p className="font-display text-xl font-light italic text-gray-400">
                  Tu carrito está vacío
                </p>
                <p className="text-[11px] tracking-[0.2em] uppercase text-gray-300">
                  Explorá la nueva colección
                </p>
              </div>
              <button
                onClick={toggleCart}
                className="text-[10px] tracking-[0.3em] uppercase border-b border-gray-300 pb-0.5 text-gray-500 hover:text-[#111] hover:border-[#111] transition-colors"
              >
                Ver productos
              </button>
            </div>

          ) : (

            /* ── Lista de items ── */
            <div className="px-6 py-5 space-y-6">
              {items.map((item) => (
                <div key={item.variant_id} className="flex gap-4 group/item">

                  {/* Imagen */}
                  <Link
                    href={`/producto/${item.product_id}`}
                    onClick={toggleCart}
                    className="relative w-[72px] h-[96px] bg-[#f5f4f0] flex-shrink-0 overflow-hidden"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="72px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-2xl text-gray-200 italic font-light">K</span>
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium leading-snug truncate">{item.name}</p>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mt-0.5">
                          Talle {item.size}
                          {item.color ? ` · ${item.color}` : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.variant_id)}
                        className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Precio + cantidad */}
                    <div className="flex items-center justify-between">
                      <span className="font-display font-light text-[15px]">
                        {fmt(item.price * item.quantity)}
                      </span>

                      <div className="flex items-center border border-gray-200 h-8">
                        <button
                          onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                          className="w-8 h-full flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-400 hover:text-[#111]"
                          aria-label="Reducir cantidad"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-7 text-center text-[12px] select-none">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-400 hover:text-[#111]"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 pt-5 pb-7 border-t border-gray-100 space-y-5">

            {/* Envío gratis */}
            <div className="flex items-center gap-2 py-2.5 px-3.5 bg-[#f7f6f2]">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check size={9} strokeWidth={2.5} className="text-white" />
              </div>
              <span className="text-[11px] tracking-[0.15em] uppercase text-gray-600">
                Envío gratis en este pedido
              </span>
            </div>

            {/* Subtotal */}
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] tracking-[0.35em] uppercase text-gray-500">Subtotal</span>
              <span className="font-display font-light text-2xl">{fmt(subtotal)}</span>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="flex items-center justify-center w-full bg-[#111] text-white h-13 text-[11px] tracking-[0.35em] uppercase hover:bg-black/80 transition-colors duration-200"
              style={{ height: '52px' }}
            >
              Finalizar compra
            </Link>

            {/* Seguir comprando */}
            <button
              onClick={toggleCart}
              className="w-full text-center text-[10px] tracking-[0.25em] uppercase text-gray-400 hover:text-[#111] transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
