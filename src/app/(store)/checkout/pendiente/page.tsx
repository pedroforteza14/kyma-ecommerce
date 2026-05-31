import Link from 'next/link'

type Props = {
  searchParams: Promise<{ order?: string }>
}

export default async function PendingPage({ searchParams }: Props) {
  const { order } = await searchParams

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center space-y-8 py-20">

        {/* Ícono */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gray-400">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        {/* Texto */}
        <div className="space-y-3">
          <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400">Pago en proceso</p>
          <h1 className="font-display text-4xl font-light leading-tight">
            Verificando<br />
            <em>tu pago</em>
          </h1>
          <p className="text-[13px] leading-relaxed text-gray-500 max-w-sm mx-auto">
            Tu pago está siendo verificado por MercadoPago. Esto puede tardar unos minutos. Te avisamos por email cuando esté confirmado.
          </p>
        </div>

        {/* Número de pedido */}
        {order && (
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300">
            Pedido #{order.slice(0, 8).toUpperCase()}
          </p>
        )}

        {/* CTA */}
        <Link
          href="/"
          className="inline-block border border-[#111] text-[#111] px-12 py-4 text-[11px] tracking-[0.35em] uppercase hover:bg-[#111] hover:text-white transition-all duration-300"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  )
}
