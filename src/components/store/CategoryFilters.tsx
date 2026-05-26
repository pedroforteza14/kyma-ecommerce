'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Más nuevos' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
  { value: 'discount', label: 'Con descuento' },
]

export default function CategoryFilters({ total }: { total: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('orden') ?? 'newest'

  const setSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('orden', value)
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="flex items-center justify-between mb-8 border-b pb-6">
      <p className="text-sm text-gray-500">{total} productos</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 hidden sm:block">Ordenar:</span>
        <select
          value={currentSort}
          onChange={(e) => setSort(e.target.value)}
          className="text-sm border border-gray-300 px-3 py-2 focus:outline-none focus:border-black transition-colors bg-white cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
