'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const search = useCallback(
    async (q: string) => {
      if (q.trim().length < 2) {
        setResults([])
        return
      }
      setLoading(true)
      // Cliente creado lazy — solo en browser, nunca en SSR
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*), variants:product_variants(*)')
        .eq('is_active', true)
        .ilike('name', `%${q}%`)
        .limit(6)

      setResults((data as Product[]) ?? [])
      setLoading(false)
    },
    []
  )

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-2xl">
        {/* Input */}
        <div className="flex items-center gap-4 px-6 py-5 border-b">
          <Search size={20} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscá remeras, pantalones, sweaters..."
            className="flex-1 text-base focus:outline-none placeholder-gray-400"
          />
          {loading && <Loader2 size={18} className="animate-spin text-gray-400" />}
          <button onClick={onClose} className="hover:opacity-60 transition-opacity">
            <X size={22} />
          </button>
        </div>

        {/* Resultados */}
        <div className="max-h-[70vh] overflow-y-auto">
          {results.length > 0 ? (
            <div className="divide-y">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/producto/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="relative w-14 h-16 bg-gray-100 flex-shrink-0 overflow-hidden rounded">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {product.category?.name}
                    </p>
                  </div>
                  <p className="text-sm font-semibold flex-shrink-0">
                    {formatPrice(product.price)}
                  </p>
                </Link>
              ))}
            </div>
          ) : query.length >= 2 && !loading ? (
            <div className="px-6 py-12 text-center text-gray-400">
              <p>No encontramos resultados para <strong>"{query}"</strong></p>
            </div>
          ) : query.length === 0 ? (
            <div className="px-6 py-8 text-sm text-gray-400 text-center">
              Escribí al menos 2 caracteres para buscar
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
