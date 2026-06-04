import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CommentForm } from '@/components/CommentForm'
import { CommentList } from '@/components/CommentList'
import { PostActionBar } from '@/components/PostActionBar'
import { RichText } from '@/components/RichText'
import { SiteHeader } from '@/components/SiteHeader'
import { getApprovedCommentsForPost, getPostBySlug } from '@/lib/posts'
import {
  formatRelativeDate,
  wasUpdatedAfterPublish,
} from '@/lib/format-relative-date'
import { buildArticleSpeechText } from '@/lib/article-speech'
import {
  extractTextFromRichText,
  formatReadingTime,
  getReadingTimeMinutes,
} from '@/lib/reading-time'
import type { Media } from '@payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Props = {
  params: Promise<{ slug: string }>
}

function isMedia(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Not found' }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const comments = await getApprovedCommentsForPost(post.id)
  const image = isMedia(post.featuredImage) ? post.featuredImage : null
  const date = formatRelativeDate(post.publishedAt)
  const updatedAt = formatRelativeDate(post.updatedAt)
  const showUpdated = wasUpdatedAfterPublish(post.publishedAt, post.updatedAt)
  const author = post.authors?.[0]
  const authorAvatar =
    author && typeof author === 'object' && 'avatar' in author && isMedia(author.avatar)
      ? author.avatar
      : null
  const articleBodyText = extractTextFromRichText(post.content)
  const readingTime = formatReadingTime(
    getReadingTimeMinutes(post.title, post.excerpt, articleBodyText),
  )
  const articleSpeechText = buildArticleSpeechText(
    post.title,
    typeof author === 'object' && author?.name ? `By ${author.name}` : null,
    post.excerpt,
    articleBodyText,
  )

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
        >
          ← All posts
        </Link>

        <article className="mt-8">


         
          <h1 className="my-2 font-serif text-4xl font-semibold tracking-tight">{post.title}</h1>
          {post.excerpt && (
            <p className="text-lg leading-relaxed text-muted-foreground italic">{post.excerpt}</p>
          )}

          <div className="my-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {authorAvatar?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={authorAvatar.url}
                alt={typeof author === 'object' && author?.name ? author.name : 'Author'}
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            {typeof author === 'object' && author?.name && (
              <span className="font-medium text-foreground">{author.name}</span>
            )}
            <span aria-hidden>·</span>
            <span >{readingTime}</span>
            {date && (
              <>
                <span aria-hidden>·</span>
                <time dateTime={post.publishedAt ?? undefined}>{date}</time>
              </>
            )}

            {showUpdated && updatedAt && (
              <>
                <span aria-hidden>·</span>
                <time dateTime={post.updatedAt ?? undefined}>Updated {updatedAt}</time>
              </>
            )}
          </div>

          <PostActionBar
            postId={post.id}
            postSlug={post.slug}
            likeCount={post.likes ?? 0}
            commentCount={comments.length}
            postTitle={post.title}
            articleSpeechText={articleSpeechText}
          />

          
          {image?.url && (
            <div className="mt-8 aspect-[2/1] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt ?? post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="mt-10 font-sans">
            <RichText data={post.content as SerializedEditorState} />
          </div>
        </article>

        <section
          id="comments"
          className="mt-16 border-t border-border pt-12 scroll-mt-8"
        >
          <h2 className="text-xl font-semibold">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h2>

          <CommentList
            comments={comments.map((c) => ({
              id: c.id,
              authorName: c.authorName,
              body: c.body,
            }))}
            postSlug={post.slug}
          />

          <div className="mt-10">
            <h3 className="text-lg font-medium">Leave a comment</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              You can delete your own comments from this browser after posting.
            </p>
            <div className="mt-6">
              <CommentForm postId={post.id} postSlug={post.slug} />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
