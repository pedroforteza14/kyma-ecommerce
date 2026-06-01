'use client'

import { Trash2 } from 'lucide-react'
import { deleteProduct } from '@/lib/actions/products'

type Props = { productId: string }

export default function DeleteProductButton({ productId }: Props) {
  const handleDelete = async () => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    await deleteProduct(productId)
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="flex items-center gap-2 text-sm text-red-500 border border-red-200 px-4 py-2 hover:bg-red-50 transition-colors rounded"
    >
      <Trash2 size={14} />
      Eliminar
    </button>
  )
}
