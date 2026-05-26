import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function ErrorPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-6">
      <div className="flex justify-center">
        <XCircle size={64} className="text-red-400" strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-bold">Hubo un problema con el pago</h1>
      <p className="text-gray-500 leading-relaxed">
        Tu pago no pudo procesarse. No se realizó ningún cargo. Podés intentarlo
        nuevamente o contactarnos por Instagram.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/checkout"
          className="bg-black text-white px-8 py-4 text-sm tracking-widest hover:bg-gray-900 transition-colors"
        >
          REINTENTAR
        </Link>
        <Link
          href="/"
          className="border border-gray-300 px-8 py-4 text-sm tracking-widest hover:border-black transition-colors"
        >
          IR AL INICIO
        </Link>
      </div>
    </div>
  )
}
