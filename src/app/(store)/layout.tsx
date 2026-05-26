import Navbar from '@/components/store/Navbar'
import CartDrawer from '@/components/store/CartDrawer'
import WhatsAppButton from '@/components/store/WhatsAppButton'
import Link from 'next/link'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />
      <main className="flex-1">{children}</main>
      <footer className="bg-black text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold tracking-widest mb-4">KYMA</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Moda femenina con identidad propia.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-widest mb-4">AYUDA</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/cambios" className="hover:text-white transition-colors">Cambios y devoluciones</Link></li>
              <li><Link href="/preguntas-frecuentes" className="hover:text-white transition-colors">Preguntas frecuentes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-widest mb-4">CONTACTO</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="https://instagram.com/kymaba" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Instagram: @kymaba
                </a>
              </li>
              <li>
                <a href="mailto:hola@kyma.com.ar" className="hover:text-white transition-colors">
                  hola@kyma.com.ar
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}
