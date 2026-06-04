const MAX_CHUNK_LENGTH = 280

export function buildArticleSpeechText(
  ...parts: (string | null | undefined)[]
): string {
  return parts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join('. ')
    .replace(/\.\s*\./g, '.')
}

export function splitSpeechChunks(text: string): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) return []
  if (normalized.length <= MAX_CHUNK_LENGTH) return [normalized]

  const sentences =
    normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [normalized]
  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    const part = sentence.trim()
    if (!part) continue

    const next = current ? `${current} ${part}` : part
    if (next.length <= MAX_CHUNK_LENGTH) {
      current = next
      continue
    }

    if (current) chunks.push(current)
    current = part.length <= MAX_CHUNK_LENGTH ? part : part.slice(0, MAX_CHUNK_LENGTH)
  }

  if (current) chunks.push(current)
  return chunks
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function pickEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  return (
    voices.find((v) => v.lang === 'en-US' && !v.localService) ??
    voices.find((v) => v.lang.startsWith('en')) ??
    voices[0] ??
    null
  )
}
