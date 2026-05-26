import { createAdminClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import { Category } from '@/types'

export default async function NewProductPage() {
  const supabase = await createAdminClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('order')

  return (
    <div>
      <div className="mb-8">
        <a href="/admin/productos" className="text-sm text-gray-500 hover:text-black transition-colors">
          ← Volver a productos
        </a>
        <h1 className="text-2xl font-bold mt-2">Nuevo producto</h1>
      </div>
      <ProductForm categories={(categories as Category[]) ?? []} />
    </div>
  )
}
