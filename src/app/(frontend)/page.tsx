import { PostCard } from '@/components/PostCard'
import { getPublishedPosts } from '@/lib/posts'

export default async function Home() {
  const posts = await getPublishedPosts()

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight">Writing</h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
            Posts are managed in{' '}
            <a href="/admin" className="font-medium underline-offset-4 hover:underline">
              Payload CMS
            </a>
            . This page is your custom frontend.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
            <p className="text-zinc-600 dark:text-zinc-400">No published posts yet.</p>
            <p className="mt-2 text-sm text-zinc-500">
              Create a post in{' '}
              <a href="/admin" className="font-medium underline-offset-4 hover:underline">
                /admin
              </a>
              , set status to Published, and refresh.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
    </main>
  )
}
