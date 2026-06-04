import { formatRelativeDate } from '@/lib/format-relative-date'
import type { PostListItem } from '@/lib/posts'
import type { User } from '@payload-types'

export type BlogSort =
  | 'latest'
  | 'oldest'
  | 'title-asc'
  | 'title-desc'
  | 'author-asc'
  | 'author-desc'

export const BLOG_SORT_OPTIONS: { value: BlogSort; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title-asc', label: 'Title (A–Z)' },
  { value: 'title-desc', label: 'Title (Z–A)' },
  { value: 'author-asc', label: 'Author (A–Z)' },
  { value: 'author-desc', label: 'Author (Z–A)' },
]

export function isBlogSort(value: string | null | undefined): value is BlogSort {
  return BLOG_SORT_OPTIONS.some((option) => option.value === value)
}

export function getAuthorNames(post: PostListItem): string[] {
  const authors = post.authors ?? []
  return authors
    .map((author) => {
      if (typeof author === 'object' && author !== null && 'name' in author) {
        return (author as User).name?.trim() ?? ''
      }
      return ''
    })
    .filter(Boolean)
}

export function getPrimaryAuthorName(post: PostListItem): string {
  return getAuthorNames(post)[0] ?? ''
}

function publishedAtMs(post: PostListItem): number {
  if (!post.publishedAt) return 0
  const ms = new Date(post.publishedAt).getTime()
  return Number.isNaN(ms) ? 0 : ms
}

export function getPostSearchText(post: PostListItem): string {
  const published = post.publishedAt
  const formattedDate = published
    ? new Date(published).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return [
    post.title,
    post.excerpt,
    post.tags,
    ...getAuthorNames(post),
    published,
    formattedDate,
    published ? formatRelativeDate(published) : '',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function filterPosts(posts: PostListItem[], query: string): PostListItem[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return posts
  return posts.filter((post) => getPostSearchText(post).includes(normalized))
}

export function sortPosts(posts: PostListItem[], sort: BlogSort): PostListItem[] {
  const sorted = [...posts]

  switch (sort) {
    case 'latest':
      return sorted.sort((a, b) => publishedAtMs(b) - publishedAtMs(a))
    case 'oldest':
      return sorted.sort((a, b) => publishedAtMs(a) - publishedAtMs(b))
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    case 'author-asc':
      return sorted.sort((a, b) =>
        getPrimaryAuthorName(a).localeCompare(getPrimaryAuthorName(b)),
      )
    case 'author-desc':
      return sorted.sort((a, b) =>
        getPrimaryAuthorName(b).localeCompare(getPrimaryAuthorName(a)),
      )
    default:
      return sorted
  }
}
