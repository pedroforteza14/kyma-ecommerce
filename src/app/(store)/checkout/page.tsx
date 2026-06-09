'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { ShieldCheck, Tag, X, Check, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const PaymentBrick = dynamic(() => import('@/components/store/PaymentBrick'), { ssr: false })

type FormData = {
  name: string
  email: string
  phone: string
  address: string
}

type CouponState = {
  code: string
  discount: number
  description: string
  valid: boolean
}

type OrderState = {
  orderId: string
  preferenceId: string | null
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)

const FIELDS: { name: keyof FormData; label: string; type: string; placeholder: string }[] = [
  { name: 'name',    label: 'Nombre completo',     type: 'text',  placeholder: 'Tu nombre y apellido'           },
  { name: 'email',   label: 'Email',               type: 'email', placeholder: 'tu@email.com'                   },
  { name: 'phone',   label: 'Teléfono / WhatsApp', type: 'tel',   placeholder: '+54 9 11 0000-0000'             },
  { name: 'address', label: 'Dirección de envío',  type: 'text',  placeholder: 'Calle, número, ciudad, provincia' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()

  const [step, setStep] = useState<'form' | 'payment'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', address: '' })
  const [order, setOrder] = useState<OrderState | null>(null)
  // Keep a snapshot of cart items and total for the summary on step 2 (after clearCart)
  const [itemsSnapshot, setItemsSnapshot] = useState(items)
  const [frozenTotal, setFrozenTotal] = useState(0)

  // Cupón
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [coupon, setCoupon] = useState<CouponState | null>(null)

  const subtotal = total()
  const discount = coupon?.discount ?? 0
  const finalTotal = Math.max(subtotal - discount, 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  // ── Validar cupón ─────────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError('')

    try {
      const res = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      })
      const data = await res.json()

      if (!res.ok || !data.valid) {
        setCouponError(data.error || 'Cupón no válido')
      } else {
        setCoupon({
          code: data.code,
          discount: data.discount,
          description: data.description,
          valid: true,
        })
        setCouponInput('')
      }
    } catch {
      setCouponError('No se pudo verificar el cupón')
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setCoupon(null)
    setCouponError('')
    setCouponInput('')
  }

  // ── Paso 1: Crear el pedido y avanzar al pago ─────────────────────────────
  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!items.length) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items,
          total: finalTotal,
          coupon_code: coupon?.code ?? null,
          discount,
        }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'Hubo un problema. Intentá de nuevo.')
        return
      }

      setItemsSnapshot([...items])
      setFrozenTotal(finalTotal)
      setOrder({ orderId: data.orderId, preferenceId: data.preferenceId })
      clearCart()
      setStep('payment')
    } catch {
      setError('Hubo un problema al procesar el pedido. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // ── Callbacks del Brick ───────────────────────────────────────────────────
  const handlePaymentSuccess = (orderId: string, payTotal: number) => {
    router.push(`/checkout/exito?order=${orderId}&total=${payTotal}`)
  }

  const handlePaymentPending = (orderId: string) => {
    router.push(`/checkout/pendiente?order=${orderId}`)
  }

  // ── Carrito vacío ─────────────────────────────────────────────────────────
  if (!items.length && step === 'form') {
    return (
      <div className="max-w-lg mx-auto px-5 py-32 text-center space-y-6">
        <span className="font-display text-9xl font-light text-gray-100 block">∅</span>
        <p className="font-display text-2xl font-light text-gray-400 italic">Tu carrito está vacío</p>
        <Link
          href="/"
          className="inline-block text-[11px] tracking-[0.3em] uppercase text-gray-400 hover:text-[#111] transition-colors link-underline"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-gray-400">
          <Link href="/" className="hover:text-[#111] transition-colors">Inicio</Link>
          <span>/</span>
          <span className={step === 'form' ? 'text-[#111]' : 'hover:text-[#111] transition-colors cursor-pointer'}>
            Tus datos
          </span>
          {step === 'payment' && (
            <>
              <span>/</span>
              <span className="text-[#111]">Pago</span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-14 xl:gap-20 items-start">

          {/* ══ PASO 1: FORMULARIO ══ */}
          {step === 'form' && (
            <form onSubmit={handleContinue} className="space-y-10">
              <div>
                <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-2">Paso 1 de 2</p>
                <h1 className="font-display text-4xl font-light">Tus datos</h1>
              </div>

              <div className="space-y-6">
                {FIELDS.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label
                      htmlFor={field.name}
                      className="block text-[10px] tracking-[0.3em] uppercase text-gray-500"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      required
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full border-b border-gray-200 px-0 py-3 text-[14px] bg-transparent focus:outline-none focus:border-[#111] transition-colors placeholder:text-gray-300"
                    />
                  </div>
                ))}
              </div>

              {/* ── Cupón ── */}
              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500">Cupón de descuento</p>

                {coupon ? (
                  <div className="flex items-center justify-between bg-[#f7f6f2] px-4 py-3 border border-[#111]/10">
                    <div className="flex items-center gap-2">
                      <Check size={13} strokeWidth={2} className="text-green-600" />
                      <span className="text-[12px] font-medium">{coupon.code}</span>
                      {coupon.description && (
                        <span className="text-[11px] text-gray-500">— {coupon.description}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-green-600 font-medium">-{fmt(coupon.discount)}</span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-gray-400 hover:text-[#111] transition-colors"
                        aria-label="Quitar cupón"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={13} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon() } }}
                        placeholder="TU CÓDIGO"
                        className="w-full border-b border-gray-200 pl-5 py-3 text-[13px] bg-transparent focus:outline-none focus:border-[#111] transition-colors placeholder:text-gray-300 tracking-widest"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="border border-gray-200 px-5 text-[10px] tracking-[0.25em] uppercase text-gray-500 hover:border-[#111] hover:text-[#111] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      {couponLoading ? <Loader2 size={12} className="animate-spin" /> : 'Aplicar'}
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-[11px] text-red-500 tracking-wide">{couponError}</p>
                )}
              </div>

              {error && (
                <p className="text-[12px] text-red-500 tracking-wide">{error}</p>
              )}

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-14 text-[11px] tracking-[0.4em] uppercase flex items-center justify-center gap-3 transition-all duration-300 ${
                    loading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#111] text-white hover:bg-black/80'
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Continuar al pago →'
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
                  <ShieldCheck size={13} strokeWidth={1.5} />
                  <span>Pago 100% seguro con MercadoPago</span>
                </div>
              </div>
            </form>
          )}

          {/* ══ PASO 2: PAGO ══ */}
          {step === 'payment' && order && (
            <div className="space-y-8">
              <div>
                <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-2">Paso 2 de 2</p>
                <h1 className="font-display text-4xl font-light">Pago seguro</h1>
                <p className="text-[12px] text-gray-400 mt-2">
                  Ingresá los datos de tu tarjeta directamente aquí — sin salir del sitio.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded px-4 py-3">
                  <p className="text-[12px] text-red-600">{error}</p>
                </div>
              )}

              <PaymentBrick
                preferenceId={order.preferenceId}
                amount={frozenTotal}
                orderId={order.orderId}
                payer={{
                  firstName: form.name.split(' ')[0],
                  lastName: form.name.split(' ').slice(1).join(' ') || '',
                  email: form.email,
                }}
                total={frozenTotal}
                onSuccess={handlePaymentSuccess}
                onPending={handlePaymentPending}
                onError={(msg) => setError(msg)}
              />

              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck size={13} strokeWidth={1.5} />
                <span>Tu información está protegida con encriptación SSL</span>
              </div>
            </div>
          )}

          {/* ══ RESUMEN DEL PEDIDO ══ */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div>
              <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-2">Resumen</p>
              <h2 className="font-display text-2xl font-light">Tu pedido</h2>
            </div>

            {/* Items — use snapshot after cart is cleared */}
            <div className="divide-y divide-gray-100">
              {(step === 'payment' ? itemsSnapshot : items).map((item) => (
                <div key={item.variant_id} className="flex gap-4 py-4">
                  <div className="relative w-16 aspect-[3/4] bg-[#f7f6f2] flex-shrink-0 overflow-hidden">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] leading-snug font-medium truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-400 mt-1 tracking-wide">
                      Talle {item.size}
                      {item.quantity > 1 && ` · x${item.quantity}`}
                    </p>
                    <p className="font-display text-base font-light mt-2">
                      {fmt(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="border-t border-gray-100 pt-5 space-y-3">
              <div className="flex justify-between text-[12px] text-gray-500">
                <span>Subtotal</span>
                <span>{fmt(subtotal > 0 ? subtotal : finalTotal)}</span>
              </div>

              {coupon && (
                <div className="flex justify-between text-[12px] text-green-600">
                  <span>Descuento ({coupon.code})</span>
                  <span>-{fmt(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[12px] text-gray-500">
                <span>Envío</span>
                <span className="text-gray-400">A calcular</span>
              </div>

              <div className="flex justify-between items-baseline border-t border-gray-100 pt-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-gray-500">Total</span>
                <span className="font-display text-2xl font-light">{fmt(step === 'payment' ? frozenTotal : finalTotal)}</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 tracking-wide text-center">
              Visa · Mastercard · MercadoPago · Transferencia
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
