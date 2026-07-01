import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ProductDetail from '@/components/store/ProductDetail'
import RelatedProducts from '@/components/store/RelatedProducts'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('name, description, images, price')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) return { title: 'Producto no encontrado' }

  const description =
    product.description ??
    `Comprá ${product.name} en KYMA. Moda femenina con identidad propia. Envíos a todo el país.`

  const priceFormatted = new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(product.price)

  const image = product.images?.[0]
    ? { url: product.images[0], width: 800, height: 1067, alt: product.name }
    : undefined

  return {
    title: product.name,
    description,
    openGraph: {
      type:        'website',
      title:       `${product.name} — ${priceFormatted}`,
      description,
      images:      image ? [image] : [],
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${product.name} — ${priceFormatted}`,
      description,
      images:      image ? [image.url] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(*), variants:product_variants(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  // Productos relacionados de la misma categoría
  const { data: related } = await supabase
    .from('products')
    .select('*, category:categories(*), variants:product_variants(*)')
    .eq('category_id', product.category_id)
    .eq('is_active', true)
    .neq('id', product.id)
    .limit(4)

  return (
    <>
      <ProductDetail product={product} />
      {related && related.length > 0 && (
        <RelatedProducts products={related} />
      )}
    </>
  )
}
