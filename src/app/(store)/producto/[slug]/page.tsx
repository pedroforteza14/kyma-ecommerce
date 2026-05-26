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

  if (!product) return { title: 'Producto no encontrado | KYMA' }

  return {
    title: `${product.name} | KYMA`,
    description:
      product.description ??
      `Comprá ${product.name} en KYMA. Moda femenina con estilo y personalidad.`,
    openGraph: {
      title: product.name,
      description: product.description ?? `${product.name} - KYMA`,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
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
