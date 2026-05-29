import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Product } from '@/types'
import ProductCard from '@/components/store/ProductCard'
import CategoryFilters from '@/components/store/CategoryFilters'
import { Suspense } from 'react'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ orden?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('slug', slug)
    .single()
  if (!category) return { title: 'Categoría | KYMA' }
  return {
    title: `${category.name} | KYMA`,
    description: `Explorá nuestra colección de ${category.name}. Moda femenina con estilo.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { orden = 'newest' } = await searchParams
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  const isSale = slug === 'sale'

  let query = supabase
    .from('products')
    .select('*, category:categories(*), variants:product_variants(*)')
    .eq('is_active', true)

  // La categoría "sale" muestra todos los productos con descuento sin importar su categoría
  if (isSale) {
    query = query.not('original_price', 'is', null)
  } else {
    query = query.eq('category_id', category.id)
  }

  if (orden === 'price_asc')  query = query.order('price', { ascending: true })
  else if (orden === 'price_desc') query = query.order('price', { ascending: false })
  else if (orden === 'discount')   query = query.not('original_price', 'is', null).order('created_at', { ascending: false })
  else                             query = query.order('created_at', { ascending: false })

  const { data: products } = await query
  const total = products?.length ?? 0

  return (
    <div>
      {/* ══════ HEADER EDITORIAL ══════ */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {/* Breadcrumb */}
          <div className="py-4 flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-gray-400">
            <a href="/" className="hover:text-[#111] transition-colors">Inicio</a>
            <span>/</span>
            <span className={isSale ? 'text-red-500' : 'text-[#111]'}>{category.name}</span>
          </div>

          {/* Título + info */}
          <div className="pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1
                className={`font-display font-light leading-none ${isSale ? 'text-red-500' : ''}`}
                style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '0.06em' }}
              >
                {category.name}
              </h1>
              <p className="text-[11px] tracking-[0.25em] text-gray-400 mt-3 uppercase">
                {total} {total === 1 ? 'producto' : 'productos'}
              </p>
            </div>

            {/* Filtros */}
            <div className="pb-1">
              <Suspense fallback={null}>
                <CategoryFilters total={total} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ GRILLA DE PRODUCTOS ══════ */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        {total > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
            {(products as Product[]).map((product, i) => (
              <div key={product.id} data-reveal data-delay={Math.min(i * 50, 300)}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <span className="font-display text-8xl font-light text-gray-100 block mb-6">∅</span>
            <p className="font-display text-2xl font-light text-gray-400 italic">
              Sin productos todavía
            </p>
            <p className="text-[11px] tracking-[0.2em] uppercase text-gray-300 mt-3">
              Volvé pronto
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
