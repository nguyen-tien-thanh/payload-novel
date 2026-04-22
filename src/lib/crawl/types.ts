import type { PayloadInstance } from './shared'

export type CrawlSourceKey = 'truyenfull' | 'jjwrc'

export type CrawlSourceAdapter = {
  key: CrawlSourceKey
  label: string
  urlPatterns: RegExp[]
  canHandle: (uri: string) => boolean
  crawl: (
    payload: PayloadInstance,
    userId: string | number,
    baseUri: string,
  ) => Promise<Response>
}
