'use client'

import type { Product } from '@/payload-types'
import { ArrowRight } from '@gravity-ui/icons'
import Link from 'next/link'
import { FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ProductCard } from './product-card'
import { SectionHeader } from './section-header'

interface Props {
  title: string
  products: Product[]
  href?: string
  showRank?: boolean
}

export function BookshelfRow({ title, products, href, showRank = false }: Props) {
  if (!products.length) return null

  return (
    <section>
      <SectionHeader title={title} href={href} />
      <div className="-mx-4">
        <Swiper
          modules={[FreeMode]}
          freeMode
          slidesPerView="auto"
          spaceBetween={12}
          className="px-4!"
        >
          {products.map((p, i) => (
            <SwiperSlide key={p.id} className="w-27.5! sm:w-35!">
              <div className="relative">
                {showRank && (
                  <div
                    className={[
                      'absolute -left-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold shadow',
                      i === 0
                        ? 'bg-warning text-warning-foreground'
                        : i === 1
                          ? 'bg-default-400 text-default-foreground'
                          : i === 2
                            ? 'bg-warning-600 text-white'
                            : 'bg-default-300 text-default-foreground',
                    ].join(' ')}
                  >
                    {i + 1}
                  </div>
                )}
                <ProductCard product={p} />
              </div>
            </SwiperSlide>
          ))}

          {href && (
            <SwiperSlide className="w-27.5! sm:w-35! group">
              <Link
                href={href}
                className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-default-200 text-default-400 transition-all duration-300 group-hover:border-primary group-hover:text-primary group-hover:border-solid aspect-2/3 "
              >
                <ArrowRight className="h-6 w-6 group-hover:scale-105 transition-all" />
                <span className="text-center text-xs font-medium leading-tight group-hover:scale-105 transition-all">
                  Xem tất cả
                </span>
              </Link>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </section>
  )
}
