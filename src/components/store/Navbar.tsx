'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'

const categories = [
  { name: 'Remeras & Tops', slug: 'remeras-tops' },
  { name: 'Camisas', slug: 'camisas' },
  { name: 'Sweaters', slug: 'sweaters' },
  { name: 'Camperas & Blazers', slug: 'camperas-blazers' },
  { name: 'Denim & Pantalones', slug: 'denim-pantalones' },
  { name: 'Polleras & Shorts', slug: 'polleras-shorts' },
  { name: 'Accesorios', slug: 'accesorios' },
  { name: 'SALE', slug: 'sale' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { itemCount, toggleCart } = useCartStore()
  const count = itemCount()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      {/* Barra de envíos */}
      <div className="bg-black text-white text-center text-xs py-2 tracking-widest">
        ENVÍOS A TODO EL PAÍS
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-widest uppercase">
          KYMA
        </Link>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              className={`text-sm tracking-wide hover:opacity-60 transition-opacity ${
                cat.slug === 'sale' ? 'text-red-500 font-semibold' : ''
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Iconos derecha */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block hover:opacity-60 transition-opacity">
            <Search size={20} />
          </button>

          <button
            onClick={toggleCart}
            className="relative hover:opacity-60 transition-opacity"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          {/* Menú mobile */}
          <button
            className="lg:hidden hover:opacity-60 transition-opacity"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menú mobile expandido */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className={`text-sm tracking-wide hover:opacity-60 transition-opacity ${
                  cat.slug === 'sale' ? 'text-red-500 font-semibold' : ''
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
