'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ShoppingBag, LayoutDashboard, BarChart2, Tag, Menu, X } from 'lucide-react'
import LogoutButton from './LogoutButton'

const NAV = [
  { href: '/admin',            label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/balance',    label: 'Balance',   icon: BarChart2       },
  { href: '/admin/productos',  label: 'Productos', icon: Package         },
  { href: '/admin/pedidos',    label: 'Pedidos',   icon: ShoppingBag     },
  { href: '/admin/cupones',    label: 'Cupones',   icon: Tag             },
]

function NavLinks({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex-1 p-4 space-y-1">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
              active ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarFooter({ onClose }: { onClose?: () => void }) {
  return (
    <div className="p-4 border-t space-y-2">
      <Link
        href="/"
        target="_blank"
        onClick={onClose}
        className="flex items-center gap-2 text-xs text-gray-500 hover:text-black transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        Ver tienda
      </Link>
      <LogoutButton />
    </div>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="min-h-screen bg-gray-50 [&_*]:!cursor-auto [&_a]:!cursor-pointer [&_button]:!cursor-pointer">

      {/* ── Mobile top bar ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b z-40 flex items-center px-4 gap-4">
        <button onClick={() => setOpen(true)} className="text-gray-700 p-1 -ml-1" aria-label="Abrir menú">
          <Menu size={22} />
        </button>
        <div className="leading-tight">
          <p className="text-[9px] text-gray-400 tracking-[0.2em] uppercase">Admin</p>
          <p className="font-bold text-base tracking-widest">KYMA</p>
        </div>
      </header>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full flex flex-col bg-white border-r z-50
        w-72 lg:w-56
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 tracking-widest">ADMIN</p>
            <p className="font-bold text-xl tracking-widest">KYMA</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-400 hover:text-black transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <NavLinks onClose={() => setOpen(false)} />
        <SidebarFooter onClose={() => setOpen(false)} />
      </aside>

      {/* ── Main content ── */}
      <main className="lg:ml-56 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
