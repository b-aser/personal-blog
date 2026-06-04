const WORDS_PER_MINUTE = 200

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/** Walk Lexical / Payload rich text JSON and collect plain text. */
export function extractTextFromRichText(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value.map(extractTextFromRichText).filter(Boolean).join(' ')
  }
  if (typeof value === 'object') {
    const node = value as Record<string, unknown>
    const parts: string[] = []
    if (typeof node.text === 'string') parts.push(node.text)
    for (const key of Object.keys(node)) {
      if (key === 'text') continue
      const extracted = extractTextFromRichText(node[key])
      if (extracted) parts.push(extracted)
    }
    return parts.join(' ')
  }
  return ''
}

export function getReadingTimeMinutes(...textParts: (string | null | undefined)[]): number {
  const words = countWords(textParts.filter(Boolean).join(' '))
  if (words === 0) return 1
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`
}
