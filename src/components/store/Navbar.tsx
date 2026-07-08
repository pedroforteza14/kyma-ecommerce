'use client'

import Link from 'next/link'
import { ShoppingBag, Search, X, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import SearchModal from './SearchModal'

const categories = [
  { name: 'After Hours',      slug: 'after-hours-collection' },
  { name: 'Tops / Bodys',     slug: 'top-bodys'              },
  { name: 'Remeras',          slug: 'remeras'                },
  { name: 'Camisas & Blusas', slug: 'camisas-blusas'         },
  { name: 'Sweaters',         slug: 'sweaters'               },
  { name: 'Jackets',          slug: 'jackets-blazers'        },
  { name: 'Pantalones',       slug: 'pantalones'             },
  { name: 'Faldas & Shorts',  slug: 'polleras-shorts'        },
  { name: 'Accesorios',       slug: 'accesorios'             },
  { name: 'SALE',             slug: 'sale'                   },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { itemCount, toggleCart } = useCartStore()
  const count = itemCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquear scroll cuando el menú mobile está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* ── Announcement bar ── */}
      <div className="bg-[#111] text-white overflow-hidden h-8 flex items-center">
        <div className="flex animate-marquee whitespace-nowrap text-[8px] tracking-[0.5em] uppercase">
          {[
            '3 cuotas sin interés',
            '15% off con transferencia',
            'Pick up · Villa Crespo',
          ].flatMap((t, i) => [
            <span key={`t${i}`} className="px-12 text-white/70">{t}</span>,
            <span key={`d${i}`} className="text-white/25">·</span>,
          ]).concat(
            [
              '3 cuotas sin interés',
              '15% off con transferencia',
              'Pick up · Villa Crespo',
            ].flatMap((t, i) => [
              <span key={`t2${i}`} className="px-12 text-white/70">{t}</span>,
              <span key={`d2${i}`} className="text-white/25">·</span>,
            ])
          )}
        </div>
      </div>

      {/* ── Main header ── */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-[0_1px_0_0_#e5e5e5]' : 'border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="hover:opacity-70 transition-opacity flex-shrink-0">
            <img
              src="/logo-transparent.png"
              alt="KYMA"
              className="h-9 w-auto"
              style={{ imageRendering: 'auto' }}
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-7">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className={`text-[11px] tracking-[0.12em] uppercase link-underline transition-opacity hover:opacity-60 ${
                  cat.slug === 'sale' ? 'text-red-500 font-medium' : ''
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Iconos */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex hover:opacity-50 transition-opacity"
              aria-label="Buscar"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            <button
              onClick={toggleCart}
              className="relative hover:opacity-50 transition-opacity"
              aria-label="Carrito"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#111] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {count}
                </span>
              )}
            </button>

            <button
              className="lg:hidden hover:opacity-50 transition-opacity"
              onClick={() => setMenuOpen(true)}
              aria-label="Menú"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-white animate-slide-down flex flex-col">
          {/* Header del menú */}
          <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <img src="/logo-transparent.png" alt="KYMA" className="h-9 w-auto" />
            </Link>
            <button onClick={() => setMenuOpen(false)} className="hover:opacity-50">
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Links */}
          <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
            {categories.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className={`py-4 text-2xl font-display font-light tracking-wide border-b border-gray-100 hover:pl-2 transition-all duration-200 ${
                  cat.slug === 'sale' ? 'text-red-500' : ''
                }`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Footer del menú */}
          <div className="px-8 py-8 flex items-center gap-4">
            <button
              onClick={() => { setMenuOpen(false); setSearchOpen(true) }}
              className="flex items-center gap-2 text-xs tracking-widest uppercase text-gray-500"
            >
              <Search size={14} strokeWidth={1.5} />
              Buscar
            </button>
          </div>
        </div>
      )}

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
