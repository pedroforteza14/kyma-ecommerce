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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)

  return (
    <Link href={`/producto/${product.slug}`} className="group">
      {/* Imagen */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-sm">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
            Sin imagen
          </div>
        )}

        {/* Badge descuento */}
        {discountPct && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 font-medium">
            -{discountPct}%
          </span>
        )}

        {/* Badge nuevo/destacado */}
        {product.is_featured && !discountPct && (
          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 font-medium">
            NEW
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <p className="text-sm font-medium leading-tight line-clamp-2">
          {product.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.original_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
