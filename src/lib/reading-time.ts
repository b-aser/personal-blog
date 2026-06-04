const WORDS_PER_MINUTE = 200

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

const LEXICAL_BLOCK_TYPES = new Set([
  'paragraph',
  'heading',
  'quote',
  'list',
  'listitem',
  'code',
])

function joinLexicalParts(parts: string[], separator: string): string {
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(separator)
}

/** Collect visible text from Payload Lexical JSON (ignores type, root, version, etc.). */
export function extractTextFromRichText(value: unknown): string {
  if (value == null) return ''

  if (typeof value === 'object' && !Array.isArray(value) && 'root' in value) {
    return extractTextFromRichText((value as { root: unknown }).root)
  }

  if (Array.isArray(value)) {
    return joinLexicalParts(
      value.map((child) => extractTextFromRichText(child)),
      ' ',
    )
  }

  if (typeof value !== 'object') return ''

  const node = value as Record<string, unknown>

  if (typeof node.text === 'string') {
    return node.text
  }

  if (Array.isArray(node.children)) {
    const blockSeparator =
      typeof node.type === 'string' && LEXICAL_BLOCK_TYPES.has(node.type)
        ? '. '
        : ' '

    return joinLexicalParts(
      node.children.map((child) => extractTextFromRichText(child)),
      blockSeparator,
    )
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
