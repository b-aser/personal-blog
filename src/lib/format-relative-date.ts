function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function calendarDaysBetween(from: Date, to: Date): number {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime()
  return Math.floor(ms / (24 * 60 * 60 * 1000))
}

function formatExactDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Audience-friendly dates: Today → 1 day ago → … → a week ago → 2 weeks ago → exact date.
 */
export function formatRelativeDate(
  value: string | null | undefined,
  now: Date = new Date(),
): string | null {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  const daysAgo = calendarDaysBetween(date, now)

  if (daysAgo <= 0) return 'Today'
  if (daysAgo === 1) return '1 day ago'
  if (daysAgo < 7) return `${daysAgo} days ago`
  if (daysAgo < 14) return 'a week ago'
  if (daysAgo < 21) return '2 weeks ago'

  return formatExactDate(date)
}

export function wasUpdatedAfterPublish(
  publishedAt: string | null | undefined,
  updatedAt: string | null | undefined,
): boolean {
  if (!publishedAt || !updatedAt) return false
  const published = new Date(publishedAt).getTime()
  const updated = new Date(updatedAt).getTime()
  if (Number.isNaN(published) || Number.isNaN(updated)) return false
  return updated - published > 60_000
}
