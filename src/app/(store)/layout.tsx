import Navbar from '@/components/store/Navbar'
import CartDrawer from '@/components/store/CartDrawer'
import WhatsAppButton from '@/components/store/WhatsAppButton'
import CustomCursor from '@/components/store/CustomCursor'
import ScrollReveal from '@/components/store/ScrollReveal'
import Link from 'next/link'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Cursor y animaciones globales */}
      <CustomCursor />
      <ScrollReveal />

      <Navbar />
      <CartDrawer />
      <WhatsAppButton />
      <main className="flex-1">{children}</main>

      <footer className="bg-[#111] text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 sm:grid-cols-3 gap-12">
          <div className="space-y-5">
            <h3 className="font-display text-3xl font-light tracking-[0.3em]">KYMA</h3>
            <p className="text-gray-400 text-[12px] leading-relaxed tracking-wide">
              Moda femenina con identidad propia.<br />
              Buenos Aires, Argentina.
            </p>
            <a
              href="https://instagram.com/kymaba"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[10px] tracking-[0.3em] uppercase text-gray-500 hover:text-white transition-colors link-underline"
            >
              Instagram
            </a>
          </div>

          <div className="space-y-5">
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-gray-500">Ayuda</h4>
            <ul className="space-y-3 text-[12px] text-gray-400 tracking-wide">
              <li><Link href="/cambios" className="hover:text-white transition-colors link-underline">Cambios y devoluciones</Link></li>
              <li><Link href="/preguntas-frecuentes" className="hover:text-white transition-colors link-underline">Preguntas frecuentes</Link></li>
              <li><a href="https://wa.me/5491100000000" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors link-underline">WhatsApp</a></li>
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-gray-500">Contacto</h4>
            <ul className="space-y-3 text-[12px] text-gray-400 tracking-wide">
              <li>
                <a href="mailto:hola@kyma.com.ar" className="hover:text-white transition-colors link-underline">
                  hola@kyma.com.ar
                </a>
              </li>
            </ul>
            <div className="pt-4 border-t border-white/10">
              <p className="text-[10px] tracking-[0.2em] text-gray-600 uppercase">Medios de pago</p>
              <p className="text-[11px] text-gray-500 mt-2">Visa · Mastercard · MercadoPago · Transferencia</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] tracking-[0.2em] uppercase text-gray-600">
            © {new Date().getFullYear()} KYMA. Todos los derechos reservados.
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-gray-700">
            Buenos Aires · Argentina
          </p>
        </div>
      </footer>
    </>
  )
}
