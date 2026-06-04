import type { Comment, Media, Post } from '@payload-types'
import { getPayloadClient } from '@/lib/payload'

export type PostListItem = Pick<
  Post,
  'id' | 'title' | 'slug' | 'excerpt' | 'publishedAt' | 'status' | 'tags'
> & {
  featuredImage?: Media | string | null
  authors?: Post['authors']
}

export async function getPublishedPosts(): Promise<PostListItem[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 2,
    limit: 100,
  })
  return result.docs as PostListItem[]
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    depth: 2,
    limit: 1,
  })
  return (result.docs[0] as Post | undefined) ?? null
}

export async function getApprovedCommentsForPost(postId: number): Promise<Comment[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'comments',
    where: {
      and: [{ post: { equals: postId } }, { status: { equals: 'approved' } }],
    },
    sort: 'createdAt',
    depth: 0,
    limit: 500,
  })
  return result.docs as Comment[]
}
