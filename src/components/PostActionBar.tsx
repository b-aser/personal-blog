'use client'

import { likePost } from '@/app/(frontend)/actions/likes'
import { cn } from '@/lib/utils'
import {
  CirclePlay,
  HeartPlus,
  MessageCircle,
  Repeat2,
  Share,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'

function formatCount(count: number) {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  }
  return String(count)
}

type ActionButtonProps = {
  label: string
  onClick?: () => void
  disabled?: boolean
  children: ReactNode
  className?: string
}

function ActionButton({
  label,
  onClick,
  disabled,
  children,
  className,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  )
}

type Props = {
  postId: number
  postSlug: string
  likeCount: number
  commentCount: number
  repostCount?: number
  postTitle: string
}

export function PostActionBar({
  postId,
  postSlug,
  likeCount,
  commentCount,
  repostCount = 0,
  postTitle,
}: Props) {
  const [likes, setLikes] = useState(likeCount)
  const [liking, setLiking] = useState(false)

  const scrollToComments = () => {
    document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLike = async () => {
    if (liking) return

    const previous = likes
    setLikes((n) => n + 1)
    setLiking(true)

    const result = await likePost(postId, postSlug)

    setLiking(false)

    if (result.ok) {
      setLikes(result.likes)
    } else {
      setLikes(previous)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: postTitle, url })
      return
    }
    await navigator.clipboard.writeText(url)
  }

  return (
    <div className="my-4 flex items-center justify-between border-y border-border py-3">
      <div className="flex items-center gap-5 sm:gap-6">
        <ActionButton
          label="Like"
          onClick={handleLike}
          disabled={liking}
        >
          <HeartPlus className="size-5 stroke-[1.5]" />
          <span className="text-sm tabular-nums">{formatCount(likes)}</span>
        </ActionButton>

        <ActionButton label="View comments" onClick={scrollToComments}>
          <MessageCircle className="size-5 stroke-[1.5]" />
          <span className="text-sm tabular-nums">{formatCount(commentCount)}</span>
        </ActionButton>
      </div>

      <div className="flex items-center gap-4 sm:gap-5">
        <ActionButton label="Listen">
          <CirclePlay className="size-6 stroke-[1.5]" />
        </ActionButton>

        <ActionButton label="Share" onClick={handleShare}>
          <Share className="size-6 stroke-[1.5]" />
        </ActionButton>
      </div>
    </div>
  )
}
