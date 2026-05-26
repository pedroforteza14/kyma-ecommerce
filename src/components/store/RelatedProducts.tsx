import { Product } from '@/types'
import ProductCard from './ProductCard'

type Props = {
  products: Product[]
}

export default function RelatedProducts({ products }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t">
      <h2 className="text-xl font-bold tracking-wide mb-8">También te puede gustar</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
