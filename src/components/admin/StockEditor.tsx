'use client'

import { useState } from 'react'
import { updateVariantStock } from '@/lib/actions/stock'
import { ProductVariant } from '@/types'
import { Check, Loader2 } from 'lucide-react'

type Props = {
  variants: ProductVariant[]
  productId: string
}

export default function StockEditor({ variants, productId }: Props) {
  const [stocks, setStocks] = useState<Record<string, number>>(
    Object.fromEntries(variants.map((v) => [v.id, v.stock]))
  )
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  const handleSave = async (variantId: string) => {
    setSaving(variantId)
    await updateVariantStock(variantId, stocks[variantId], productId)
    setSaving(null)
    setSaved(variantId)
    setTimeout(() => setSaved(null), 1500)
  }

  return (
    <div className="bg-white border rounded-lg p-5 mt-6">
      <h2 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-4">
        Stock por talle
      </h2>
      <div className="space-y-3">
        {variants.map((variant) => (
          <div key={variant.id} className="flex items-center gap-4">
            <span className="w-12 text-sm font-medium">{variant.size}</span>
            <input
              type="number"
              min={0}
              value={stocks[variant.id]}
              onChange={(e) =>
                setStocks((prev) => ({
                  ...prev,
                  [variant.id]: Number(e.target.value),
                }))
              }
              className="w-24 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
            />
            <button
              onClick={() => handleSave(variant.id)}
              disabled={saving === variant.id}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs border rounded transition-all ${
                saved === variant.id
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'border-gray-300 hover:border-black'
              }`}
            >
              {saving === variant.id ? (
                <Loader2 size={12} className="animate-spin" />
              ) : saved === variant.id ? (
                <><Check size={12} /> Guardado</>
              ) : (
                'Guardar'
              )}
            </button>
            {stocks[variant.id] <= 3 && stocks[variant.id] > 0 && (
              <span className="text-xs text-orange-500">⚡ Stock bajo</span>
            )}
            {stocks[variant.id] === 0 && (
              <span className="text-xs text-red-500">Sin stock</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
