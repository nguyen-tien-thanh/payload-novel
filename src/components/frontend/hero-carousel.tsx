'use client'

import type { Media, Product } from '@/payload-types'
import { ChevronLeft, ChevronRight, Eye } from '@gravity-ui/icons'
import { Button } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface Props {
  products: Product[]
}

export function HeroCarousel({ products }: Props) {
  if (!products.length) return null

  return (
    <div className="hero-carousel relative w-full overflow-hidden rounded-2xl">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        navigation={{ nextEl: '.hero-next', prevEl: '.hero-prev' }}
        slidesPerView={2}
        spaceBetween={12}
        breakpoints={{
          1024: { slidesPerView: 3, spaceBetween: 16 },
        }}
        loop
        className="h-70 sm:h-90 lg:h-105"
      >
        {products.map((product) => {
          const image = product.image as Media | null
          return (
            <SwiperSlide key={product.id} className="group">
              <Link href={`/products/${product.id}`}>
                <div className="relative h-full w-full overflow-hidden">
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt={product.name}
                      fill
                      // sizes="100vw"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-all duration-300"
                      priority
                      loading="eager"
                    />
                  ) : (
                    <div className="h-full w-full bg-default-200" />
                  )}
                  <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute inset-0 flex max-w-lg flex-col justify-end p-5">
                    <h2 className="mb-1.5 line-clamp-2 text-lg font-bold leading-tight text-white sm:text-lg lg:text-xl">
                      {product.name}
                    </h2>
                    <p className="mb-1 text-xs text-white/70 sm:text-sm">
                      {product.authorName}
                    </p>
                    {product.description && (
                      <p className="mb-4 hidden truncate text-xs text-white/60 sm:block sm:text-sm">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {(product.viewCount ?? 0) > 0 && (
                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-[11px] text-white/80 backdrop-blur-sm">
                      <Eye className="h-3 w-3" />
                      {product.viewCount?.toLocaleString('vi-VN')}
                    </div>
                  )}
                </div>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>

      {products.length > 1 && (
        <>
          <Button
            isIconOnly
            size="sm"
            className="hero-prev absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-foreground/40 text-background backdrop-blur-sm hover:bg-foreground/60"
            aria-label="Trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            className="hero-next absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-foreground/40 text-background backdrop-blur-sm hover:bg-foreground/60"
            aria-label="Tiếp"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}
