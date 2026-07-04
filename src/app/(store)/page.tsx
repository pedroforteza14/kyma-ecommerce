import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import MobileLanding from '@/components/store/MobileLanding'

const CDN = 'https://acdn-us.mitiendanube.com/stores/006/445/993/products'

export default async function HomePage() {
  return (
    <div>

      {/* ── Mobile fullscreen landing (lg:hidden) ── */}
      <MobileLanding />

      {/* ══════════════════════════════════
          HERO — desktop only
      ══════════════════════════════════ */}
      <section className="hidden lg:flex relative h-screen min-h-[700px] items-end justify-start overflow-hidden">

        {/* Foto de fondo — full quality, positioned to show the face */}
        <img
          src="https://acdn-us.mitiendanube.com/stores/006/445/993/themes/uyuni/2-slide-1780435199759-8036263829-c3e7b37018d3027735c1919bdc3604491780435201-1024-1024.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-[center_18%]"
          fetchPriority="high"
          style={{ filter: 'contrast(1.04) brightness(0.96)' }}
        />

        {/* Overlay — ligero, preserva detalles de la foto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Contenido — abajo a la izquierda, más editorial */}
        <div className="relative px-12 pb-16 space-y-8 max-w-xl">
          <div className="space-y-3">
            <p className="text-[8px] tracking-[0.75em] uppercase text-white/50 animate-fade-up">
              Buenos Aires · Argentina
            </p>
            <h1
              className="font-display font-light leading-[0.98] text-white animate-fade-up-delay"
              style={{ fontSize: 'clamp(3.8rem, 6vw, 6rem)', letterSpacing: '0.06em' }}
            >
              Nueva<br />
              <em>colección</em>
            </h1>
          </div>

          <div className="animate-fade-up-delay-2 flex items-center gap-4">
            <Link
              href="/categoria/after-hours-collection"
              className="inline-flex items-center bg-white text-[#111] px-10 py-3.5 text-[10px] tracking-[0.4em] uppercase hover:bg-white/90 transition-colors duration-300"
            >
              Ver colección
            </Link>
            <Link
              href="/categoria/sale"
              className="text-[10px] tracking-[0.4em] uppercase text-white/70 hover:text-white transition-colors border-b border-white/30 hover:border-white pb-0.5"
            >
              Sale →
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-9 right-12 flex flex-col items-center gap-2.5 animate-fade-up-delay-3">
          <div className="w-px h-12 bg-white/30 animate-scroll-pulse" />
          <span className="text-[7px] tracking-[0.55em] uppercase text-white/40">Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════
          STRIP DE VALORES
      ══════════════════════════════════ */}
      <div className="hidden lg:block border-y border-[#ece9e3] bg-white overflow-hidden" data-reveal="fade">
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
      <section className="hidden lg:block max-w-7xl mx-auto px-8 py-24">
        <div className="flex items-end justify-between mb-12" data-reveal>
          <div>
            <p className="text-[8px] tracking-[0.6em] uppercase text-gray-400 mb-2">Explorar</p>
            <h2 className="font-display text-5xl font-light tracking-wide">Categorías</h2>
          </div>
          <span className="font-display text-7xl font-light text-[#ece9e3] select-none leading-none">02</span>
        </div>

        <div className="grid grid-cols-5 gap-3">
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
            <div key={cat.slug} data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
              <Link
                href={`/categoria/${cat.slug}`}
                className="group relative aspect-[4/5] flex flex-col justify-between p-5 overflow-hidden block"
              >
                <img
                  src={`${CDN}/${cat.img}-480-0.webp`}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className={`absolute inset-0 transition-opacity duration-500 ${
                  cat.accent ? 'bg-black/50 group-hover:bg-black/40' : 'bg-black/30 group-hover:bg-black/50'
                }`} />
                <span className="relative text-[8px] tracking-[0.5em] font-light text-white/50">{cat.num}</span>
                <div className="relative space-y-3">
                  <p className={`font-display text-2xl font-light leading-tight whitespace-pre-line text-white ${cat.accent ? 'text-red-300' : ''}`}>
                    {cat.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-px w-4 bg-white/50 transition-all duration-500 group-hover:w-6" />
                    <span className="text-[8px] tracking-[0.4em] uppercase text-white/60 transition-colors duration-500 group-hover:text-white/90">Ver todo</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          EDITORIAL — 2 paneles grandes
      ══════════════════════════════════ */}
      <section className="hidden lg:grid grid-cols-2 gap-3 px-8 pb-24 max-w-7xl mx-auto" data-reveal="fade">

        {/* Panel izquierdo — After Hours */}
        <Link href="/categoria/after-hours-collection" className="group relative aspect-[3/4] overflow-hidden block">
          <img
            src={`${CDN}/463-1decc8de474a2a990b17805017533579-1024-1024.webp`}
            alt="After Hours Collection"
            className="w-full h-full object-cover object-top transition-transform duration-[1200ms] group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
          <div className="absolute bottom-10 left-10 space-y-3">
            <p className="text-[9px] tracking-[0.6em] uppercase text-white/60">Colección</p>
            <p className="font-display text-4xl font-light text-white leading-none">After Hours</p>
            <div className="flex items-center gap-3 pt-1">
              <div className="h-px w-5 bg-white/60 transition-all duration-500 group-hover:w-8" />
              <span className="text-[9px] tracking-[0.4em] uppercase text-white/70">Explorar</span>
            </div>
          </div>
        </Link>

        {/* Panel derecho — dos paneles apilados */}
        <div className="flex flex-col gap-3">
          <Link href="/categoria/sweaters" className="group relative flex-1 overflow-hidden block">
            <img
              src={`${CDN}/422-b32c7dca32b85ae8f817805020614745-1024-1024.webp`}
              alt="Sweaters"
              className="w-full h-full object-cover object-top transition-transform duration-[1200ms] group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
            <div className="absolute bottom-8 left-8 space-y-2">
              <p className="text-[9px] tracking-[0.6em] uppercase text-white/60">Nueva llegada</p>
              <p className="font-display text-3xl font-light text-white">Sweaters</p>
            </div>
          </Link>
          <Link href="/categoria/accesorios" className="group relative flex-1 overflow-hidden block">
            <img
              src={`${CDN}/442-4de659f5b3ad49dcb017810169630971-1024-1024.webp`}
              alt="Accesorios"
              className="w-full h-full object-cover object-top transition-transform duration-[1200ms] group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
            <div className="absolute bottom-8 left-8 space-y-2">
              <p className="text-[9px] tracking-[0.6em] uppercase text-white/60">Completá el look</p>
              <p className="font-display text-3xl font-light text-white">Accesorios</p>
            </div>
          </Link>
        </div>

      </section>

      {/* ══════════════════════════════════
          FRANJA FINAL
      ══════════════════════════════════ */}
      <div className="hidden lg:block bg-[#111] text-white py-5 overflow-hidden" data-reveal="fade">
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
