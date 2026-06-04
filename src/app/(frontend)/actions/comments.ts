'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

export type CommentFormState = {
  ok: boolean
  message: string
  commentId?: number
  deleteToken?: string
}

export type DeleteCommentResult =
  | { ok: true }
  | { ok: false; message: string }

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

  const deleteToken = randomUUID()

  const comment = await payload.create({
    collection: 'comments',
    data: {
      post: Number(postId),
      authorName,
      authorEmail,
      body,
      status: 'approved',
      deleteToken,
    },
    overrideAccess: true,
  })

  revalidatePath(`/blog/${postSlug}`)

  return {
    ok: true,
    message: 'Your comment was posted.',
    commentId: comment.id,
    deleteToken,
  }
}

export async function deleteComment(
  commentId: number,
  postSlug: string,
  deleteToken: string,
): Promise<DeleteCommentResult> {
  if (!commentId || !postSlug || !deleteToken) {
    return { ok: false, message: 'Invalid request.' }
  }

  const payload = await getPayloadClient()

  const comment = await payload.findByID({
    collection: 'comments',
    id: commentId,
    depth: 0,
    overrideAccess: true,
  })

  if (comment.deleteToken !== deleteToken) {
    return { ok: false, message: 'You can only delete your own comments.' }
  }

  await payload.delete({
    collection: 'comments',
    id: commentId,
    overrideAccess: true,
  })

  revalidatePath(`/blog/${postSlug}`)

  return { ok: true }
}
