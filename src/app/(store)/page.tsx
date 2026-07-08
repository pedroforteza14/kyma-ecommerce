import Link from 'next/link'
import MobileLanding from '@/components/store/MobileLanding'

export default function HomePage() {
  return (
    <div>

      {/* ── Mobile: fullscreen editorial landing ── */}
      <MobileLanding />

      {/* ── Desktop: split editorial — panel oscuro + imagen ── */}
      <section className="hidden lg:flex h-[calc(100vh-56px)] min-h-[640px]">

        {/* Panel izquierdo — oscuro, brand statement */}
        <div className="w-[36%] flex-shrink-0 bg-[#0e0e0e] flex flex-col justify-between px-14 pt-14 pb-12">

          {/* Top: marcador */}
          <p className="text-[7px] tracking-[0.65em] uppercase text-white/20 animate-fade-up">
            Buenos Aires · AR
          </p>

          {/* Centro: colección en sans grande, sin serif */}
          <div className="animate-fade-up-delay">
            <p className="text-[8px] tracking-[0.55em] uppercase text-white/25 mb-6">
              Colección
            </p>
            <h2
              className="text-white leading-[0.88] font-thin"
              style={{ fontSize: 'clamp(3.2rem, 4.8vw, 5.2rem)', letterSpacing: '0.04em' }}
            >
              AFTER<br />HOURS
            </h2>
            <div className="mt-6 w-8 h-px bg-white/20" />
          </div>

          {/* Bottom: CTAs */}
          <div className="animate-fade-up-delay-2">
            <Link
              href="/categoria/after-hours-collection"
              className="flex items-center justify-between py-4 border-t border-white/10 text-[9px] tracking-[0.42em] uppercase text-white hover:text-white/50 transition-colors duration-300 group"
            >
              Ver colección
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
            <Link
              href="/categoria/sale"
              className="flex items-center justify-between py-4 border-t border-white/10 text-[9px] tracking-[0.42em] uppercase text-white/28 hover:text-white/50 transition-colors duration-300 group"
            >
              Sale
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </div>

        </div>

        {/* Panel derecho — imagen pura, sin overlay */}
        <div className="flex-1 relative overflow-hidden">
          <img
            src="https://wdzbledtvuoaujrgusti.supabase.co/storage/v1/object/public/products/hero/hero-1920.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-[50%_8%]"
            fetchPriority="high"
            style={{ filter: 'contrast(1.05) brightness(0.96)' }}
          />
        </div>

      </section>

    </div>
  )
}
