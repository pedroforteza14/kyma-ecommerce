'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Más nuevos' },
  { value: 'price_asc',  label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
  { value: 'discount',   label: 'Con descuento' },
]

export default function CategoryFilters({ total }: { total: number }) {
  const router      = useRouter()
  const pathname    = usePathname()
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-5 border-b border-gray-100">
      <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400">
        {total} {total === 1 ? 'producto' : 'productos'}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[9px] tracking-[0.35em] uppercase text-gray-300 mr-2 hidden sm:block">Ordenar</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSort(opt.value)}
            className={`px-3.5 py-1.5 text-[9px] tracking-[0.25em] uppercase transition-all duration-200 border ${
              currentSort === opt.value
                ? 'bg-[#111] text-white border-[#111]'
                : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-[#111]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
