import { createAdminClient } from '@/lib/supabase/server'
import { Product } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, ExternalLink } from 'lucide-react'

export default async function ProductsAdminPage() {
  const supabase = await createAdminClient()

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false })

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 text-sm hover:bg-gray-900 transition-colors rounded-lg"
        >
          <Plus size={16} />
          Nuevo producto
        </Link>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Producto', 'Categoría', 'Precio', 'Estado', 'Acciones'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 tracking-wide uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products?.map((product: Product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-500">
                  {product.category?.name ?? '—'}
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold">{formatPrice(product.price)}</p>
                  {product.original_price && (
                    <p className="text-xs text-gray-400 line-through">
                      {formatPrice(product.original_price)}
                    </p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {product.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      <Pencil size={12} />
                      Editar
                    </Link>
                    <Link
                      href={`/producto/${product.slug}`}
                      target="_blank"
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 hover:underline"
                    >
                      <ExternalLink size={12} />
                      Ver en tienda
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  No hay productos. Creá el primero.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
