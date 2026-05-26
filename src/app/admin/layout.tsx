export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Package, ShoppingBag, LayoutDashboard } from 'lucide-react'
import LogoutButton from '@/components/admin/LogoutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r flex flex-col fixed h-full">
        <div className="p-6 border-b">
          <p className="text-xs text-gray-500 tracking-widest">ADMIN</p>
          <p className="font-bold text-xl tracking-widest">KYMA</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/admin/productos', label: 'Productos', icon: Package },
            { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t space-y-3">
          <Link href="/" className="block text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ← Ver tienda
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Contenido */}
      <main className="ml-56 flex-1 p-8">{children}</main>
    </div>
  )
}
