import { Skeleton } from '@heroui/react'

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-10">
      <div className="py-6 space-y-2">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-4 w-56 rounded-full" />
      </div>

      <Skeleton className="mb-6 h-10 w-full rounded-xl" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-content1 p-4 space-y-3">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4 rounded-full" />
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
