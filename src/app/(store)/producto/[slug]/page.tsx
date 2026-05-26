import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/store/ProductDetail'

type Props = {
  params: Promise<{ slug: string }>
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

  return <ProductDetail product={product} />
}
