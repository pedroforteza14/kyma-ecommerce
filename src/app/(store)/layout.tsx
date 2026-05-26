import Navbar from '@/components/store/Navbar'
import CartDrawer from '@/components/store/CartDrawer'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <CartDrawer />
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
              <li>Cambios y devoluciones</li>
              <li>Guía de talles</li>
              <li>Preguntas frecuentes</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-widest mb-4">CONTACTO</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Instagram: @kymaba</li>
              <li>hola@kyma.com.ar</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}
