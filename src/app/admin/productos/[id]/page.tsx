import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import { deleteProduct } from '@/lib/actions/products'
import { Product, Category } from '@/types'
import { Trash2 } from 'lucide-react'

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
        <form
          action={async () => {
            'use server'
            await deleteProduct(id)
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-red-500 border border-red-200 px-4 py-2 hover:bg-red-50 transition-colors rounded"
            onClick={(e) => {
              if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) {
                e.preventDefault()
              }
            }}
          >
            <Trash2 size={14} />
            Eliminar
          </button>
        </form>
      </div>

      <ProductForm
        product={product as Product}
        categories={(categories as Category[]) ?? []}
      />
    </div>
  )
}
