'use client'

import { PostCard } from '@/components/PostCard'
import {
  BLOG_SORT_OPTIONS,
  filterPosts,
  isBlogSort,
  sortPosts,
  type BlogSort,
} from '@/lib/blog-list'
import type { PostListItem } from '@/lib/posts'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  posts: PostListItem[]
  initialQuery?: string
  initialSort?: BlogSort
}

export function BlogPostList({
  posts,
  initialQuery = '',
  initialSort = 'latest',
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery)
  const [sort, setSort] = useState<BlogSort>(initialSort)

  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (sort !== 'latest') params.set('sort', sort)
    const next = params.toString()
    const current =
      typeof window !== 'undefined' ? window.location.search.slice(1) : ''
    if (next === current) return
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
  }, [query, sort, router, pathname])

  const visiblePosts = useMemo(() => {
    return sortPosts(filterPosts(posts, query), sort)
  }, [posts, query, sort])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <label className="block flex-1">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Search
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title, author, date, or tag…"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        <label className="block sm:w-52">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Sort by
          </span>
          <select
            value={sort}
            onChange={(event) => {
              const value = event.target.value
              if (isBlogSort(value)) setSort(value)
            }}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            {BLOG_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {visiblePosts.length === posts.length
          ? `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`
          : `${visiblePosts.length} of ${posts.length} posts`}
      </p>

      {visiblePosts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-400">
            No posts match your search.
          </p>
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-3 text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} showMeta />
          ))}
        </div>
      )}
    </div>
  )
}
