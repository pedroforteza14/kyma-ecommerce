import { createClient } from '@/lib/supabase/server'
import { Product } from '@/types'
import ProductCard from '@/components/store/ProductCard'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featured } = await supabase
    .from('products')
    .select('*, category:categories(*), variants:product_variants(*)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(8)

  const { data: sale } = await supabase
    .from('products')
    .select('*, category:categories(*), variants:product_variants(*)')
    .not('original_price', 'is', null)
    .eq('is_active', true)
    .limit(4)

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gray-100 h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="text-center z-10 space-y-4 px-4">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-widest uppercase">
            KYMA
          </h1>
          <p className="text-lg text-gray-600 tracking-widest">
            Nueva colección disponible
          </p>
          <Link
            href="/categoria/remeras-tops"
            className="inline-block mt-4 bg-black text-white px-10 py-4 text-sm tracking-widest hover:bg-gray-800 transition-colors"
          >
            VER COLECCIÓN
          </Link>
        </div>
      </section>

      {/* Categorías rápidas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Remeras & Tops', slug: 'remeras-tops', emoji: '👕' },
            { name: 'Denim', slug: 'denim-pantalones', emoji: '👖' },
            { name: 'Sweaters', slug: 'sweaters', emoji: '🧶' },
            { name: 'SALE', slug: 'sale', emoji: '🔥' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors"
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <p className="text-sm font-medium tracking-wide">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados */}
      {featured && featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-wide">Destacados</h2>
            <Link
              href="/categoria/remeras-tops"
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              Ver todo →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(featured as Product[]).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Sale */}
      {sale && sale.length > 0 && (
        <section className="bg-gray-50 py-16 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-red-500 tracking-wide">
                SALE 🔥
              </h2>
              <Link
                href="/categoria/sale"
                className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                Ver todo →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {(sale as Product[]).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
