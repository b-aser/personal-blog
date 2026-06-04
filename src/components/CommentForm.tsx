'use client'

import { useActionState } from 'react'
import { submitComment, type CommentFormState } from '@/app/(frontend)/actions/comments'

const initialState: CommentFormState = { ok: false, message: '' }

type Props = {
  postId: number
  postSlug: string
}

export function CommentForm({ postId, postSlug }: Props) {
  const [state, action, pending] = useActionState(submitComment, initialState)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="postSlug" value={postSlug} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Name
          </span>
          <input
            name="authorName"
            required
            maxLength={120}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </span>
          <input
            name="authorEmail"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Comment
        </span>
        <textarea
          name="body"
          required
          rows={4}
          maxLength={5000}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? 'Sending…' : 'Post comment'}
      </button>

      {state.message && (
        <p
          className={`text-sm ${state.ok ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
          role="status"
        >
          {state.message}
        </p>
      )}
    </form>
  )
}
