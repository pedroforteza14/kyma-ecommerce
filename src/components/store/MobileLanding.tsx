'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'

const HERO = 'https://wdzbledtvuoaujrgusti.supabase.co/storage/v1/object/public/products/hero/hero-mobile.webp?v=2'

const categories = [
  { label: 'After Hours',     href: '/categoria/after-hours-collection', featured: true  },
  { label: 'Tops / Bodys',    href: '/categoria/top-bodys'                               },
  { label: 'Remeras',         href: '/categoria/remeras'                                 },
  { label: 'Camisas & Blusas',href: '/categoria/camisas-blusas'                          },
  { label: 'Sweaters',        href: '/categoria/sweaters'                                },
  { label: 'Jackets',         href: '/categoria/jackets-blazers'                         },
  { label: 'Pantalones',      href: '/categoria/pantalones'                              },
  { label: 'Faldas & Shorts', href: '/categoria/polleras-shorts'                         },
  { label: 'Accesorios',      href: '/categoria/accesorios'                              },
  { label: 'Sale',            href: '/categoria/sale',            sale: true             },
]

export default function MobileLanding() {
  const { itemCount, toggleCart } = useCartStore()
  const count = itemCount()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="lg:hidden fixed inset-0 z-[60] bg-black">

      {/* Imagen de fondo */}
      <img
        src={HERO}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-top"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-black/45" />

      {/* ── Landing ── */}
      <div className="relative h-full flex flex-col">

        {/* Top bar */}
        <div className="flex items-center justify-between px-7 pt-10">
          <img src="/logo-transparent.png" alt="KYMA" className="h-6 w-auto brightness-0 invert" />

          <div className="flex items-center gap-5">
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="text-white"
            >
              <Menu size={20} strokeWidth={1.4} />
            </button>

            {/* Carrito */}
            <button
              onClick={toggleCart}
              aria-label="Carrito"
              className="relative text-white"
            >
              <ShoppingBag size={20} strokeWidth={1.4} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#111] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Centro editorial */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <p className="text-[8px] tracking-[0.55em] uppercase text-white/30 mb-4">
            After Hours Collection
          </p>
          <h2
            className="text-white font-thin leading-none mb-8"
            style={{ fontSize: 'clamp(2.8rem, 14vw, 5rem)', letterSpacing: '0.06em' }}
          >
            AFTER<br />HOURS
          </h2>
          <div className="w-6 h-px bg-white/20 mb-8" />
          <div className="flex flex-col items-center gap-5">
            <Link href="/categoria/after-hours-collection"
              className="text-[9px] tracking-[0.45em] uppercase text-white/80 active:opacity-50">
              Shop
            </Link>
            <Link href="/categoria/top-bodys"
              className="text-[8px] tracking-[0.4em] uppercase text-white/40 active:opacity-50">
              The Black Tie Collection
            </Link>
            <Link href="/categoria/sale"
              className="text-[9px] tracking-[0.45em] uppercase text-red-300/80 active:opacity-50">
              Sale
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="pb-8 text-center text-[7px] tracking-[0.4em] uppercase text-white/18">
          KYMA © {new Date().getFullYear()} · Buenos Aires
        </p>

      </div>

      {/* ── Menú de categorías ── */}
      {menuOpen && (
        <div className="absolute inset-0 bg-[#0e0e0e] z-10 flex flex-col px-8 pt-10 pb-10 overflow-y-auto">

          {/* Header del menú */}
          <div className="flex items-center justify-between mb-10">
            <img src="/logo-transparent.png" alt="KYMA" className="h-6 w-auto brightness-0 invert opacity-60" />
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={20} strokeWidth={1.4} />
            </button>
          </div>

          {/* Lista de categorías */}
          <nav className="flex-1">
            {categories.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between py-4 border-b border-white/8 active:opacity-50 group ${
                  c.featured ? 'border-b-white/15' : ''
                }`}
              >
                <span
                  className={`text-[11px] tracking-[0.45em] uppercase font-light transition-colors ${
                    c.sale
                      ? 'text-red-300'
                      : c.featured
                      ? 'text-white'
                      : 'text-white/65 group-hover:text-white/90'
                  }`}
                >
                  {c.label}
                </span>
                <span className={`text-[10px] transition-transform duration-200 group-hover:translate-x-1 ${c.sale ? 'text-red-300/50' : 'text-white/20'}`}>
                  →
                </span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <p className="mt-8 text-center text-[7px] tracking-[0.4em] uppercase text-white/18">
            KYMA © {new Date().getFullYear()} · Buenos Aires
          </p>

        </div>
      )}

    </div>
  )
}
