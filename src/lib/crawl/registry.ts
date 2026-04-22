import type { CrawlSourceAdapter, CrawlSourceKey } from './types'
import { jjwrcAdapter } from './jjwrc'
import { truyenfullAdapter } from './truyenfull'

const crawlSourceAdapters = [truyenfullAdapter, jjwrcAdapter] satisfies CrawlSourceAdapter[]

export function listCrawlSourceAdapters(): CrawlSourceAdapter[] {
  return crawlSourceAdapters
}

export function getCrawlSourceAdapterByKey(
  source: CrawlSourceKey,
): CrawlSourceAdapter | null {
  return crawlSourceAdapters.find((adapter) => adapter.key === source) ?? null
}

export function detectCrawlSourceAdapter(uri: string): CrawlSourceAdapter | null {
  return crawlSourceAdapters.find((adapter) => adapter.canHandle(uri)) ?? null
}
