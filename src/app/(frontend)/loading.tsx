import { Skeleton } from '@heroui/react'

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10">
      <div className="py-6 space-y-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-64 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-2/3 w-full rounded-xl" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-2/3 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
