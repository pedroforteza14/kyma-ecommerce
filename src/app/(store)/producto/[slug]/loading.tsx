export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 animate-pulse">
        {/* Imagen */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gray-200 rounded-sm" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-24 bg-gray-200 rounded-sm" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-16" />
            <div className="flex gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                <div key={s} className="w-12 h-10 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
          <div className="h-14 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}
