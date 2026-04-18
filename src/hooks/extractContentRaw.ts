import type { CollectionBeforeChangeHook } from 'payload'

const extractTextFromLexical = (node: any): string => {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''
  if (Array.isArray(node.children)) {
    return node.children.map(extractTextFromLexical).join(' ')
  }
  if (node.root) return extractTextFromLexical(node.root)
  return ''
}

export const extractContentRaw: CollectionBeforeChangeHook = ({ data }) => {
  if (data.contentHtml) {
    data.contentRaw = extractTextFromLexical(data.contentHtml).replace(/\s+/g, ' ').trim()
  }
  return data
}
