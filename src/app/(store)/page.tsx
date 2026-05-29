import { createClient } from '@/lib/supabase/server'
import { Product } from '@/types'
import ProductCard from '@/components/store/ProductCard'
import Link from 'next/link'

export default async function HomePage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const isConfigured = supabaseUrl.startsWith('http')

  let featured: Product[] = []
  let sale: Product[] = []

  if (isConfigured) {
    const supabase = await createClient()
    const [{ data: f }, { data: s }] = await Promise.all([
      supabase
        .from('products')
        .select('*, category:categories(*), variants:product_variants(*)')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(8),
      supabase
        .from('products')
        .select('*, category:categories(*), variants:product_variants(*)')
        .not('original_price', 'is', null)
        .eq('is_active', true)
        .limit(4),
    ])
    featured = (f as Product[]) ?? []
    sale = (s as Product[]) ?? []
  }

  return (
    <div>
      {/* ══════ HERO ══════ */}
      <section className="relative h-[93vh] min-h-[580px] bg-[#f7f6f2] flex items-center justify-center overflow-hidden">

        {/* Watermark KYMA */}
        <span
          aria-hidden
          className="absolute select-none font-display font-light text-[20vw] text-[#ece9e3] leading-none pointer-events-none animate-fade-in"
          style={{ letterSpacing: '-0.02em' }}
        >
          KYMA
        </span>

        {/* Línea diagonal decorativa */}
        <div className="absolute top-0 right-[30%] w-px h-full bg-gradient-to-b from-transparent via-[#ddd]/50 to-transparent" />

        {/* Número de colección — esquina superior derecha */}
        <div className="absolute top-8 right-8 text-right animate-fade-up">
          <p className="text-[9px] tracking-[0.4em] uppercase text-gray-400">Colección</p>
          <p className="font-display text-3xl font-light text-gray-300">01</p>
        </div>

        {/* Categorías rápidas — esquina inferior izquierda */}
        <div className="absolute bottom-10 left-8 hidden md:flex flex-col gap-2 animate-fade-up">
          {['Básicos', 'Sweaters', 'Camperas'].map((c, i) => (
            <span key={c} className="text-[9px] tracking-[0.35em] uppercase text-gray-400" style={{ animationDelay: `${i * 80}ms` }}>
              {c}
            </span>
          ))}
        </div>

        {/* Contenido central */}
        <div className="relative text-center space-y-8 px-6">
          <p className="text-[10px] tracking-[0.65em] uppercase text-gray-400 animate-fade-up">
            2025
          </p>
          <h1 className="font-display font-light leading-[1.05] animate-fade-up-delay" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '0.08em' }}>
            Nueva<br />
            <em className="not-italic" style={{ fontStyle: 'italic' }}>colección</em>
          </h1>
          <div className="animate-fade-up-delay-2 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/categoria/basicos-esenciales"
              className="inline-block bg-[#111] text-white px-12 py-4 text-[11px] tracking-[0.35em] uppercase hover:bg-black/75 transition-colors duration-300"
            >
              Ver colección
            </Link>
            <Link
              href="/categoria/sale"
              className="inline-block border border-[#111]/40 text-[#111] px-12 py-4 text-[11px] tracking-[0.35em] uppercase hover:border-[#111] hover:bg-[#111] hover:text-white transition-all duration-300"
            >
              Sale
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-up-delay-2">
          <div className="w-px h-14 bg-[#111]/20 animate-scroll-pulse" />
          <span className="text-[8px] tracking-[0.45em] uppercase text-gray-400">Scroll</span>
        </div>
      </section>

      {/* ══════ CATEGORÍAS ══════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        {/* Header de sección */}
        <div className="flex items-end justify-between mb-10" data-reveal>
          <div>
            <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-1">Explorar</p>
            <h2 className="font-display text-4xl font-light">Categorías</h2>
          </div>
          <span className="font-display text-6xl font-light text-gray-100 hidden sm:block select-none">
            02
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: 'Básicos\nEsenciales',   slug: 'basicos-esenciales', num: '01' },
            { name: 'Sweaters',              slug: 'sweaters',           num: '02' },
            { name: 'Camperas\n& Blazers',   slug: 'camperas',           num: '03' },
            { name: 'SALE',                  slug: 'sale',               num: '04', accent: true },
          ].map((cat, i) => (
            <div key={cat.slug} data-reveal data-delay={i * 80}>
              <Link
                href={`/categoria/${cat.slug}`}
                className="group relative bg-[#f7f6f2] aspect-[4/5] flex flex-col justify-between p-5 overflow-hidden block hover:bg-[#111] transition-colors duration-500"
              >
                <span className={`text-[9px] tracking-[0.4em] font-light transition-colors duration-500 ${cat.accent ? 'text-red-400 group-hover:text-red-300' : 'text-gray-400 group-hover:text-white/40'}`}>
                  {cat.num}
                </span>
                <div>
                  <p className={`font-display text-2xl sm:text-3xl font-light leading-tight whitespace-pre-line transition-colors duration-500 mb-3 ${cat.accent ? 'text-red-500 group-hover:text-red-400' : 'group-hover:text-white'}`}>
                    {cat.name}
                  </p>
                  <div className="flex items-center gap-2 overflow-hidden h-4">
                    <div className="w-0 group-hover:w-4 h-px bg-white transition-all duration-500" />
                    <p className="text-[9px] tracking-[0.35em] uppercase text-gray-400 group-hover:text-white/70 transition-colors duration-500 -translate-x-2 group-hover:translate-x-0 transition-transform">
                      Ver todo
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ DIVISOR ══════ */}
      <div className="border-t border-[#f0ede8] mx-5 sm:mx-8" />

      {/* ══════ DESTACADOS ══════ */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div className="flex items-end justify-between mb-12" data-reveal>
            <div>
              <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-1">Selección</p>
              <h2 className="font-display text-4xl font-light">Destacados</h2>
            </div>
            <Link href="/categoria/basicos-esenciales" className="text-[11px] tracking-[0.2em] uppercase link-underline pb-0.5 hidden sm:block">
              Ver todo
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
            {featured.map((product, i) => (
              <div key={product.id} data-reveal data-delay={i * 60}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════ FRANJA MARQUEE ══════ */}
      <div className="bg-[#111] text-white py-5 overflow-hidden" data-reveal="fade">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="text-[11px] tracking-[0.45em] uppercase px-10 font-light text-white/70">
              Nueva colección · Envíos a todo el país · Cuotas sin interés ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ══════ SALE ══════ */}
      {sale.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div className="flex items-end justify-between mb-12" data-reveal>
            <div>
              <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-1">Ofertas</p>
              <h2 className="font-display text-4xl font-light text-red-500">Sale</h2>
            </div>
            <Link href="/categoria/sale" className="text-[11px] tracking-[0.2em] uppercase link-underline pb-0.5 text-red-500 hidden sm:block">
              Ver todo
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
            {sale.map((product, i) => (
              <div key={product.id} data-reveal data-delay={i * 60}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════ CTA FINAL ══════ */}
      <section className="relative bg-[#f7f6f2] py-32 text-center overflow-hidden">
        {/* Número decorativo */}
        <span aria-hidden className="absolute right-8 top-8 font-display text-[10rem] font-light text-[#ede9e3] leading-none select-none pointer-events-none">
          K
        </span>
        <div data-reveal>
          <p className="text-[9px] tracking-[0.55em] uppercase text-gray-400 mb-5">KYMA</p>
          <h2 className="font-display text-4xl sm:text-6xl font-light leading-tight mb-10">
            Moda con<br />
            <em>identidad propia</em>
          </h2>
          <Link
            href="/categoria/basicos-esenciales"
            className="inline-block border border-[#111] text-[#111] px-14 py-4 text-[11px] tracking-[0.35em] uppercase hover:bg-[#111] hover:text-white transition-all duration-300"
          >
            Explorar todo
          </Link>
        </div>
      </section>
    </div>
  )
}
