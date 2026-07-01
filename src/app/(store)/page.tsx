import { createClient } from '@/lib/supabase/server'
import { Product } from '@/types'
import ProductCard from '@/components/store/ProductCard'
import Link from 'next/link'

export default async function HomePage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const isConfigured = supabaseUrl.startsWith('http')

  let featured: Product[] = []

  if (isConfigured) {
    const supabase = await createClient()
    const { data: f } = await supabase
      .from('products')
      .select('*, category:categories(*), variants:product_variants(*)')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(8)
    featured = (f as Product[]) ?? []
  }

  return (
    <div>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="relative h-[94vh] min-h-[600px] flex items-center justify-center overflow-hidden">

        {/* Foto de fondo */}
        <img
          src="https://acdn-us.mitiendanube.com/stores/006/445/993/themes/uyuni/2-slide-1780435199759-8036263829-c3e7b37018d3027735c1919bdc3604491780435201-1024-1024.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
        />

        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Contenido central */}
        <div className="relative text-center px-6 space-y-10">
          <div className="space-y-4">
            <p className="text-[8px] tracking-[0.75em] uppercase text-white/60 animate-fade-up">
              Buenos Aires · Argentina
            </p>
            <h1
              className="font-display font-light leading-[1.02] text-white animate-fade-up-delay"
              style={{ fontSize: 'clamp(3.2rem, 9vw, 7.5rem)', letterSpacing: '0.07em' }}
            >
              Nueva<br />
              <em>colección</em>
            </h1>
          </div>

          <div className="animate-fade-up-delay-2 flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              href="/categoria/after-hours-collection"
              className="inline-flex items-center gap-3 bg-white text-[#111] px-11 py-3.5 text-[10px] tracking-[0.4em] uppercase hover:bg-white/90 transition-colors duration-300"
            >
              Ver colección
            </Link>
            <Link
              href="/categoria/sale"
              className="inline-flex items-center gap-3 border border-white/50 text-white px-11 py-3.5 text-[10px] tracking-[0.4em] uppercase hover:border-white hover:bg-white hover:text-[#111] transition-all duration-300"
            >
              Sale
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 animate-fade-up-delay-3">
          <div className="w-px h-12 bg-white/30 animate-scroll-pulse" />
          <span className="text-[7px] tracking-[0.55em] uppercase text-white/50">Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════
          STRIP DE VALORES
      ══════════════════════════════════ */}
      <div className="border-y border-[#ece9e3] bg-white overflow-hidden" data-reveal="fade">
        <div className="flex animate-marquee whitespace-nowrap py-4">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="text-[9px] tracking-[0.5em] uppercase px-12 text-gray-400 font-light">
              Envío gratis · Cambios sin cargo · Cuotas sin interés · Calidad premium ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          CATEGORÍAS
      ══════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="flex items-end justify-between mb-10 sm:mb-14" data-reveal>
          <div>
            <p className="text-[8px] tracking-[0.6em] uppercase text-gray-400 mb-2">Explorar</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light tracking-wide">Categorías</h2>
          </div>
          <span className="font-display text-7xl font-light text-[#ece9e3] hidden sm:block select-none leading-none">
            02
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {[
            { name: 'After Hours\nCollection', slug: 'after-hours-collection', num: '01', img: '454-e15f74a90f59ebb06d17805022986320' },
            { name: 'Tops\n& Bodys',           slug: 'top-bodys',              num: '02', img: '46-99a58451ecabe775ee17596104957657'  },
            { name: 'Remeras',                 slug: 'remeras',                num: '03', img: '245-36efb0a285d388300617706587030915' },
            { name: 'Camisas\n& Blusas',       slug: 'camisas-blusas',         num: '04', img: '428-51ca91c661c4002c7417805019665068' },
            { name: 'Sweaters',                slug: 'sweaters',               num: '05', img: '422-b32c7dca32b85ae8f817805020614745' },
            { name: 'Jackets\n& Blazers',      slug: 'jackets-blazers',        num: '06', img: '414-2bc1fa028a2ca6736a17810179062988' },
            { name: 'Pantalones',              slug: 'pantalones',             num: '07', img: '332-41fc179214ee1c7f6317563176290037' },
            { name: 'Faldas\n& Shorts',        slug: 'polleras-shorts',        num: '08', img: '317-46a13e092080569e5c17730717836463' },
            { name: 'Accesorios',              slug: 'accesorios',             num: '09', img: '442-4de659f5b3ad49dcb017810169630971' },
            { name: 'SALE',                    slug: 'sale',                   num: '10', img: '469-32727c377e70bc535917805013942218', accent: true },
          ].map((cat, i) => (
            <div key={cat.slug} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <Link
                href={`/categoria/${cat.slug}`}
                className="group relative aspect-[4/5] flex flex-col justify-between p-5 sm:p-6 overflow-hidden block"
              >
                {/* Foto de fondo */}
                <img
                  src={`https://acdn-us.mitiendanube.com/stores/006/445/993/products/${cat.img}-480-0.webp`}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${
                  cat.accent
                    ? 'bg-black/50 group-hover:bg-black/40'
                    : 'bg-black/30 group-hover:bg-black/50'
                }`} />

                <span className="relative text-[8px] tracking-[0.5em] font-light text-white/50">
                  {cat.num}
                </span>
                <div className="relative space-y-3">
                  <p className={`font-display text-2xl sm:text-3xl font-light leading-tight whitespace-pre-line text-white ${
                    cat.accent ? 'text-red-300' : ''
                  }`}>
                    {cat.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-px w-4 bg-white/50 transition-all duration-500 group-hover:w-6" />
                    <span className="text-[8px] tracking-[0.4em] uppercase text-white/60 transition-colors duration-500 group-hover:text-white/90">
                      Ver todo
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          DESTACADOS
      ══════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20 sm:pb-28">
          <div className="flex items-end justify-between mb-10 sm:mb-14" data-reveal>
            <div>
              <p className="text-[8px] tracking-[0.6em] uppercase text-gray-400 mb-2">Selección</p>
              <h2 className="font-display text-4xl sm:text-5xl font-light tracking-wide">Destacados</h2>
            </div>
            <Link
              href="/categoria/top-bodys"
              className="text-[10px] tracking-[0.25em] uppercase link-underline pb-0.5 hidden sm:block text-gray-500 hover:text-[#111] transition-colors"
            >
              Ver todo →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product, i) => (
              <div key={product.id} data-reveal style={{ transitionDelay: `${Math.min(i * 55, 280)}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          FRANJA CENTRAL
      ══════════════════════════════════ */}
      <div className="bg-[#111] text-white py-5 overflow-hidden" data-reveal="fade">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="text-[10px] tracking-[0.5em] uppercase px-10 font-light text-white/50">
              Nueva colección ·&nbsp;
            </span>
          ))}
        </div>
      </div>



    </div>
  )
}
