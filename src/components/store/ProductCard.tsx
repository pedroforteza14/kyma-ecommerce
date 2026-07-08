'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Product } from '@/types'

type Props = { product: Product }

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)

export default function ProductCard({ product }: Props) {
  const [activeImg, setActiveImg] = useState(0)

  const hasDiscount  = !!(product.original_price && product.original_price > product.price)
  const discountPct  = hasDiscount
    ? Math.round((1 - product.price / product.original_price!) * 100)
    : null

  const availableSizes = [
    ...new Set(
      product.variants?.filter((v) => v.stock > 0).map((v) => v.size) ?? []
    ),
  ]
  const totalStock   = product.variants?.reduce((a, v) => a + v.stock, 0) ?? 0
  const isOutOfStock = totalStock === 0
  const isLowStock   = totalStock > 0 && totalStock <= 4
  const images       = product.images ?? []

  return (
    <Link href={`/producto/${product.slug}`} className="group block">

      {/* ── Imagen ─────────────────────────────────── */}
      <div
        className="relative aspect-[3/4] bg-[#f5f4f0] overflow-hidden"
        onMouseLeave={() => setActiveImg(0)}
      >

        {images[activeImg] ? (
          <Image
            key={activeImg}
            src={images[activeImg]}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-500 ease-in-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={activeImg === 0}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f5f4f0]">
            <span className="font-display text-5xl font-light text-[#e0ddd8] italic select-none">K</span>
          </div>
        )}

        {/* ── Badges ── */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPct && (
            <span className="bg-[#111] text-white text-[9px] tracking-[0.25em] px-2.5 py-1 uppercase font-light">
              −{discountPct}%
            </span>
          )}
          {product.is_featured && !discountPct && (
            <span className="bg-white text-[#111] text-[9px] tracking-[0.25em] px-2.5 py-1 uppercase border border-black/8">
              Nuevo
            </span>
          )}
        </div>

        {/* ── Sin stock ── */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="text-[9px] tracking-[0.3em] uppercase text-gray-400 bg-white/90 px-4 py-2">
              Sin stock
            </span>
          </div>
        )}

        {/* ── Dots navegación ── */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          {/* Dots — solo si hay más de 1 imagen */}
          {images.length > 1 && (
            <div className="flex justify-center gap-1.5 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {images.slice(0, 6).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveImg(i) }}
                  onMouseEnter={() => setActiveImg(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    i === activeImg ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Flecha hover (solo si no hay dots visibles) ── */}
        {images.length <= 1 && !isOutOfStock && (
          <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 10L10 1M10 1H3M10 1V8" stroke="#111111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* ── Info ───────────────────────────────────── */}
      <div className="mt-3.5 space-y-0.5 px-0.5">
        <p className="text-[13px] leading-snug tracking-[0.01em] line-clamp-1 transition-opacity duration-200 group-hover:opacity-50">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-display font-light text-[15px] tracking-wide">
            {fmt(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-[11px] text-gray-400 line-through font-light">
              {fmt(product.original_price!)}
            </span>
          )}
        </div>
        {availableSizes.length > 0 && (
          <div className="h-4 overflow-hidden">
            <div className="flex items-center gap-2">
              {availableSizes.slice(0, 6).map((size) => (
                <span key={size} className="text-[9px] tracking-[0.15em] uppercase text-gray-400">
                  {size}
                </span>
              ))}
              {availableSizes.length > 6 && (
                <span className="text-[9px] text-gray-300">+{availableSizes.length - 6}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
