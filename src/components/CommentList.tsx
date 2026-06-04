'use client'

import { deleteComment } from '@/app/(frontend)/actions/comments'
import {
  canDeleteComment,
  getCommentDeleteToken,
  removeCommentDeleteToken,
} from '@/lib/comment-tokens'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export type CommentListItem = {
  id: number
  authorName: string
  body: string
}

type Props = {
  comments: CommentListItem[]
  postSlug: string
}

const INITIAL_VISIBLE_COUNT = 3

export function CommentList({ comments, postSlug }: Props) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [deletableIds, setDeletableIds] = useState<Set<number>>(new Set())
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const hasMore = comments.length > INITIAL_VISIBLE_COUNT
  const visibleComments = expanded
    ? comments
    : comments.slice(0, INITIAL_VISIBLE_COUNT)
  const hiddenCount = comments.length - INITIAL_VISIBLE_COUNT

  useEffect(() => {
    setDeletableIds(
      new Set(comments.filter((c) => canDeleteComment(c.id)).map((c) => c.id)),
    )
  }, [comments])

  const handleDelete = async (commentId: number) => {
    const token = getCommentDeleteToken(commentId)
    if (!token) return

    setError(null)
    setDeletingId(commentId)

    const result = await deleteComment(commentId, postSlug, token)

    setDeletingId(null)

    if (result.ok) {
      removeCommentDeleteToken(commentId)
      setDeletableIds((prev) => {
        const next = new Set(prev)
        next.delete(commentId)
        return next
      })
      router.refresh()
      return
    }

    setError(result.message)
  }

  if (comments.length === 0) {
    return (
      <p className="mt-4 text-zinc-500 dark:text-zinc-400">
        No comments yet. Be the first.
      </p>
    )
  }

  return (
    <>
      <ul className="mt-8 space-y-8">
        {visibleComments.map((comment) => (
          <li
            key={comment.id}
            className="border-l-2 border-zinc-200 pl-4 dark:border-zinc-700"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="font-medium">{comment.authorName}</p>
              {deletableIds.has(comment.id) && (
                <button
                  type="button"
                  onClick={() => handleDelete(comment.id)}
                  disabled={deletingId === comment.id}
                  className="shrink-0 text-sm text-zinc-500 hover:text-red-600 disabled:opacity-50 dark:hover:text-red-400"
                >
                  {deletingId === comment.id ? 'Deleting…' : 'Delete'}
                </button>
              )}
            </div>
            <p className="mt-2 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              {comment.body}
            </p>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-4 text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
        >
          {expanded
            ? 'Show less'
            : `See more (${hiddenCount} ${hiddenCount === 1 ? 'comment' : 'comments'})`}
        </button>
      )}
      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </>
  )
}
