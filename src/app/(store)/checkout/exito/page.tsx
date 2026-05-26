import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

type Props = {
  searchParams: Promise<{ order?: string }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const { order } = await searchParams

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle size={64} className="text-green-500" strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-bold">¡Gracias por tu compra!</h1>
      <p className="text-gray-500 leading-relaxed">
        Tu pago fue procesado con éxito. Te enviamos un email con los detalles
        de tu pedido. Nos ponemos en contacto para coordinar el envío.
      </p>
      {order && (
        <p className="text-xs text-gray-400 font-mono">
          Pedido: {order.slice(0, 8).toUpperCase()}
        </p>
      )}
      <Link
        href="/"
        className="inline-block bg-black text-white px-10 py-4 text-sm tracking-widest hover:bg-gray-900 transition-colors"
      >
        SEGUIR COMPRANDO
      </Link>
    </div>
  )
}
