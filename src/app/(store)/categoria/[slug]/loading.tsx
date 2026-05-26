import ProductGridSkeleton from '@/components/store/ProductGridSkeleton'

export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 border-b pb-6 animate-pulse space-y-2">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  )
}
