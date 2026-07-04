'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'

const HERO = 'https://acdn-us.mitiendanube.com/stores/006/445/993/themes/uyuni/2-slide-1780435199759-8036263829-c3e7b37018d3027735c1919bdc3604491780435201-1024-1024.webp'

const links = [
  { label: 'After Hours', href: '/categoria/after-hours-collection' },
  { label: 'Shop',        href: '/categoria/top-bodys'              },
  { label: 'Sale',        href: '/categoria/sale',  accent: true    },
]

export default function MobileLanding() {
  const { itemCount, toggleCart } = useCartStore()
  const count = itemCount()

  return (
    <div className="lg:hidden fixed inset-0 z-[60] bg-black">
      {/* Background image */}
      <img
        src={HERO}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-top"
        fetchPriority="high"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* UI */}
      <div className="relative h-full flex flex-col safe-top safe-bottom">

        {/* Top bar */}
        <div className="flex items-center justify-between px-7 pt-10">
          <img src="/logo-transparent.png" alt="KYMA" className="h-7 w-auto brightness-0 invert" />
          <button
            onClick={toggleCart}
            aria-label="Carrito"
            className="relative text-white"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-[#111] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </button>
        </div>

        {/* Center nav */}
        <div className="flex-1 flex flex-col items-center justify-center gap-9">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[13px] tracking-[0.55em] uppercase font-light transition-opacity active:opacity-50 ${
                l.accent ? 'text-red-300' : 'text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Bottom */}
        <div className="pb-10 text-center">
          <p className="text-[8px] tracking-[0.4em] uppercase text-white/25">
            KYMA © {new Date().getFullYear()} · Buenos Aires
          </p>
        </div>

      </div>
    </div>
  )
}
