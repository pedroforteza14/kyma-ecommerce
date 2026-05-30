import { Product } from '@/types'
import ProductCard from './ProductCard'

type Props = { products: Product[] }

export default function RelatedProducts({ products }: Props) {
  return (
    <section className="border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[9px] tracking-[0.5em] uppercase text-gray-400 mb-1">Descubrí más</p>
            <h2 className="font-display text-4xl font-light">También te puede gustar</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
          {products.map((product, i) => (
            <div key={product.id} data-reveal data-delay={i * 60}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
