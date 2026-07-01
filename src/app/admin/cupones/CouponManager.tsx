'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag, Loader2 } from 'lucide-react'
import { createCoupon, deleteCoupon, toggleCoupon } from './actions'

type Coupon = {
  id: string
  code: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_amount: number | null
  max_uses: number | null
  used_count: number
  expires_at: string | null
  active: boolean
  created_at: string
}

type Props = {
  initialCoupons: Coupon[]
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)

const EMPTY_FORM = {
  code: '',
  description: '',
  discount_type: 'percentage' as 'percentage' | 'fixed',
  discount_value: '',
  min_amount: '',
  max_uses: '',
  expires_at: '',
}

export default function CouponManager({ initialCoupons }: Props) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormError('')
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code.trim()) { setFormError('El código es requerido'); return }
    if (!form.discount_value || Number(form.discount_value) <= 0) {
      setFormError('El valor del descuento debe ser mayor a 0'); return
    }
    if (form.discount_type === 'percentage' && Number(form.discount_value) > 100) {
      setFormError('El porcentaje no puede ser mayor a 100'); return
    }

    startTransition(async () => {
      const result = await createCoupon({
        code: form.code.trim().toUpperCase(),
        description: form.description.trim() || null,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        min_amount: form.min_amount ? Number(form.min_amount) : null,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at || null,
      })

      if (result.error) {
        setFormError(result.error)
      } else if (result.coupon) {
        setCoupons([result.coupon, ...coupons])
        setForm(EMPTY_FORM)
        setShowForm(false)
      }
    })
  }

  const handleToggle = (id: string, currentActive: boolean) => {
    startTransition(async () => {
      const result = await toggleCoupon(id, !currentActive)
      if (!result.error) {
        setCoupons(coupons.map((c) => c.id === id ? { ...c, active: !currentActive } : c))
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('¿Eliminar este cupón? Esta acción no se puede deshacer.')) return
    startTransition(async () => {
      const result = await deleteCoupon(id)
      if (!result.error) {
        setCoupons(coupons.filter((c) => c.id !== id))
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* ── Botón nuevo ── */}
      <div className="flex justify-end">
        <button
          onClick={() => { setShowForm(!showForm); setFormError('') }}
          className="flex items-center gap-2 bg-[#111] text-white px-5 py-2.5 text-sm hover:bg-black/80 transition-colors"
        >
          <Plus size={16} />
          Nuevo cupón
        </button>
      </div>

      {/* ── Formulario ── */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border rounded-lg p-6 space-y-5"
        >
          <h2 className="font-semibold text-base">Crear cupón</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Código */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Código *
              </label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="VERANO20"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#111] uppercase tracking-widest cursor-text caret-black"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Descripción
              </label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="20% de descuento en toda la tienda"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#111] cursor-text caret-black"
              />
            </div>

            {/* Tipo */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Tipo de descuento *
              </label>
              <select
                name="discount_type"
                value={form.discount_type}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#111]"
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto fijo ($)</option>
              </select>
            </div>

            {/* Valor */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Valor *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  {form.discount_type === 'percentage' ? '%' : '$'}
                </span>
                <input
                  type="number"
                  name="discount_value"
                  value={form.discount_value}
                  onChange={handleChange}
                  placeholder={form.discount_type === 'percentage' ? '20' : '5000'}
                  min="1"
                  max={form.discount_type === 'percentage' ? '100' : undefined}
                  className="w-full border rounded pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#111] cursor-text caret-black"
                />
              </div>
            </div>

            {/* Monto mínimo */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Compra mínima
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  name="min_amount"
                  value={form.min_amount}
                  onChange={handleChange}
                  placeholder="Opcional"
                  min="0"
                  className="w-full border rounded pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#111] cursor-text caret-black"
                />
              </div>
            </div>

            {/* Límite de usos */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Límite de usos
              </label>
              <input
                type="number"
                name="max_uses"
                value={form.max_uses}
                onChange={handleChange}
                placeholder="Sin límite"
                min="1"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#111] cursor-text caret-black"
              />
            </div>

            {/* Vencimiento */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Vencimiento
              </label>
              <input
                type="date"
                name="expires_at"
                value={form.expires_at}
                onChange={handleChange}
                className="w-full sm:w-64 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#111] cursor-text caret-black"
              />
            </div>
          </div>

          {formError && (
            <p className="text-sm text-red-500">{formError}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-[#111] text-white px-6 py-2.5 text-sm hover:bg-black/80 transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Crear cupón
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setFormError('') }}
              className="px-6 py-2.5 text-sm border hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* ── Lista ── */}
      {coupons.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center">
          <Tag size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No hay cupones todavía</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wide px-5 py-3">
                  Código
                </th>
                <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wide px-5 py-3 hidden sm:table-cell">
                  Descuento
                </th>
                <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wide px-5 py-3 hidden md:table-cell">
                  Usos
                </th>
                <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wide px-5 py-3 hidden lg:table-cell">
                  Vence
                </th>
                <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wide px-5 py-3">
                  Estado
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {coupons.map((coupon) => {
                const isExpired = coupon.expires_at ? new Date(coupon.expires_at) < new Date() : false
                return (
                  <tr key={coupon.id} className={`hover:bg-gray-50/50 transition-colors ${!coupon.active ? 'opacity-50' : ''}`}>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-mono font-semibold text-sm tracking-wider">{coupon.code}</p>
                        {coupon.description && (
                          <p className="text-xs text-gray-400 mt-0.5">{coupon.description}</p>
                        )}
                        {coupon.min_amount && (
                          <p className="text-xs text-gray-400">Mínimo: {fmt(coupon.min_amount)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-sm font-medium">
                        {coupon.discount_type === 'percentage'
                          ? `${coupon.discount_value}%`
                          : fmt(coupon.discount_value)
                        }
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">
                        {coupon.used_count}
                        {coupon.max_uses !== null ? ` / ${coupon.max_uses}` : ''}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      {coupon.expires_at ? (
                        <span className={`text-xs ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
                          {isExpired ? 'Vencido · ' : ''}
                          {new Date(coupon.expires_at).toLocaleDateString('es-AR')}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">Sin vto.</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(coupon.id, coupon.active)}
                        disabled={isPending}
                        className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70 disabled:opacity-40"
                        title={coupon.active ? 'Desactivar' : 'Activar'}
                      >
                        {coupon.active ? (
                          <ToggleRight size={22} className="text-green-500" />
                        ) : (
                          <ToggleLeft size={22} className="text-gray-300" />
                        )}
                        <span className={coupon.active ? 'text-green-600' : 'text-gray-400'}>
                          {coupon.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        disabled={isPending}
                        className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40"
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
