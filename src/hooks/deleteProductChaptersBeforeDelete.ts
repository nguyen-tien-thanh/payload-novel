import type { CollectionBeforeDeleteHook } from 'payload'

export const deleteProductChaptersBeforeDelete: CollectionBeforeDeleteHook =
  async ({ id, req }) => {
    const isForceDelete =
      req.query?.trash === 'true' || req.query?.trash === true

    if (!isForceDelete) return

    let page = 1

    while (true) {
      const chapters = await req.payload.find({
        collection: 'chapters',
        where: { product: { equals: Number(id) } },
        limit: 100,
        page,
        overrideAccess: true,
        trash: true,
      })

      if (chapters.docs.length === 0) break

      for (const chapter of chapters.docs) {
        await req.payload.delete({
          collection: 'chapters',
          id: chapter.id,
          overrideAccess: true,
          trash: true,
        })
      }

      if (page >= chapters.totalPages) break
      page++
    }
  }
