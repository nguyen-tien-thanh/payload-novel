import { getPayload } from 'payload'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import type { Media, Category } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config: await config })
  const product = await payload.findByID({
    collection: 'products',
    id: Number(id),
    depth: 0,
  })
  if (!product) return {}
  return { title: product.name }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config: await config })

  const product = await payload.findByID({
    collection: 'products',
    id: Number(id),
    depth: 2,
  })

  if (!product || product._status !== 'published') notFound()

  const { docs: chapters } = await payload.find({
    collection: 'chapters',
    where: {
      and: [{ product: { equals: product.id } }, { _status: { equals: 'published' } }],
    },
    limit: 500,
    sort: 'chapterNumber',
    depth: 0,
    select: {
      chapterNumber: true,
      chapterName: true,
      price: true,
    },
  })

  const image = product.image as Media | null
  const categories = (product.categories ?? []) as Category[]

  return (
    <div className="product-detail">
      <Link href="/products" className="back-link">
        ← Danh sách truyện
      </Link>

      <div className="product-hero">
        {image?.url && (
          <div className="product-hero-cover">
            <Image
              src={image.url}
              alt={product.name}
              width={200}
              height={280}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
          </div>
        )}
        <div className="product-hero-info">
          <h1>{product.name}</h1>
          <p className="author">Tác giả: {product.authorName}</p>
          {product.source && <p className="source">Nguồn: {product.source}</p>}
          {categories.length > 0 && (
            <div className="categories">
              {categories.map((cat) => (
                <span key={cat.id} className="category-tag">
                  {cat.name}
                </span>
              ))}
            </div>
          )}
          <p className="views">{product.viewCount ?? 0} lượt xem</p>
          {product.doneAt && <p className="done">Hoàn thành</p>}
          {product.description && <p className="description">{product.description}</p>}
        </div>
      </div>

      <div className="chapter-list">
        <h2>Danh sách chương ({chapters.length})</h2>
        <ul>
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <Link href={`/products/${product.id}/chapters/${chapter.chapterNumber}`}>
                Chương {chapter.chapterNumber}: {chapter.chapterName}
                {chapter.price ? (
                  <span className="chapter-price"> ({chapter.price} xu)</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
