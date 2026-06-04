'use server'

import { revalidatePath } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

export type LikePostResult =
  | { ok: true; likes: number }
  | { ok: false; message: string }

export async function likePost(
  postId: number,
  postSlug: string,
): Promise<LikePostResult> {
  if (!postId || !postSlug) {
    return { ok: false, message: 'Invalid post.' }
  }

  const payload = await getPayloadClient()

  const post = await payload.findByID({
    collection: 'posts',
    id: postId,
    depth: 0,
    overrideAccess: true,
  })

  if (post.status !== 'published') {
    return { ok: false, message: 'Post not found.' }
  }

  const currentLikes = typeof post.likes === 'number' ? post.likes : 0
  const likes = currentLikes + 1

  await payload.update({
    collection: 'posts',
    id: postId,
    data: { likes },
    overrideAccess: true,
  })

  revalidatePath(`/blog/${postSlug}`)

  return { ok: true, likes }
}
