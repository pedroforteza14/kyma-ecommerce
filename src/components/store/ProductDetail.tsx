'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product, ProductVariant } from '@/types'
import { useCartStore } from '@/store/cart'
import { ShoppingBag, Check } from 'lucide-react'

type Props = {
  product: Product
}

export default function ProductDetail({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [added, setAdded] = useState(false)
  const { addItem, toggleCart } = useCartStore()

  const sizes = [...new Set(product.variants?.map((v) => v.size) ?? [])]
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

  const handleAddToCart = () => {
    if (!selectedVariant) return

    addItem({
      product_id: product.id,
      variant_id: selectedVariant.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? '',
      size: selectedVariant.size,
      color: selectedVariant.color,
      quantity: 1,
    })

    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      toggleCart()
    }, 800)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Galería */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-sm">
            {product.images?.[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                Sin imagen
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-all ${
                    selectedImage === idx ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {product.category && (
            <p className="text-xs text-gray-500 tracking-widest uppercase">
              {product.category.name}
            </p>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            {product.name}
          </h1>

          {/* Precio */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.original_price!)}
                </span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 font-medium">
                  -{discountPct}%
                </span>
              </>
            )}
          </div>

          {/* Selector de talle */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold tracking-wide">
                TALLE
                {selectedVariant && (
                  <span className="ml-2 text-gray-600 font-normal">
                    — {selectedVariant.size}
                  </span>
                )}
              </p>
              <button className="text-xs text-gray-500 underline underline-offset-4">
                Guía de talles
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const variant = product.variants?.find((v) => v.size === size)
                const outOfStock = variant ? variant.stock === 0 : true
                const isLow = variant ? variant.stock > 0 && variant.stock <= 3 : false
                const isSelected = selectedVariant?.size === size

                return (
                  <button
                    key={size}
                    disabled={outOfStock}
                    onClick={() => setSelectedVariant(variant ?? null)}
                    className={`relative min-w-[48px] px-3 py-2 text-sm border transition-all ${
                      isSelected
                        ? 'bg-black text-white border-black'
                        : outOfStock
                        ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                    {isLow && !outOfStock && (
                      <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-orange-400 rounded-full" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Alerta de stock bajo en el talle seleccionado */}
            {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 3 && (
              <p className="text-xs text-orange-500 font-medium mt-2">
                ⚡ ¡Solo quedan {selectedVariant.stock} unidades en talle {selectedVariant.size}!
              </p>
            )}
          </div>

          {/* Botón agregar */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || added}
            className={`w-full py-4 text-sm font-medium tracking-widest flex items-center justify-center gap-3 transition-all ${
              !selectedVariant
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-green-600 text-white'
                : 'bg-black text-white hover:bg-gray-900'
            }`}
          >
            {added ? (
              <>
                <Check size={18} />
                AGREGADO
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                {selectedVariant ? 'AGREGAR AL CARRITO' : 'SELECCIONÁ UN TALLE'}
              </>
            )}
          </button>

          {/* Descripción */}
          {product.description && (
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
