import { Skeleton } from '@heroui/react'

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10">
      <div className="pt-6 pb-3 space-y-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-56 rounded-full" />
      </div>

      <div className="sticky top-14 z-40 -mx-4 space-y-2.5 border-b border-divider bg-background/95 px-4 py-3 backdrop-blur-xl">
        <Skeleton className="h-9 w-full rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-full" />
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <Skeleton className="h-4 w-32 rounded-full" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-2/3 w-full rounded-xl" />
              <Skeleton className="h-3 w-full rounded-full" />
              <Skeleton className="h-3 w-2/3 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
