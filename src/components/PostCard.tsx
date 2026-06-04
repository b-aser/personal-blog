import Link from 'next/link'
import { formatRelativeDate } from '@/lib/format-relative-date'
import type { PostListItem } from '@/lib/posts'
import type { Media } from '@payload-types'

function isMedia(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

type Props = {
  post: PostListItem
}

export function PostCard({ post }: Props) {
  const date = formatRelativeDate(post.publishedAt)
  const image = isMedia(post.featuredImage) ? post.featuredImage : null

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
      {date && (
        <time
          dateTime={post.publishedAt ?? undefined}
          className="text-sm text-zinc-500 dark:text-zinc-400"
        >
          {date}
        </time>
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
        <p className="mt-3 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
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
