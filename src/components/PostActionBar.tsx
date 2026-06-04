'use client'

import { likePost } from '@/app/(frontend)/actions/likes'
import { cn } from '@/lib/utils'
import { ShareMenu } from '@/components/ShareMenu'
import { useArticleSpeech } from '@/hooks/use-article-speech'
import { CirclePause, CirclePlay, MessageCircle } from 'lucide-react'
import { HandsClapping } from '@phosphor-icons/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'

const likedStorageKey = (postId: number) => `liked_${postId}`

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
  articleSpeechText: string
}

export function PostActionBar({
  postId,
  postSlug,
  likeCount,
  commentCount,
  repostCount = 0,
  postTitle,
  articleSpeechText,
}: Props) {
  const { status, supported, toggle, isPlaying } = useArticleSpeech(
    articleSpeechText,
  )
  const [likes, setLikes] = useState(likeCount)
  const [liking, setLiking] = useState(false)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    setLiked(localStorage.getItem(likedStorageKey(postId)) === 'true')
  }, [postId])

  useEffect(() => {
    setLikes(likeCount)
  }, [likeCount])

  const scrollToComments = () => {
    document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLike = async () => {
    if (liking) return
    if (liked) {
      localStorage.removeItem(likedStorageKey(postId))
      setLiked(false)
      setLikes((n) => Math.max(0, n - 1))
      return
    }

    const previous = likes
    setLikes((n) => n + 1)
    setLiked(true)
    setLiking(true)

    const result = await likePost(postId, postSlug)

    setLiking(false)
    if (result.ok) {
      localStorage.setItem(likedStorageKey(postId), 'true')
      setLikes(result.likes)
    } else {
      localStorage.removeItem(likedStorageKey(postId))
      setLikes(previous)
      setLiked(false)
    }
  }

  return (
    <div className="my-4 flex items-center justify-between border-y border-border py-3">
      <div className="flex items-center gap-5 sm:gap-6">

        {/* if the blog is liked alredy clinking the second time it will be unliked */}

        <ActionButton
          label="Like"
          onClick={handleLike}
          disabled={liking}
        >
          {liked ? <HandsClapping className="size-5 text-black fill-black" weight="fill" /> : <HandsClapping className="size-5" weight="regular" color="currentColor" />}
          <span className="text-sm tabular-nums">{formatCount(likes)}</span>
        </ActionButton>

        <ActionButton label="View comments" onClick={scrollToComments}>
          <MessageCircle className="size-5 stroke-[1.5]" />
          <span className="text-sm tabular-nums">{formatCount(commentCount)}</span>
        </ActionButton>
      </div>

      <div className="flex items-center gap-4 sm:gap-5">

        <div className="relative mx-4">
          <ActionButton
            label={
              !supported
                ? 'Listen not supported in this browser'
                : isPlaying
                  ? 'Pause listening'
                  : status === 'paused'
                    ? 'Resume listening'
                    : 'Listen to article (beta)'
            }
            onClick={toggle}
            disabled={!supported || !articleSpeechText.trim()}
            className={isPlaying ? 'text-foreground' : undefined}
          >
            {isPlaying ? (
              <CirclePause className="size-6 stroke-[1.5]" />
            ) : (
              <CirclePlay className="size-6 stroke-[1.5]" />
            )}
          </ActionButton>
          <Badge
            variant="secondary"
            aria-hidden
            className="pointer-events-none absolute -right-7 -top-2 z-10 h-4 border-border px-1.5 py-0 text-[10px] font-semibold leading-4"
          >
            Beta
          </Badge>
        </div>

        <ShareMenu postTitle={postTitle} />
      </div>
    </div>
  )
}
