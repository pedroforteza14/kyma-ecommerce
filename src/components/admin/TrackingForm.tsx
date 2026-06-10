'use client'

import { useState } from 'react'
import { updateOrderTracking } from '@/lib/actions/orders'
import { Truck, CheckCircle, Loader2 } from 'lucide-react'

const CARRIERS = ['Andreani', 'OCA', 'Correo Argentino', 'Mercado Envíos', 'Otro']

type Props = {
  orderId: string
  currentCarrier?: string | null
  currentTracking?: string | null
}

export default function TrackingForm({ orderId, currentCarrier, currentTracking }: Props) {
  const [carrier, setCarrier]         = useState(currentCarrier ?? '')
  const [tracking, setTracking]       = useState(currentTracking ?? '')
  const [loading, setLoading]         = useState(false)
  const [saved, setSaved]             = useState(false)

  const alreadyShipped = !!(currentCarrier && currentTracking)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!carrier || !tracking.trim()) return
    setLoading(true)
    await updateOrderTracking(orderId, carrier, tracking.trim())
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Transportista */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 tracking-widest uppercase mb-2">
          Transportista
        </label>
        <div className="flex flex-wrap gap-2">
          {CARRIERS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCarrier(c)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                carrier === c
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 text-gray-600 hover:border-gray-500'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Número de seguimiento */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 tracking-widest uppercase mb-2">
          Número de seguimiento
        </label>
        <input
          type="text"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="ej. AND123456789AR"
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors font-mono cursor-text caret-black"
        />
      </div>

      {/* Botón */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || !carrier || !tracking.trim()}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded border transition-all ${
            loading || !carrier || !tracking.trim()
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white border-black hover:bg-black/80'
          }`}
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : saved ? (
            <CheckCircle size={14} />
          ) : (
            <Truck size={14} />
          )}
          {loading ? 'Guardando...' : saved ? '¡Guardado!' : 'Marcar como enviado'}
        </button>

        {saved && (
          <p className="text-xs text-green-600">
            Estado actualizado y email enviado al cliente ✓
          </p>
        )}
      </div>

      {alreadyShipped && !saved && (
        <p className="text-xs text-gray-400">
          Enviado con {currentCarrier} · {currentTracking}
        </p>
      )}
    </form>
  )
}
