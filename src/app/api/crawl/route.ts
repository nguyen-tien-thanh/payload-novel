import config from '@payload-config'
import {
  detectCrawlSourceAdapter,
  getCrawlSourceAdapterByKey,
} from '@/lib/crawl/registry'
import type { CrawlSourceKey } from '@/lib/crawl/types'
import { getPayload } from 'payload'

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user || (user as any).role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const uri: string = body.uri
  const source = body.source as CrawlSourceKey | undefined

  if (!uri || typeof uri !== 'string') {
    return Response.json({ error: 'uri là bắt buộc' }, { status: 400 })
  }

  const baseUri = uri.trim().replace(/\/$/, '')
  const adapter =
    (source ? getCrawlSourceAdapterByKey(source) : null) ??
    detectCrawlSourceAdapter(baseUri)

  if (!adapter) {
    return Response.json(
      { error: 'Không xác định được source crawl từ uri hoặc source truyền vào' },
      { status: 400 },
    )
  }

  return adapter.crawl(payload, user.id as any, baseUri)
}
