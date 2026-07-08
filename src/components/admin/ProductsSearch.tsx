'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Pencil, ExternalLink, X } from 'lucide-react'
import { Product } from '@/types'

type Props = {
  products: Product[]
}

const fmt = (price: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price)

export default function ProductsSearch({ products }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    )
  }, [products, query])

  return (
    <>
      {/* Buscador */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-sm border border-gray-300 pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:border-black rounded-lg"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
          >
            <X size={14} />
          </button>
        )}
        {query && (
          <span className="ml-3 text-xs text-gray-400 absolute left-[calc(100%_-_280px)] top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Mobile: cards ── */}
      <div className="md:hidden space-y-3">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-lg border p-3 flex items-center gap-3">
            <div className="relative w-14 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              {product.images?.[0] && (
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{product.name}</p>
              <p className="text-xs text-gray-400 truncate">{product.category?.name ?? '—'}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-semibold">{fmt(product.price)}</p>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                  product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                }`}>
                  {product.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <Link href={`/admin/productos/${product.id}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                <Pencil size={12} /> Editar
              </Link>
              <Link href={`/producto/${product.slug}`} target="_blank" className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700">
                <ExternalLink size={12} /> Ver
              </Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-lg border p-12 text-center text-gray-400">
            {query ? `Sin resultados para "${query}"` : 'No hay productos.'}
          </div>
        )}
      </div>

      {/* ── Desktop: tabla ── */}
      <div className="hidden md:block bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Producto', 'Categoría', 'Precio', 'Estado', 'Acciones'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 tracking-wide uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {product.images?.[0] && (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-500">{product.category?.name ?? '—'}</td>
                <td className="px-4 py-4">
                  <p className="font-semibold">{fmt(product.price)}</p>
                  {product.original_price && (
                    <p className="text-xs text-gray-400 line-through">{fmt(product.original_price)}</p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {product.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/productos/${product.id}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                      <Pencil size={12} /> Editar
                    </Link>
                    <Link href={`/producto/${product.slug}`} target="_blank" className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 hover:underline">
                      <ExternalLink size={12} /> Ver en tienda
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  {query ? `Sin resultados para "${query}"` : 'No hay productos. Creá el primero.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
