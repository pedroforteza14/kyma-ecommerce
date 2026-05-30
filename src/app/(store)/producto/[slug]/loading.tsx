export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8">
      {/* Breadcrumb skeleton */}
      <div className="py-5">
        <div className="h-2.5 w-64 bg-gray-100 animate-pulse" />
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 xl:gap-20 pb-20">
        {/* Imagen */}
        <div className="space-y-3">
          <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="w-[72px] aspect-[3/4] bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-7 lg:pt-0">
          <div className="h-2.5 w-24 bg-gray-100 animate-pulse" />
          <div className="space-y-3">
            <div className="h-10 w-3/4 bg-gray-100 animate-pulse" />
            <div className="h-10 w-1/2 bg-gray-100 animate-pulse" />
          </div>
          <div className="h-8 w-32 bg-gray-100 animate-pulse" />
          <div className="border-t border-gray-100" />
          <div className="space-y-3">
            <div className="h-2.5 w-16 bg-gray-100 animate-pulse" />
            <div className="flex gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                <div key={s} className="w-12 h-11 bg-gray-100 animate-pulse" />
              ))}
            </div>
          </div>
          <div className="h-14 bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
