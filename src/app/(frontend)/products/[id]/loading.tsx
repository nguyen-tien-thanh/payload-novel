import { Skeleton } from '@heroui/react'

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="mx-auto w-40 shrink-0 sm:mx-0 sm:w-48">
          <Skeleton className="aspect-2/3 w-full rounded-2xl" />
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-7 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-full" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
          <div className="mt-2 space-y-2">
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-4/5 rounded-full" />
          </div>
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Skeleton className="h-5 w-32 rounded-lg" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
