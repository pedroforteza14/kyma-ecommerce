'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product, ProductVariant } from '@/types'
import { useCartStore } from '@/store/cart'
import { Check, RefreshCw, Truck } from 'lucide-react'
import SizeGuideModal from './SizeGuideModal'
import { trackViewContent, trackAddToCart } from './MetaPixel'

type Props = { product: Product }

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)

export default function ProductDetail({ product }: Props) {
  const [activeImg, setActiveImg]         = useState(0)
  const [selectedVariant, setVariant]     = useState<ProductVariant | null>(null)
  const [added, setAdded]                 = useState(false)
  const [sizeGuideOpen, setSizeGuide]     = useState(false)
  const { addItem, toggleCart }           = useCartStore()

  const sizes      = [...new Set(product.variants?.map((v) => v.size) ?? [])]
  const hasDiscount = !!(product.original_price && product.original_price > product.price)
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.original_price!) * 100)
    : null

  // Meta Pixel: ViewContent al montar
  useEffect(() => {
    trackViewContent({ name: product.name, price: product.price, productId: product.id })
  }, [product.id, product.name, product.price])

  const handleAdd = () => {
    if (!selectedVariant) return
    addItem({
      product_id: product.id,
      variant_id: selectedVariant.id,
      name:       product.name,
      price:      product.price,
      image:      product.images?.[0] ?? '',
      size:       selectedVariant.size,
      color:      selectedVariant.color,
      quantity:   1,
    })
    // Meta Pixel: AddToCart
    trackAddToCart({ name: product.name, price: product.price, variantId: selectedVariant.id })
    setAdded(true)
    setTimeout(() => { setAdded(false); toggleCart() }, 900)
  }

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-5">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-gray-400">
          <Link href="/" className="hover:text-[#111] transition-colors">Inicio</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link
                href={`/categoria/${product.category.slug}`}
                className="hover:text-[#111] transition-colors"
              >
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#111]">{product.name}</span>
        </div>
      </div>

      {/* ── Layout principal ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 xl:gap-20 items-start">

          {/* ════ GALERÍA ════ */}
          <div className="flex flex-col gap-3">
            {/* Imagen principal */}
            <div className="relative aspect-[3/4] bg-[#f7f6f2] overflow-hidden group">
              {product.images?.[activeImg] ? (
                <Image
                  src={product.images[activeImg]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-8xl font-light text-gray-200">K</span>
                </div>
              )}

              {/* Badge descuento */}
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-[#111] text-white text-[10px] tracking-[0.2em] px-3 py-1.5 uppercase">
                  -{discountPct}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-[72px] aspect-[3/4] flex-shrink-0 overflow-hidden transition-all duration-200 ${
                      activeImg === i
                        ? 'ring-1 ring-[#111] ring-offset-2'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} vista ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ════ INFO PANEL (sticky en desktop) ════ */}
          <div className="lg:sticky lg:top-24 space-y-7">

            {/* Categoría */}
            {product.category && (
              <Link
                href={`/categoria/${product.category.slug}`}
                className="text-[10px] tracking-[0.35em] uppercase text-gray-400 hover:text-[#111] transition-colors"
              >
                {product.category.name}
              </Link>
            )}

            {/* Nombre */}
            <h1
              className="font-display font-light leading-[1.05]"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '0.04em' }}
            >
              {product.name}
            </h1>

            {/* Precio */}
            <div className="flex items-baseline gap-4">
              <span className="font-display font-light text-3xl">
                {fmt(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="font-display text-xl text-gray-400 line-through font-light">
                    {fmt(product.original_price!)}
                  </span>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-white bg-red-500 px-2 py-1">
                    -{discountPct}%
                  </span>
                </>
              )}
            </div>

            <div className="border-t border-gray-100" />

            {/* Selector de talle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500">
                  Talle
                  {selectedVariant && (
                    <span className="ml-2 text-[#111] font-medium">
                      — {selectedVariant.size}
                    </span>
                  )}
                </p>
                <button
                  onClick={() => setSizeGuide(true)}
                  className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#111] transition-colors link-underline pb-px"
                >
                  Guía de talles
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variant    = product.variants?.find((v) => v.size === size)
                  const outOfStock = !variant || variant.stock === 0
                  const isLow      = !!variant && variant.stock > 0 && variant.stock <= 3
                  const isSelected = selectedVariant?.size === size

                  return (
                    <button
                      key={size}
                      disabled={outOfStock}
                      onClick={() => setVariant(variant ?? null)}
                      className={`relative min-w-[52px] h-11 px-3 text-[11px] tracking-[0.2em] uppercase border transition-all duration-150 ${
                        isSelected
                          ? 'bg-[#111] text-white border-[#111]'
                          : outOfStock
                          ? 'border-gray-100 text-gray-300 line-through cursor-not-allowed'
                          : 'border-gray-200 text-[#111] hover:border-[#111]'
                      }`}
                    >
                      {size}
                      {isLow && !outOfStock && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Aviso stock bajo */}
              {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 3 && (
                <p className="text-[11px] tracking-[0.1em] text-orange-500">
                  ⚡ Solo {selectedVariant.stock} {selectedVariant.stock === 1 ? 'unidad' : 'unidades'} disponibles
                </p>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={handleAdd}
              disabled={!selectedVariant || added}
              className={`w-full h-14 text-[11px] tracking-[0.35em] uppercase flex items-center justify-center gap-3 transition-all duration-300 ${
                added
                  ? 'bg-[#111] text-white'
                  : !selectedVariant
                  ? 'bg-[#f7f6f2] text-gray-400 cursor-not-allowed'
                  : 'bg-[#111] text-white hover:bg-black/80'
              }`}
            >
              {added ? (
                <>
                  <Check size={15} strokeWidth={1.5} />
                  Agregado
                </>
              ) : (
                selectedVariant ? 'Agregar al carrito' : 'Seleccioná un talle'
              )}
            </button>

            {/* Descripción */}
            {product.description && (
              <div className="border-t border-gray-100 pt-6">
                <p className="text-[12px] leading-[1.9] text-gray-500 tracking-wide whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Beneficios */}
            <div className="border-t border-gray-100 pt-5 space-y-3">
              {[
                { icon: Truck,     text: 'Envío gratis a todo el país' },
                { icon: RefreshCw, text: 'Cambios y devoluciones sin cargo' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-[11px] tracking-[0.1em] text-gray-500">
                  <Icon size={13} strokeWidth={1.5} className="text-gray-400 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuide(false)} />
    </>
  )
}
