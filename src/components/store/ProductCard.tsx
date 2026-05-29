import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const hasDiscount = product.original_price && product.original_price > product.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.original_price!) * 100)
    : null

  const totalStock = product.variants?.reduce((acc, v) => acc + v.stock, 0) ?? 0
  const isLowStock = totalStock > 0 && totalStock <= 5
  const isOutOfStock = totalStock === 0

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)

  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      {/* ── Imagen ── */}
      <div className="relative aspect-[3/4] bg-[#f5f4f0] overflow-hidden">

        {/* Imagen principal */}
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ease-in-out ${
              product.images[1] ? 'group-hover:opacity-0' : 'group-hover:scale-105'
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-4xl text-gray-200 italic font-light">K</span>
          </div>
        )}

        {/* Segunda imagen (hover swap) */}
        {product.images?.[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} — vista 2`}
            fill
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discountPct && (
            <span className="bg-[#111] text-white text-[10px] tracking-widest px-2 py-1">
              -{discountPct}%
            </span>
          )}
          {product.is_featured && !discountPct && (
            <span className="bg-white text-[#111] text-[10px] tracking-widest px-2 py-1 border border-[#111]/10">
              NEW
            </span>
          )}
        </div>

        {/* Sin stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 bg-white px-4 py-2 border border-gray-200">
              Sin stock
            </span>
          </div>
        )}

        {/* Últimas unidades */}
        {isLowStock && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#111]/80 py-2 text-center">
            <span className="text-[9px] text-white tracking-[0.2em] uppercase">
              Últimas unidades
            </span>
          </div>
        )}

        {/* Quick view strip — aparece al hacer hover */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 left-0 right-0 bg-white py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
              Ver producto
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="mt-3 space-y-1 px-0.5">
        <p className="text-[13px] font-medium leading-snug line-clamp-1 group-hover:opacity-60 transition-opacity">
          {product.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[13px]">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-[11px] text-gray-400 line-through">
              {formatPrice(product.original_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
