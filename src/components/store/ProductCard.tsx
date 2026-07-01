import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'

type Props = { product: Product }

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)

export default function ProductCard({ product }: Props) {
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

  return (
    <Link href={`/producto/${product.slug}`} className="group block">

      {/* ── Imagen ─────────────────────────────────── */}
      <div className="relative aspect-[3/4] bg-[#f5f4f0] overflow-hidden">

        {/* Imagen principal */}
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ease-in-out will-change-transform ${
              product.images[1]
                ? 'group-hover:opacity-0'
                : 'group-hover:scale-[1.04]'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f5f4f0]">
            <span className="font-display text-5xl font-light text-[#e0ddd8] italic select-none">K</span>
          </div>
        )}

        {/* Segunda imagen — swap en hover */}
        {product.images?.[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} — vista 2`}
            fill
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out will-change-opacity"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
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
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-[9px] tracking-[0.3em] uppercase text-gray-400 bg-white/90 px-4 py-2">
              Sin stock
            </span>
          </div>
        )}

        {/* ── Últimas unidades — barra inferior ── */}
        {isLowStock && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#111]/75 backdrop-blur-sm py-2 text-center z-10">
            <span className="text-[8px] text-white/90 tracking-[0.3em] uppercase">
              Últimas {totalStock} unidades
            </span>
          </div>
        )}

        {/* ── Flecha de hover (sutil, esquina inferior derecha) ── */}
        {!isOutOfStock && !isLowStock && (
          <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 10L10 1M10 1H3M10 1V8" stroke="#111111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* ── Info ───────────────────────────────────── */}
      <div className="mt-3.5 space-y-0.5 px-0.5">

        {/* Nombre */}
        <p className="text-[13px] leading-snug tracking-[0.01em] line-clamp-1 transition-opacity duration-200 group-hover:opacity-50">
          {product.name}
        </p>

        {/* Precio */}
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

        {/* Talles disponibles — aparecen en hover */}
        {availableSizes.length > 0 && (
          <div className="h-4 overflow-hidden">
            <div className="card-sizes flex items-center gap-2">
              {availableSizes.slice(0, 6).map((size) => (
                <span
                  key={size}
                  className="text-[9px] tracking-[0.15em] uppercase text-gray-400"
                >
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
