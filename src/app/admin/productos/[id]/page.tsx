import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import StockEditor from '@/components/admin/StockEditor'
import { Product, Category } from '@/types'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createAdminClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(*), variants:product_variants(*)')
      .eq('id', id)
      .single(),
    supabase.from('categories').select('*').order('order'),
  ])

  if (!product) notFound()

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <a
            href="/admin/productos"
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            ← Volver a productos
          </a>
          <h1 className="text-2xl font-bold mt-2">Editar producto</h1>
          <p className="text-sm text-gray-500 mt-1">{product.name}</p>
        </div>

        {/* Eliminar */}
        <DeleteProductButton productId={id} />
      </div>

      <ProductForm
        product={product as Product}
        categories={(categories as Category[]) ?? []}
      />

      {product.variants && product.variants.length > 0 && (
        <StockEditor variants={product.variants} productId={id} />
      )}
    </div>
  )
}
