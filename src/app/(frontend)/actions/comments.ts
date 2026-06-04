'use server'

import { revalidatePath } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

export type CommentFormState = {
  ok: boolean
  message: string
}

export async function submitComment(
  _prev: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const postId = formData.get('postId')
  const postSlug = formData.get('postSlug')
  const authorName = String(formData.get('authorName') ?? '').trim()
  const authorEmail = String(formData.get('authorEmail') ?? '').trim()
  const body = String(formData.get('body') ?? '').trim()

  if (!postId || !postSlug) {
    return { ok: false, message: 'Invalid post.' }
  }

  if (!authorName || !authorEmail || !body) {
    return { ok: false, message: 'Please fill in all fields.' }
  }

  if (body.length > 5000) {
    return { ok: false, message: 'Comment is too long.' }
  }

  const payload = await getPayloadClient()

  await payload.create({
    collection: 'comments',
    data: {
      post: Number(postId),
      authorName,
      authorEmail,
      body,
      status: 'pending',
    },
    overrideAccess: true,
  })

  revalidatePath(`/blog/${postSlug}`)

  return {
    ok: true,
    message: 'Thanks! Your comment is awaiting moderation.',
  }
}
