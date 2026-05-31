import Link from 'next/link'

type Props = {
  searchParams: Promise<{ order?: string }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const { order } = await searchParams

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center space-y-8 py-20">

        {/* Ícono */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#111]">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Texto */}
        <div className="space-y-3">
          <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400">Pago confirmado</p>
          <h1 className="font-display text-4xl font-light leading-tight">
            ¡Gracias por<br />tu compra!
          </h1>
          <p className="text-[13px] leading-relaxed text-gray-500 max-w-sm mx-auto">
            Tu pago fue procesado con éxito. Te enviamos un email con los detalles del pedido y nos contactamos para coordinar el envío.
          </p>
        </div>

        {/* Número de pedido */}
        {order && (
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300">
            Pedido #{order.slice(0, 8).toUpperCase()}
          </p>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-block bg-[#111] text-white px-12 py-4 text-[11px] tracking-[0.35em] uppercase hover:bg-black/80 transition-colors"
          >
            Seguir comprando
          </Link>
          <a
            href="https://instagram.com/kymaba"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#111] transition-colors link-underline pb-0.5"
          >
            @kymaba
          </a>
        </div>
      </div>
    </div>
  )
}
