import Link from 'next/link'
import { getAuthorNames } from '@/lib/blog-list'
import { formatRelativeDate } from '@/lib/format-relative-date'
import type { PostListItem } from '@/lib/posts'
import type { Media } from '@payload-types'

function isMedia(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

type Props = {
  post: PostListItem
  showMeta?: boolean
}

export function PostCard({ post, showMeta = false }: Props) {
  const date = formatRelativeDate(post.publishedAt)
  const image = isMedia(post.featuredImage) ? post.featuredImage : null
  const authors = getAuthorNames(post)

  return (
    <article className="group border-b border-zinc-200 pb-10 dark:border-zinc-800">
      {image?.url && (
        <div className="mb-5 aspect-[2/1] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={image.alt ?? post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.2]"
          />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
        {showMeta && authors.length > 0 && (
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {authors.join(', ')}
          </span>
        )}
        {showMeta && authors.length > 0 && date && <span aria-hidden>·</span>}
        {date && (
          <time dateTime={post.publishedAt ?? undefined}>{date}</time>
        )}
      </div>
      {showMeta && post.tags && (
        post.tags.split(',').map((tag) => (
          <span key={tag} className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 rounded-full px-2 py-1">{tag}</span>
        ))
      )}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        <Link
          href={`/blog/${post.slug}`}
          className="text-zinc-900 hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
        >
          {post.title}
        </Link>
      </h2>
      {post.excerpt && (
        <p className="mt-3 text-md leading-relaxed text-zinc-600 dark:text-zinc-400">
          {post.excerpt}
        </p>
      )}
      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 inline-block text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
      >
        Read more →
      </Link>
    </article>
  )
}
