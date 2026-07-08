import Navbar from '@/components/store/Navbar'
import CartDrawer from '@/components/store/CartDrawer'
import ScrollReveal from '@/components/store/ScrollReveal'
import MetaPixel from '@/components/store/MetaPixel'
import GoogleAnalytics from '@/components/store/GoogleAnalytics'
import Link from 'next/link'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Tracking y animaciones globales */}
      <MetaPixel />
      <GoogleAnalytics />
      <ScrollReveal />

      <Navbar />
      <CartDrawer />
      <main className="flex-1">{children}</main>

      <footer className="bg-[#0e0e0e] text-white">

        {/* Cuerpo principal */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

            {/* Marca */}
            <div className="sm:col-span-2 lg:col-span-1 space-y-6">
              <p className="text-[11px] tracking-[0.5em] uppercase font-light text-white/80">KYMA</p>
              <p className="text-[12px] text-white/40 leading-relaxed max-w-[220px]">
                Moda femenina con identidad propia. Diseñado y pensado en Buenos Aires.
              </p>
              <div className="flex items-center gap-4 pt-1">
                <a
                  href="https://instagram.com/kymaba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Categorías */}
            <div className="space-y-5">
              <h4 className="text-[9px] tracking-[0.5em] uppercase text-white/30 font-light">Categorías</h4>
              <ul className="space-y-3">
                {[
                  { label: 'After Hours Collection', href: '/categoria/after-hours-collection' },
                  { label: 'Tops / Bodys',           href: '/categoria/top-bodys'              },
                  { label: 'Remeras',                href: '/categoria/remeras'                },
                  { label: 'Camisas / Blusas',       href: '/categoria/camisas-blusas'         },
                  { label: 'Sweaters',               href: '/categoria/sweaters'               },
                  { label: 'Jackets | Blazers',      href: '/categoria/jackets-blazers'        },
                  { label: 'Pantalones',             href: '/categoria/pantalones'             },
                  { label: 'Faldas / Shorts',        href: '/categoria/polleras-shorts'        },
                  { label: 'Accesorios',             href: '/categoria/accesorios'             },
                  { label: 'Sale',                   href: '/categoria/sale'                   },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[12px] text-white/40 hover:text-white transition-colors tracking-wide">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Información */}
            <div className="space-y-5">
              <h4 className="text-[9px] tracking-[0.5em] uppercase text-white/30 font-light">Información</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
                  { label: 'Cambios y devoluciones', href: '/cambios' },
                  { label: 'Política de privacidad', href: '/politica-de-privacidad' },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[12px] text-white/40 hover:text-white transition-colors tracking-wide">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto & Envío */}
            <div className="space-y-5">
              <h4 className="text-[9px] tracking-[0.5em] uppercase text-white/30 font-light">Contacto</h4>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:infokyma.ba@gmail.com" className="text-[12px] text-white/40 hover:text-white transition-colors tracking-wide">
                    infokyma.ba@gmail.com
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Medios de pago */}
        <div className="border-t border-white/[0.06] max-w-7xl mx-auto px-5 sm:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="text-[9px] tracking-[0.4em] uppercase text-white/20 flex-shrink-0">Medios de pago</p>
            <div className="flex flex-wrap gap-2">
              {['Visa', 'Mastercard', 'MercadoPago', 'Transferencia'].map(mp => (
                <span key={mp} className="text-[10px] text-white/30 border border-white/10 px-2.5 py-1 tracking-wide">
                  {mp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/[0.06] px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <p className="text-[9px] tracking-[0.3em] uppercase text-white/20">
            © {new Date().getFullYear()} KYMA. Todos los derechos reservados.
          </p>
          <p className="text-[9px] tracking-[0.3em] uppercase text-white/20">
            Buenos Aires · Argentina
          </p>
        </div>

      </footer>
    </>
  )
}
