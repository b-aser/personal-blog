import { PostCard } from '@/components/PostCard'
import { getPublishedPosts } from '@/lib/posts'
import { ExternalLinkIcon } from 'lucide-react'

export default async function Home() {
  const posts = await getPublishedPosts()

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
        {/* something about me like intro to the blog*/}
        <div className="rounded-lg border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-400">
            Welcome to my blog! I'm <span className="font-bold">Aser</span>, a software engineer and founder. I'm passionate about building products that help people live better lives.
          </p>
          
          
          <p className="mt-2 text-sm text-zinc-500">
            Feel free to check out my website at <a href="https://aser.qendil.dev" target="_blank" rel="noopener noreferrer" className="font-bold underline-offset-4 hover:underline gap-1">aser.qendil.com <ExternalLinkIcon className="size-4 inline-block align-middle" /></a>
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
