import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Product } from '@/types'
import ProductCard from '@/components/store/ProductCard'
import CategoryFilters from '@/components/store/CategoryFilters'
import { Suspense } from 'react'

const CDN = 'https://acdn-us.mitiendanube.com/stores/006/445/993/products'
const CATEGORY_PHOTOS: Record<string, string> = {
  'after-hours-collection': '454-e15f74a90f59ebb06d17805022986320',
  'top-bodys':              '46-99a58451ecabe775ee17596104957657',
  'remeras':                '245-36efb0a285d388300617706587030915',
  'camisas-blusas':         '428-51ca91c661c4002c7417805019665068',
  'sweaters':               '422-b32c7dca32b85ae8f817805020614745',
  'jackets-blazers':        '414-2bc1fa028a2ca6736a17810179062988',
  'pantalones':             '332-41fc179214ee1c7f6317563176290037',
  'polleras-shorts':        '317-46a13e092080569e5c17730717836463',
  'accesorios':             '442-4de659f5b3ad49dcb017810169630971',
  'sale':                   '469-32727c377e70bc535917805013942218',
}

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
    query = query.or(`category_id.eq.${category.id},extra_category_ids.cs.{${category.id}}`)
  }

  if (orden === 'price_asc')  query = query.order('price', { ascending: true })
  else if (orden === 'price_desc') query = query.order('price', { ascending: false })
  else if (orden === 'discount')   query = query.not('original_price', 'is', null).order('created_at', { ascending: false })
  else                             query = query.order('created_at', { ascending: false })

  const { data: rawProducts } = await query

  // Out-of-stock products always go to the end, preserving existing sort within each group
  const products = rawProducts
    ? [...rawProducts].sort((a, b) => {
        const stockA = a.variants?.reduce((s: number, v: { stock: number }) => s + v.stock, 0) ?? 0
        const stockB = b.variants?.reduce((s: number, v: { stock: number }) => s + v.stock, 0) ?? 0
        if (stockA === 0 && stockB > 0) return 1
        if (stockB === 0 && stockA > 0) return -1
        return 0
      })
    : []

  const total = products.length

  const photo = CATEGORY_PHOTOS[slug]

  return (
    <div>
      {/* ══════ BANNER EDITORIAL ══════ */}
      <div className="relative h-[38vh] min-h-[260px] max-h-[420px] overflow-hidden bg-[#111]">
        {photo && (
          <>
            <img
              src={`${CDN}/${photo}-1024-1024.webp`}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover object-top opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          </>
        )}

        <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-5 sm:px-8 pb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[9px] tracking-[0.35em] uppercase text-white/40 mb-4">
            <a href="/" className="hover:text-white/70 transition-colors">Inicio</a>
            <span>/</span>
            <span className="text-white/60">{category.name}</span>
          </div>

          <h1
            className={`font-light leading-none text-white ${isSale ? 'text-red-400' : ''}`}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '0.05em' }}
          >
            {category.name}
          </h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mt-3">
            Buenos Aires · Argentina
          </p>
        </div>
      </div>

      {/* ══════ FILTROS ══════ */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Suspense fallback={null}>
          <CategoryFilters total={total} />
        </Suspense>
      </div>

      {/* ══════ GRILLA ══════ */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {total > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(products as Product[]).map((product, i) => (
              <div key={product.id} data-reveal style={{ transitionDelay: `${Math.min(i * 50, 300)}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <span className="text-8xl font-light text-gray-100 block mb-6">∅</span>
            <p className="text-2xl font-light text-gray-400 italic">Sin productos todavía</p>
            <p className="text-[11px] tracking-[0.2em] uppercase text-gray-300 mt-3">Volvé pronto</p>
          </div>
        )}
      </div>
    </div>
  )
}
