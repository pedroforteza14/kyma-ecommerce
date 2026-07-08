import { createAdminClient } from '@/lib/supabase/server'
import { Product } from '@/types'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ProductsSearch from '@/components/admin/ProductsSearch'

export default async function ProductsAdminPage() {
  const supabase = await createAdminClient()

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .order('name', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products?.length ?? 0} productos en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 text-sm hover:bg-gray-900 transition-colors rounded-lg"
        >
          <Plus size={16} />
          Nuevo producto
        </Link>
      </div>

      <ProductsSearch products={(products ?? []) as Product[]} />
    </div>
  )
}
