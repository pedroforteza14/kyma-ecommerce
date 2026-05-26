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

  // Construir query con ordenamiento
  let query = supabase
    .from('products')
    .select('*, category:categories(*), variants:product_variants(*)')
    .eq('category_id', category.id)
    .eq('is_active', true)

  if (orden === 'price_asc') query = query.order('price', { ascending: true })
  else if (orden === 'price_desc') query = query.order('price', { ascending: false })
  else if (orden === 'discount') query = query.not('original_price', 'is', null).order('created_at', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data: products } = await query

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold tracking-wide uppercase mb-6">
        {category.name}
      </h1>

      <Suspense fallback={null}>
        <CategoryFilters total={products?.length ?? 0} />
      </Suspense>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(products as Product[]).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg">No hay productos en esta categoría todavía.</p>
        </div>
      )}
    </div>
  )
}
