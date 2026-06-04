import type { Metadata } from 'next'
import { BlogPostList } from '@/components/BlogPostList'
import { isBlogSort } from '@/lib/blog-list'
import { getPublishedPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'All posts',
  description: 'Browse all published posts. Search by title, author, date, or tag.',
}

type Props = {
  searchParams: Promise<{ q?: string; sort?: string }>
}

export default async function BlogIndexPage({ searchParams }: Props) {
  const params = await searchParams
  const posts = await getPublishedPosts()
  const initialQuery = params.q?.trim() ?? ''
  const initialSort = isBlogSort(params.sort) ? params.sort : 'latest'

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">All posts</h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
          Search and sort every published article on the blog.
        </p>
      </div>

      <BlogPostList
        posts={posts}
        initialQuery={initialQuery}
        initialSort={initialSort}
      />
    </main>
  )
}
