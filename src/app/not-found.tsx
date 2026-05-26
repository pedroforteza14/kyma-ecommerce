import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <p className="text-8xl font-bold tracking-widest text-gray-100">404</p>
        <h1 className="text-2xl font-bold -mt-4">Página no encontrada</h1>
        <p className="text-gray-500 max-w-sm mx-auto">
          La página que buscás no existe o fue movida. Seguí explorando nuestra colección.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-black text-white px-8 py-4 text-sm tracking-widest hover:bg-gray-900 transition-colors"
          >
            IR AL INICIO
          </Link>
          <Link
            href="/categoria/remeras-tops"
            className="border border-gray-300 px-8 py-4 text-sm tracking-widest hover:border-black transition-colors"
          >
            VER COLECCIÓN
          </Link>
        </div>
      </div>
    </div>
  )
}
