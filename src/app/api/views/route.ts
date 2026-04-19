import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

export async function POST(req: Request) {
  const { productId } = await req.json()
  if (!productId)
    return Response.json({ error: 'productId required' }, { status: 400 })

  const payload = await getPayload({ config })
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown'

  const me = await payload.auth({ headers: headersList })
  const userId = me.user?.id

  // Check duplicate: same user or same IP
  const existing = await payload.find({
    collection: 'views',
    where: userId
      ? {
          and: [
            { product: { equals: productId } },
            { createdBy: { equals: userId } },
          ],
        }
      : { and: [{ product: { equals: productId } }, { ip: { equals: ip } }] },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) return Response.json({ ok: true, new: false })

  await payload.create({
    collection: 'views',
    data: { product: productId, ip, ...(userId ? { createdBy: userId } : {}) },
    overrideAccess: true,
  })

  await payload.db.drizzle.execute(
    `UPDATE products SET view_count = COALESCE(view_count, 0) + 1 WHERE id = ${Number(productId)}`,
  )
  await payload.db.drizzle.execute(
    `UPDATE _products_v SET view_count = COALESCE(view_count, 0) + 1 WHERE parent_id = ${Number(productId)} AND version__status = 'published'`,
  )

  return Response.json({ ok: true, new: true })
}
