'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { ShieldCheck, Tag, X, Check, Loader2, Truck, Store, Building2, Lock } from 'lucide-react'
import dynamic from 'next/dynamic'
import { trackInitiateCheckout } from '@/components/store/MetaPixel'

const PaymentBrick = dynamic(() => import('@/components/store/PaymentBrick'), { ssr: false })

type DeliveryMethod = 'envio' | 'retiro'

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

const CONTACT_FIELDS: { name: keyof FormData; label: string; type: string; placeholder: string }[] = [
  { name: 'name',  label: 'Nombre completo',     type: 'text',  placeholder: 'Tu nombre y apellido' },
  { name: 'email', label: 'Email',               type: 'email', placeholder: 'tu@email.com'         },
  { name: 'phone', label: 'Teléfono / WhatsApp', type: 'tel',   placeholder: '+54 9 11 0000-0000'   },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()

  const [step, setStep]               = useState<'form' | 'payment'>('form')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [form, setForm]               = useState<FormData>({ name: '', email: '', phone: '', address: '' })
  const [deliveryMethod, setDelivery] = useState<DeliveryMethod>('envio')
  const [order, setOrder]             = useState<OrderState | null>(null)
  const [itemsSnapshot, setSnapshot]  = useState(items)
  const [frozenTotal, setFrozenTotal] = useState(0)
  const [frozenSubtotal, setFrozenSub] = useState(0)

  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoad] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [coupon, setCoupon]           = useState<CouponState | null>(null)

  const subtotal   = total()
  const discount   = coupon?.discount ?? 0
  const finalTotal = Math.max(subtotal - discount, 0)

  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout({ value: subtotal, numItems: items.reduce((s, i) => s + i.quantity, 0) })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const saveAbandonedCart = () => {
    if (!form.email || !items.length) return
    fetch('/api/checkout/abandon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, name: form.name, items, subtotal }),
    }).catch(() => {})
  }

  const handleEmailBlur = () => { saveAbandonedCart() }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoad(true)
    setCouponError('')
    try {
      const res  = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      })
      const data = await res.json()
      if (!res.ok || !data.valid) {
        setCouponError(data.error || 'Cupón no válido')
      } else {
        setCoupon({ code: data.code, discount: data.discount, description: data.description, valid: true })
        setCouponInput('')
      }
    } catch {
      setCouponError('No se pudo verificar el cupón')
    } finally {
      setCouponLoad(false)
    }
  }

  const removeCoupon = () => { setCoupon(null); setCouponError(''); setCouponInput('') }

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!items.length) return
    if (deliveryMethod === 'envio' && !form.address.trim()) {
      setError('Ingresá tu dirección de envío.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          address:         deliveryMethod === 'retiro' ? 'Retiro en persona' : form.address,
          delivery_method: deliveryMethod,
          items,
          total:           finalTotal,
          coupon_code:     coupon?.code ?? null,
          discount,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) { setError(data.error || 'Hubo un problema. Intentá de nuevo.'); return }

      setSnapshot([...items])
      setFrozenTotal(finalTotal)
      setFrozenSub(subtotal)
      clearCart()
      setOrder({ orderId: data.orderId, preferenceId: data.preferenceId })
      setStep('payment')
    } catch {
      setError('Hubo un problema al procesar el pedido. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (orderId: string, payTotal: number) =>
    router.push(`/checkout/exito?order=${orderId}&total=${payTotal}`)

  const handlePaymentPending = (orderId: string, ticketUrl?: string) => {
    const params = new URLSearchParams({ order: orderId })
    if (ticketUrl) params.set('ticket', ticketUrl)
    router.push(`/checkout/pendiente?${params.toString()}`)
  }

  if (!items.length && step === 'form') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 py-24 text-center space-y-8">
        <p className="text-[80px] font-light text-gray-100 leading-none select-none">∅</p>
        <div className="space-y-2">
          <p className="text-xl font-light text-gray-500">Tu carrito está vacío</p>
          <p className="text-[11px] tracking-[0.2em] uppercase text-gray-300">No hay productos para pagar</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-[#111] px-8 py-3.5 text-[10px] tracking-[0.3em] uppercase text-[#111] hover:bg-[#111] hover:text-white transition-all duration-300"
        >
          Ir al inicio
        </Link>
      </div>
    )
  }

  const currentItems    = step === 'payment' ? itemsSnapshot : items
  const currentSubtotal = step === 'payment' ? frozenSubtotal : subtotal
  const currentTotal    = step === 'payment' ? frozenTotal : finalTotal
  const totalQty        = currentItems.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="min-h-screen bg-white">

      {/* ══ CHECKOUT HEADER ══ */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between">

          <Link href="/" className="hover:opacity-60 transition-opacity flex-shrink-0">
            <img src="/logo-transparent.png" alt="KYMA" className="h-8 w-auto" />
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] transition-colors duration-300 ${
                step === 'form' ? 'bg-[#111] text-white' : 'bg-green-500 text-white'
              }`}>
                {step === 'payment' ? <Check size={10} strokeWidth={2.5} /> : '1'}
              </span>
              <span className={`text-[9px] tracking-[0.3em] uppercase hidden sm:block transition-colors duration-300 ${
                step === 'form' ? 'text-[#111]' : 'text-green-500'
              }`}>Datos</span>
            </div>

            <div className={`w-10 h-px transition-colors duration-500 ${step === 'payment' ? 'bg-[#111]' : 'bg-gray-200'}`} />

            <div className="flex items-center gap-2">
              <span className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] border transition-colors duration-300 ${
                step === 'payment' ? 'bg-[#111] text-white border-[#111]' : 'border-gray-300 text-gray-300'
              }`}>2</span>
              <span className={`text-[9px] tracking-[0.3em] uppercase hidden sm:block transition-colors duration-300 ${
                step === 'payment' ? 'text-[#111]' : 'text-gray-300'
              }`}>Pago</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 tracking-wide">
            <Lock size={10} strokeWidth={1.5} />
            <span className="hidden sm:inline">Compra segura</span>
          </div>
        </div>
      </div>

      {/* ══ MAIN ══ */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-start">

          {/* ═══ LEFT COLUMN ═══ */}
          <div>

            {/* PASO 1: FORMULARIO */}
            {step === 'form' && (
              <form onSubmit={handleContinue} className="space-y-10">
                <div className="space-y-1">
                  <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400">Paso 1 de 2</p>
                  <h1 className="text-3xl font-light tracking-wide">Tus datos</h1>
                </div>

                {/* Contacto */}
                <div className="space-y-6">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gray-400">Contacto</p>
                  {CONTACT_FIELDS.map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="block text-[9px] tracking-[0.35em] uppercase text-gray-400 mb-2.5"
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
                        onBlur={field.name === 'email' ? handleEmailBlur : undefined}
                        className="w-full border-b border-gray-200 pb-3 text-[14px] bg-transparent focus:outline-none focus:border-[#111] transition-colors duration-200 placeholder:text-gray-300"
                      />
                    </div>
                  ))}
                </div>

                {/* Entrega */}
                <div className="space-y-4">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gray-400">Método de entrega</p>

                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { id: 'envio'  as DeliveryMethod, icon: Truck, title: 'Envío a domicilio', badge: 'Gratis',       badgeColor: 'text-green-600' },
                      { id: 'retiro' as DeliveryMethod, icon: Store, title: 'Retiro en persona', badge: 'Buenos Aires', badgeColor: 'text-gray-400'  },
                    ] as const).map(({ id, icon: Icon, title, badge, badgeColor }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setDelivery(id)}
                        className={`relative flex flex-col gap-3 p-4 border text-left transition-all duration-200 ${
                          deliveryMethod === id
                            ? 'border-[#111] bg-[#111]/[0.02]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {deliveryMethod === id && (
                          <span className="absolute top-3 right-3 w-[18px] h-[18px] rounded-full bg-[#111] flex items-center justify-center">
                            <Check size={8} strokeWidth={3} className="text-white" />
                          </span>
                        )}
                        <Icon size={15} strokeWidth={1.5} className={deliveryMethod === id ? 'text-[#111]' : 'text-gray-400'} />
                        <div>
                          <p className={`text-[12px] font-medium leading-tight ${deliveryMethod === id ? 'text-[#111]' : 'text-gray-500'}`}>
                            {title}
                          </p>
                          <p className={`text-[11px] mt-0.5 font-medium ${badgeColor}`}>{badge}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {deliveryMethod === 'envio' && (
                    <div>
                      <label htmlFor="address" className="block text-[9px] tracking-[0.35em] uppercase text-gray-400 mb-2.5">
                        Dirección de envío
                      </label>
                      <input
                        id="address"
                        type="text"
                        name="address"
                        placeholder="Calle, número, ciudad, provincia"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full border-b border-gray-200 pb-3 text-[14px] bg-transparent focus:outline-none focus:border-[#111] transition-colors duration-200 placeholder:text-gray-300"
                      />
                    </div>
                  )}

                  {deliveryMethod === 'retiro' && (
                    <div className="bg-[#f9f8f6] border border-gray-100 px-4 py-3.5">
                      <p className="text-[12px] text-gray-500 leading-relaxed tracking-wide">
                        Coordinamos lugar y horario de retiro por WhatsApp.
                      </p>
                    </div>
                  )}
                </div>

                {/* Cupón */}
                <div className="space-y-3">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-gray-400">Cupón de descuento</p>
                  {coupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-100 px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Check size={12} strokeWidth={2.5} className="text-green-600 flex-shrink-0" />
                        <span className="text-[12px] font-medium text-green-800">{coupon.code}</span>
                        {coupon.description && (
                          <span className="text-[11px] text-green-600">— {coupon.description}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] font-medium text-green-700">-{fmt(coupon.discount)}</span>
                        <button type="button" onClick={removeCoupon} className="text-green-400 hover:text-green-700 transition-colors" aria-label="Quitar cupón">
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag size={11} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon() } }}
                          placeholder="TU CÓDIGO"
                          className="w-full border-b border-gray-200 pl-5 pb-3 text-[12px] bg-transparent focus:outline-none focus:border-[#111] transition-colors placeholder:text-gray-300 tracking-widest"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="border border-gray-200 px-5 py-2 text-[9px] tracking-[0.3em] uppercase text-gray-500 hover:border-[#111] hover:text-[#111] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        {couponLoading ? <Loader2 size={11} className="animate-spin" /> : 'Aplicar'}
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-[11px] text-red-500 tracking-wide">{couponError}</p>}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 px-4 py-3">
                    <p className="text-[12px] text-red-600 tracking-wide">{error}</p>
                  </div>
                )}

                {/* CTA */}
                <div className="space-y-5 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-[54px] text-[10px] tracking-[0.4em] uppercase flex items-center justify-center gap-3 transition-all duration-300 ${
                      loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#111] text-white hover:bg-black/80'
                    }`}
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>Continuar al pago <span className="opacity-50 ml-1">→</span></>
                    )}
                  </button>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-5">
                    {[
                      { icon: ShieldCheck, label: 'Pago seguro'    },
                      { icon: Lock,        label: 'SSL encriptado' },
                      { icon: Truck,       label: 'Envío gratis'   },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <Icon size={11} strokeWidth={1.5} />
                        <span className="hidden sm:inline tracking-wide">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* PASO 2: PAGO */}
            {step === 'payment' && order && (
              <div className="space-y-8">
                <div className="space-y-1">
                  <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400">Paso 2 de 2</p>
                  <h1 className="text-3xl font-light tracking-wide">Elegí cómo pagar</h1>
                  <p className="text-[12px] text-gray-400 mt-2 tracking-wide">
                    Tarjeta de crédito, débito o cuenta de MercadoPago.
                  </p>
                </div>

                {/* Resumen rápido */}
                <div className="bg-[#f9f8f6] border border-gray-100 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    <span className="text-[11px] text-gray-500 tracking-wide">
                      {totalQty} producto{totalQty !== 1 ? 's' : ''} · {form.name.split(' ')[0]}
                    </span>
                  </div>
                  <span className="text-[15px] font-light">{fmt(frozenTotal)}</span>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 px-4 py-3">
                    <p className="text-[12px] text-red-600 tracking-wide">{error}</p>
                  </div>
                )}

                <PaymentBrick
                  preferenceId={order.preferenceId}
                  amount={frozenTotal}
                  orderId={order.orderId}
                  payer={{
                    firstName: form.name.split(' ')[0],
                    lastName:  form.name.split(' ').slice(1).join(' ') || '',
                    email:     form.email,
                  }}
                  total={frozenTotal}
                  onSuccess={handlePaymentSuccess}
                  onPending={handlePaymentPending}
                  onError={(msg) => setError(msg)}
                />

                {/* Separador */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[9px] tracking-[0.4em] uppercase text-gray-300">o pagá con</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Transferencia bancaria — 15% OFF */}
                {(() => {
                  const transferTotal    = Math.round(frozenTotal * 0.85)
                  const transferDiscount = frozenTotal - transferTotal
                  return (
                    <div className="space-y-2">
                      {/* Badge descuento */}
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] tracking-[0.3em] uppercase bg-green-600 text-white px-2 py-0.5 font-medium">
                          15% OFF
                        </span>
                        <span className="text-[10px] text-green-700 tracking-wide">
                          Ahorrás {fmt(transferDiscount)} pagando por transferencia
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          setLoading(true)
                          setError('')
                          try {
                            await fetch('/api/checkout/bank-transfer', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                orderId:          order.orderId,
                                discountedTotal:  transferTotal,
                                discountAmount:   transferDiscount,
                              }),
                            })
                            router.push(`/checkout/pendiente?order=${order.orderId}&method=transfer&total=${transferTotal}`)
                          } catch {
                            setError('Hubo un error. Intentá de nuevo.')
                            setLoading(false)
                          }
                        }}
                        disabled={loading}
                        className="w-full flex items-center gap-4 border border-green-200 bg-green-50/50 px-5 py-4 text-left hover:border-green-400 transition-all duration-200 disabled:opacity-50 group"
                      >
                        <div className="w-9 h-9 border border-green-200 flex items-center justify-center flex-shrink-0 group-hover:border-green-400 transition-colors">
                          <Building2 size={15} strokeWidth={1.5} className="text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[13px] font-medium text-[#111]">Transferencia bancaria</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 tracking-wide">Te enviamos el CBU y alias por email</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-gray-400 line-through">{fmt(frozenTotal)}</p>
                          <p className="text-[14px] font-medium text-green-700">{fmt(transferTotal)}</p>
                        </div>
                      </button>
                    </div>
                  )
                })()}

                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <ShieldCheck size={12} strokeWidth={1.5} />
                  <span className="tracking-wide">Tu información está protegida con encriptación SSL</span>
                </div>
              </div>
            )}
          </div>

          {/* ═══ RIGHT COLUMN: RESUMEN ═══ */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-[#f9f8f6] border border-gray-100 p-6 sm:p-8">

              <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-6">Tu pedido</p>

              {/* Items */}
              <div className="space-y-5 mb-6">
                {currentItems.map((item) => (
                  <div key={item.variant_id} className="flex gap-4">
                    <div className="relative w-[58px] aspect-[3/4] bg-white flex-shrink-0 overflow-hidden">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="58px" />
                      )}
                      {item.quantity > 1 && (
                        <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-[#111] text-white text-[9px] flex items-center justify-center rounded-full font-medium">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <p className="text-[12px] font-medium leading-snug line-clamp-2 text-[#111]">{item.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 tracking-wide">Talle {item.size}</p>
                      </div>
                      <p className="text-[13px] font-light text-[#111] mt-1">{fmt(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-200 mb-5" />

              {/* Totales */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[12px] text-gray-500">
                  <span>Subtotal</span>
                  <span>{fmt(currentSubtotal)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-[12px]">
                    <span className="text-green-600">Descuento ({coupon.code})</span>
                    <span className="text-green-600 font-medium">-{fmt(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[12px] text-gray-500">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-gray-200">
                  <span className="text-[9px] tracking-[0.4em] uppercase text-gray-500">Total</span>
                  <span className="text-2xl font-light text-[#111]">{fmt(currentTotal)}</span>
                </div>
              </div>

              {/* Medios de pago */}
              <div className="border-t border-gray-200 pt-5 space-y-3">
                <p className="text-[9px] tracking-[0.4em] uppercase text-gray-400">Medios de pago</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Visa', 'Mastercard', 'MercadoPago', 'Débito', 'Transferencia'].map((mp) => (
                    <span key={mp} className="text-[9px] tracking-wide text-gray-400 border border-gray-200 px-2 py-1 bg-white">
                      {mp}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 tracking-wide">3 cuotas sin interés con MercadoPago</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
