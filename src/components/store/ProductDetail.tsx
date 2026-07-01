'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product, ProductVariant } from '@/types'
import { useCartStore } from '@/store/cart'
import { Check, RefreshCw, Truck, ChevronDown } from 'lucide-react'
import SizeGuideModal from './SizeGuideModal'
import { trackViewContent, trackAddToCart } from './MetaPixel'

type Props = { product: Product }

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

export default function ProductDetail({ product }: Props) {
  const [activeImg, setActiveImg]     = useState(0)
  const [selectedVariant, setVariant] = useState<ProductVariant | null>(null)
  const [added, setAdded]             = useState(false)
  const [sizeGuideOpen, setSizeGuide] = useState(false)
  const [zoomOpen, setZoomOpen]       = useState(false)
  const [descOpen, setDescOpen]       = useState(true)
  const { addItem, toggleCart }       = useCartStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoomOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    trackViewContent({ name: product.name, price: product.price, productId: product.id })
  }, [product.id, product.name, product.price])

  const sizes       = [...new Set(product.variants?.map((v) => v.size) ?? [])]
  const hasDiscount = !!(product.original_price && product.original_price > product.price)
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.original_price!) * 100) : null
  const images      = product.images ?? []

  const handleAdd = () => {
    if (!selectedVariant) return
    addItem({
      product_id: product.id,
      variant_id: selectedVariant.id,
      name:       product.name,
      slug:       product.slug,
      price:      product.price,
      image:      images[0] ?? '',
      size:       selectedVariant.size,
      color:      selectedVariant.color,
      quantity:   1,
    })
    trackAddToCart({ name: product.name, price: product.price, variantId: selectedVariant.id, productId: product.id })
    setAdded(true)
    setTimeout(() => { setAdded(false); toggleCart() }, 900)
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-5 pb-2">
        <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase text-gray-400">
          <Link href="/" className="hover:text-[#111] transition-colors">Inicio</Link>
          <span className="text-gray-300">/</span>
          {product.category && (
            <>
              <Link href={`/categoria/${product.category.slug}`} className="hover:text-[#111] transition-colors">
                {product.category.name}
              </Link>
              <span className="text-gray-300">/</span>
            </>
          )}
          <span className="text-[#111]">{product.name}</span>
        </div>
      </div>

      {/* Layout principal */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 pb-28 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-8 xl:gap-16 items-start">

          {/* ══ GALERÍA ══ */}
          <div className="flex gap-3">
            {/* Thumbnails verticales — solo desktop */}
            {images.length > 1 && (
              <div className="hidden lg:flex flex-col gap-2 flex-shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-16 aspect-[3/4] overflow-hidden flex-shrink-0 transition-all duration-200 ${
                      activeImg === i ? 'ring-1 ring-[#111] ring-offset-1' : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}

            {/* Imagen principal */}
            <div className="flex-1 flex flex-col gap-2">
              <div
                className="relative aspect-[3/4] bg-[#f7f6f2] overflow-hidden group cursor-zoom-in"
                onClick={() => images[activeImg] && setZoomOpen(true)}
              >
                {images[activeImg] ? (
                  <Image
                    src={images[activeImg]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl font-light text-gray-200">K</span>
                  </div>
                )}
                {hasDiscount && (
                  <span className="absolute top-4 left-4 bg-[#111] text-white text-[9px] tracking-[0.2em] px-3 py-1.5 uppercase">
                    -{discountPct}%
                  </span>
                )}
                {images[activeImg] && (
                  <span className="absolute bottom-3 right-3 bg-white/80 text-[9px] tracking-[0.2em] uppercase px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none">
                    Ampliar
                  </span>
                )}
              </div>

              {/* Thumbnails horizontales — solo mobile */}
              {images.length > 1 && (
                <div className="flex gap-2 lg:hidden overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative w-16 aspect-[3/4] flex-shrink-0 overflow-hidden transition-all duration-200 ${
                        activeImg === i ? 'ring-1 ring-[#111] ring-offset-1' : 'opacity-40 hover:opacity-70'
                      }`}
                    >
                      <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ══ INFO PANEL ══ */}
          <div className="lg:sticky lg:top-24 space-y-6">

            {/* Categoría + nombre */}
            <div className="space-y-2">
              {product.category && (
                <Link
                  href={`/categoria/${product.category.slug}`}
                  className="text-[9px] tracking-[0.45em] uppercase text-gray-400 hover:text-[#111] transition-colors"
                >
                  {product.category.name}
                </Link>
              )}
              <h1 className="text-3xl sm:text-4xl font-light leading-tight tracking-wide">
                {product.name}
              </h1>
            </div>

            {/* Precio */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl font-light">{fmt(product.price)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through font-light">{fmt(product.original_price!)}</span>
                    <span className="text-[10px] tracking-[0.15em] uppercase text-white bg-red-500 px-2 py-0.5">
                      -{discountPct}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-gray-400 tracking-wide">
                3 cuotas sin interés de {fmt(product.price / 3)} con MercadoPago
              </p>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Selector talle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500">
                  Talle
                  {selectedVariant && (
                    <span className="ml-2 text-[#111] font-medium">— {selectedVariant.size}</span>
                  )}
                </p>
                <button
                  onClick={() => setSizeGuide(true)}
                  className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#111] transition-colors underline underline-offset-2"
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

              {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 3 && (
                <p className="text-[11px] tracking-[0.05em] text-orange-500">
                  ⚡ Solo {selectedVariant.stock} {selectedVariant.stock === 1 ? 'unidad' : 'unidades'} disponibles
                </p>
              )}
            </div>

            {/* CTA — solo visible en desktop */}
            <div className="hidden lg:block space-y-3">
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
                  <><Check size={14} strokeWidth={1.5} /> Agregado al carrito</>
                ) : (
                  selectedVariant ? 'Agregar al carrito' : 'Seleccioná un talle'
                )}
              </button>
            </div>

            {/* Beneficios */}
            <div className="border-t border-gray-100 pt-5 space-y-3">
              {[
                { icon: Truck,     text: 'Envío gratis a todo el país' },
                { icon: RefreshCw, text: 'Cambios y devoluciones sin cargo' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-[11px] tracking-[0.05em] text-gray-500">
                  <Icon size={13} strokeWidth={1.5} className="flex-shrink-0 text-gray-400" />
                  {text}
                </div>
              ))}
            </div>

            {/* Descripción acordeón */}
            {product.description && (
              <div className="border-t border-gray-100">
                <button
                  onClick={() => setDescOpen(!descOpen)}
                  className="w-full flex items-center justify-between py-4 text-[10px] tracking-[0.3em] uppercase text-gray-500 hover:text-[#111] transition-colors"
                >
                  Descripción
                  <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className={`transition-transform duration-300 ${descOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {descOpen && (
                  <p className="text-[12px] leading-[1.9] text-gray-500 tracking-wide whitespace-pre-line pb-4">
                    {product.description}
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuide(false)} />

      {/* Barra sticky mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-5 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-400 tracking-wide truncate">{product.name}</p>
          <p className="text-base font-light">{fmt(product.price)}</p>
        </div>
        <button
          onClick={handleAdd}
          disabled={!selectedVariant || added}
          className={`flex-shrink-0 h-12 px-8 text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
            added
              ? 'bg-[#111] text-white'
              : !selectedVariant
              ? 'bg-[#f7f6f2] text-gray-400 cursor-not-allowed'
              : 'bg-[#111] text-white'
          }`}
        >
          {added ? <><Check size={13} strokeWidth={1.5} /> Listo</> : selectedVariant ? 'Agregar' : 'Elegí talle'}
        </button>
      </div>

      {/* Zoom lightbox */}
      {zoomOpen && images[activeImg] && (
        <div
          className="fixed inset-0 z-[70] bg-black/92 flex items-center justify-center cursor-zoom-out p-4"
          onClick={() => setZoomOpen(false)}
        >
          <button
            className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors"
            onClick={() => setZoomOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
                onClick={(e) => { e.stopPropagation(); setActiveImg((activeImg - 1 + images.length) % images.length) }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button
                className="absolute right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
                onClick={(e) => { e.stopPropagation(); setActiveImg((activeImg + 1) % images.length) }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </>
          )}

          <div className="relative max-h-[90vh] max-w-[90vw] aspect-[3/4]" style={{ width: 'min(90vw, 65vh * 0.75)' }}>
            <Image
              src={images[activeImg]}
              alt={product.name}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveImg(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeImg ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
