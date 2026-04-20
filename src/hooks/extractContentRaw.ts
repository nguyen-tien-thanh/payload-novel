import type { CollectionBeforeChangeHook } from 'payload'

const extractTextFromLexical = (node: any): string => {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''
  if (node.type === 'paragraph') {
    const text = Array.isArray(node.children)
      ? node.children.map(extractTextFromLexical).join('')
      : ''
    return text.trim() ? `${text.trim()}\n\n` : ''
  }
  if (Array.isArray(node.children)) {
    return node.children.map(extractTextFromLexical).join('')
  }
  if (node.root) return extractTextFromLexical(node.root)
  return ''
}

export const extractContentRaw: CollectionBeforeChangeHook = ({ data }) => {
  if (data.contentHtml) {
    data.contentRaw = extractTextFromLexical(data.contentHtml)
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }
  return data
}
