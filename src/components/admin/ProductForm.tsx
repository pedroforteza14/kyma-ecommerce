'use client'

import { useState, useRef } from 'react'
import { saveProduct } from '@/lib/actions/products'
import { Product, Category } from '@/types'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  product?: Product
  categories: Category[]
}

const SIZE_GROUPS = [
  { label: 'Talles en letras', sizes: ['ÚNICO', 'XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { label: 'Talles en números (pantalones)', sizes: ['34', '36', '38', '40', '42', '44', '46'] },
]
const ALL_SIZES = SIZE_GROUPS.flatMap((g) => g.sizes)

export default function ProductForm({ product, categories }: Props) {
  const [sizeStocks, setSizeStocks] = useState<Record<string, number>>(
    Object.fromEntries(product?.variants?.map((v) => [v.size, v.stock]) ?? [])
  )
  const [extraCategoryIds, setExtraCategoryIds] = useState<string[]>(
    product?.extra_category_ids ?? []
  )
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const toggleSize = (size: string) => {
    setSizeStocks((prev) => {
      if (size in prev) {
        const next = { ...prev }
        delete next[size]
        return next
      }
      return { ...prev, [size]: 1 }
    })
  }

  const setStock = (size: string, value: number) => {
    setSizeStocks((prev) => ({ ...prev, [size]: Math.max(0, value) }))
  }

  const toggleExtraCategory = (id: string, primaryCategoryId: string) => {
    if (id === primaryCategoryId) return
    setExtraCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    setUploading(true)
    const uploaded: string[] = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage
        .from('products')
        .upload(path, file, { upsert: false })

      if (!error) {
        const { data } = supabase.storage.from('images').getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
    }

    setImages((prev) => [...prev, ...uploaded])
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (formData: FormData) => {
    setSaving(true)
    formData.set('images', images.join('\n'))
    formData.set('sizeStocks', JSON.stringify(sizeStocks))
    formData.set('extraCategoryIds', JSON.stringify(extraCategoryIds))
    if (product) formData.set('id', product.id)
    await saveProduct(formData)
  }

  const primaryCategoryId = product?.category_id ?? ''

  return (
    <form action={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Nombre */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide uppercase">
          Nombre del producto *
        </label>
        <input
          name="name"
          required
          defaultValue={product?.name}
          placeholder="Ej: Camisa lino oversize"
          className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors cursor-text caret-black"
        />
      </div>

      {/* Categoría principal */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide uppercase">
          Categoría principal *
        </label>
        <select
          name="category_id"
          required
          defaultValue={primaryCategoryId}
          onChange={(e) => {
            const newPrimary = e.target.value
            setExtraCategoryIds((prev) => prev.filter((id) => id !== newPrimary))
          }}
          className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
        >
          <option value="" disabled>Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Categorías adicionales */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-3 tracking-wide uppercase">
          Aparece también en
          <span className="ml-2 text-gray-400 normal-case font-normal">(opcional — el producto aparece en estas categorías además de la principal)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isPrimary = cat.id === primaryCategoryId
            const isChecked = extraCategoryIds.includes(cat.id)
            return (
              <button
                key={cat.id}
                type="button"
                disabled={isPrimary}
                onClick={() => toggleExtraCategory(cat.id, primaryCategoryId)}
                className={`px-3 py-1.5 text-xs border rounded-full transition-all ${
                  isPrimary
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : isChecked
                    ? 'bg-black text-white border-black'
                    : 'border-gray-300 text-gray-600 hover:border-black'
                }`}
              >
                {cat.name}
                {isPrimary && ' (principal)'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Precios */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide uppercase">
            Precio *
          </label>
          <input
            name="price"
            type="number"
            required
            min={0}
            defaultValue={product?.price}
            placeholder="25000"
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors cursor-text caret-black"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide uppercase">
            Precio original (para SALE)
          </label>
          <input
            name="original_price"
            type="number"
            min={0}
            defaultValue={product?.original_price ?? ''}
            placeholder="35000"
            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors cursor-text caret-black"
          />
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide uppercase">
          Descripción
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description ?? ''}
          placeholder="Describe el material, el fit, cómo combinarlo..."
          className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
        />
      </div>

      {/* Talles y stock */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-3 tracking-wide uppercase">
          Talles y stock
        </label>
        {SIZE_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 text-sm border transition-all ${
                    size in sizeStocks
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(sizeStocks).length > 0 && (
          <div className="space-y-2 mt-2 border-t pt-3">
            {ALL_SIZES.filter((s) => s in sizeStocks).map((size) => (
              <div key={size} className="flex items-center gap-3">
                <span className="w-16 text-sm font-medium text-gray-700">{size}</span>
                <input
                  type="number"
                  min={0}
                  value={sizeStocks[size]}
                  onChange={(e) => setStock(size, parseInt(e.target.value) || 0)}
                  className="w-24 border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-black"
                />
                <span className="text-xs text-gray-400">unidades</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Imágenes */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-3 tracking-wide uppercase">
          Imágenes
        </label>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {images.map((url, idx) => (
              <div key={idx} className="relative w-24 h-28 bg-gray-100 rounded overflow-hidden group">
                <Image src={url} alt={`Imagen ${idx + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-black text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-3 border-2 border-dashed border-gray-300 px-6 py-4 text-sm text-gray-500 hover:border-black hover:text-black transition-colors w-full justify-center"
        >
          {uploading ? (
            <><Loader2 size={16} className="animate-spin" />Subiendo...</>
          ) : (
            <><Upload size={16} />Subir imágenes</>
          )}
        </button>
        <p className="mt-2 text-xs text-gray-400">
          JPG, PNG, WEBP. La primera imagen es la principal.
        </p>
      </div>

      {/* Opciones */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            value="true"
            defaultChecked={product?.is_active ?? true}
            className="w-4 h-4"
          />
          <span className="text-sm">Producto activo (visible en la tienda)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_featured"
            value="true"
            defaultChecked={product?.is_featured ?? false}
            className="w-4 h-4"
          />
          <span className="text-sm">Destacado (aparece en la homepage)</span>
        </label>
      </div>

      {/* Botón */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-black text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-900 transition-colors disabled:bg-gray-400"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {product ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
        </button>
        <a
          href="/admin/productos"
          className="px-6 py-3 text-sm border border-gray-300 hover:border-black transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}
