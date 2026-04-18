import type { Media, Product } from '@/payload-types'
import { Eye } from '@gravity-ui/icons'
import Image from 'next/image'
import Link from 'next/link'

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

export function ProductCard({ product }: { product: Product }) {
  const image = product.image as Media | null

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="flex flex-col gap-1.5">
        <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl bg-default-100 shadow-sm">
          {image?.url ? (
            <Image
              src={image.url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 16vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-default-300 text-xs">
              No image
            </div>
          )}
          {product.doneAt && (
            <div className="absolute inset-x-0 bottom-0 bg-success/90 py-1 text-center text-[10px] font-semibold tracking-wide text-white backdrop-blur-sm">
              HOÀN THÀNH
            </div>
          )}
        </div>

        <div className="space-y-0.5 px-0.5">
          <p className="line-clamp-2 text-xs font-semibold leading-snug text-foreground transition-all group-hover:text-primary sm:text-sm">
            {product.name}
          </p>
          <p className="truncate text-[11px] text-default-400">{product.authorName}</p>
          {(product.viewCount ?? 0) > 0 && (
            <div className="flex items-center gap-0.5 pt-0.5 text-[10px] text-default-400">
              <Eye className="h-2.5 w-2.5" />
              {fmt(product.viewCount ?? 0)}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
