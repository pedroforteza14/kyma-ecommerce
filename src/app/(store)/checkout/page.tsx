'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type FormData = {
  name: string
  email: string
  phone: string
  address: string
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items, total: total() }),
      })

      const data = await res.json()

      if (data.init_point) {
        clearCart()
        window.location.href = data.init_point
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
        <button
          onClick={() => router.push('/')}
          className="text-sm underline underline-offset-4"
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold tracking-wide mb-8">Finalizar compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-sm font-semibold tracking-widest uppercase border-b pb-3">
            Datos de contacto
          </h2>

          {[
            { name: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Tu nombre' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com' },
            { name: 'phone', label: 'Teléfono / WhatsApp', type: 'tel', placeholder: '+54 9 11...' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-medium text-gray-700 mb-1 tracking-wide">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                required
                placeholder={field.placeholder}
                value={form[field.name as keyof FormData]}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 tracking-wide">
              Dirección de envío
            </label>
            <input
              type="text"
              name="address"
              required
              placeholder="Calle, número, ciudad, provincia"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 text-sm tracking-widest font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-400 mt-4"
          >
            {loading ? 'PROCESANDO...' : 'PAGAR CON MERCADO PAGO'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Serás redirigido a MercadoPago para completar el pago de forma segura.
          </p>
        </form>

        {/* Resumen del pedido */}
        <div className="bg-gray-50 p-6 space-y-6 h-fit">
          <h2 className="text-sm font-semibold tracking-widest uppercase border-b pb-3">
            Tu pedido
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.variant_id} className="flex gap-3">
                <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0 overflow-hidden rounded-sm">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-tight">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Talle {item.size} · x{item.quantity}
                  </p>
                  <p className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(total())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Envío</span>
              <span className="text-gray-500">A calcular</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(total())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
