import Navbar from '@/components/store/Navbar'
import CartDrawer from '@/components/store/CartDrawer'
import WhatsAppButton from '@/components/store/WhatsAppButton'
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
      <WhatsAppButton />
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
                <a
                  href="https://wa.me/5491132587946"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.118 1.522 5.85L.057 23.428a.5.5 0 00.609.61l5.627-1.453A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.031-1.371l-.36-.214-3.733.963.992-3.641-.235-.374A9.869 9.869 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/>
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
                  <a href="mailto:hola@kyma.com.ar" className="text-[12px] text-white/40 hover:text-white transition-colors tracking-wide">
                    hola@kyma.com.ar
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/5491132587946" target="_blank" rel="noopener noreferrer" className="text-[12px] text-white/40 hover:text-white transition-colors tracking-wide">
                    WhatsApp
                  </a>
                </li>
              </ul>

              <div className="pt-4 space-y-3">
                <h4 className="text-[9px] tracking-[0.5em] uppercase text-white/30 font-light">Envío</h4>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  <p className="text-[12px] text-white/40">Gratis a todo el país</p>
                </div>
                <p className="text-[12px] text-white/40">Retiro en persona · Buenos Aires</p>
              </div>
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
