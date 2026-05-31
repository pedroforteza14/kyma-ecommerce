import Link from 'next/link'

export default function ErrorPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center space-y-8 py-20">

        {/* Ícono */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full border border-gray-200 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gray-400">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        </div>

        {/* Texto */}
        <div className="space-y-3">
          <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400">Pago no procesado</p>
          <h1 className="font-display text-4xl font-light leading-tight">
            Algo salió<br />
            <em>mal</em>
          </h1>
          <p className="text-[13px] leading-relaxed text-gray-500 max-w-sm mx-auto">
            Tu pago no pudo procesarse. No se realizó ningún cargo a tu cuenta. Podés intentarlo nuevamente o contactarnos.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/checkout"
            className="inline-block bg-[#111] text-white px-12 py-4 text-[11px] tracking-[0.35em] uppercase hover:bg-black/80 transition-colors"
          >
            Reintentar
          </Link>
          <a
            href="https://instagram.com/kymaba"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.2em] uppercase text-gray-400 hover:text-[#111] transition-colors link-underline pb-0.5"
          >
            Contactarnos
          </a>
        </div>
      </div>
    </div>
  )
}
