export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="aspect-2/3 w-full animate-pulse rounded-xl bg-content2" />
          <div className="h-3 w-full animate-pulse rounded-full bg-content2" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-content2" />
        </div>
      ))}
    </div>
  )
}
