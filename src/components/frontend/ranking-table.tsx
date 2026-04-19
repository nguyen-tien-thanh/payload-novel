import type { Media, Product } from '@/payload-types'
import { Eye } from '@gravity-ui/icons'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeader } from './section-header'

function fmt(n: number): string {
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

interface Props {
  title: string
  products: Product[]
  badge?: string
}

export function RankingTable({ title, products, badge }: Props) {
  if (!products.length) return null

  return (
    <section>
      <SectionHeader
        title={`${badge ?? ''} ${title}`.trim()}
        href="/products"
      />
      <div className="overflow-hidden rounded-2xl border border-divider bg-content1">
        {products.slice(0, 10).map((p, i) => {
          const image = p.image as Media | null
          return (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group flex items-center gap-3 border-b border-divider px-4 py-3 transition-all last:border-0 hover:bg-content2"
            >
              <span
                className={[
                  'w-6 shrink-0 text-center text-sm font-black',
                  i === 0
                    ? 'text-warning'
                    : i === 1
                      ? 'text-default-400'
                      : i === 2
                        ? 'text-warning-600'
                        : 'text-default-300',
                ].join(' ')}
              >
                {i + 1}
              </span>

              <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md bg-default-100">
                {image?.url && (
                  <Image
                    src={image.url}
                    alt={p.name}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-semibold text-foreground transition-all group-hover:text-primary">
                  {p.name}
                </p>
                <p className="mt-0.5 text-[11px] text-default-400">
                  {p.authorName}
                </p>
              </div>

              {(p.viewCount ?? 0) > 0 && (
                <div className="flex items-center gap-1">
                  <span className="shrink-0 text-[11px] tabular-nums text-default-400">
                    {fmt(p.viewCount ?? 0)}
                  </span>
                  <Eye className="size-3 text-default-400" />
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
