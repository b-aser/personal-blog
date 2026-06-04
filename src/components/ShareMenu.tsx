'use client'

import { cn } from '@/lib/utils'
import { buildShareLinks, copyShareLink, getShareUrl } from '@/lib/share'
import { Link2, Share } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { FaLinkedin } from 'react-icons/fa6'
import {  SiFacebook, SiThreads, SiX } from 'react-icons/si'

const socialIconClass = 'size-4'

type MenuItemProps = {
  icon: ReactNode
  label: string
  onClick?: () => void
  href?: string
}

function MenuItem({ icon, label, onClick, href }: MenuItemProps) {
  const className =
    'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/80'

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        <span className="flex size-5 shrink-0 items-center justify-center text-zinc-500 dark:text-zinc-400">
          {icon}
        </span>
        {label}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <span className="flex size-5 shrink-0 items-center justify-center text-zinc-500 dark:text-zinc-400">
        {icon}
      </span>
      {label}
    </button>
  )
}

type Props = {
  postTitle: string
  triggerClassName?: string
}

export function ShareMenu({ postTitle, triggerClassName }: Props) {
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  const handleCopyLink = async () => {
    const url = getShareUrl()
    const ok = await copyShareLink(url)
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  const url = getShareUrl()
  const links = buildShareLinks(url, postTitle)

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Share"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground',
          triggerClassName,
        )}
      >
        <Share className="size-6 stroke-[1.5]" />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-50 mt-3 w-56 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          <div
            className="absolute -top-1.5 right-3 size-3 rotate-45 border-l border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
            aria-hidden
          />
          <MenuItem
            icon={<Link2 className="size-5 stroke-[1.5]" />}
            label={copied ? 'Link copied' : 'Copy link'}
            onClick={handleCopyLink}
          />
          <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" role="separator" />
          
          <MenuItem
            icon={<SiFacebook className={socialIconClass} aria-hidden />}
            label="Share on Facebook"
            href={links.facebook}
            onClick={() => setOpen(false)}
          />
          <MenuItem
            icon={<FaLinkedin className={socialIconClass} aria-hidden />}
            label="Share on LinkedIn"
            href={links.linkedin}
            onClick={() => setOpen(false)}
          />
          <MenuItem
            icon={<SiThreads className={socialIconClass} aria-hidden />}
            label="Share on Threads"
            href={links.threads}
            onClick={() => setOpen(false)}
          />
          <MenuItem
            icon={<SiX className={socialIconClass} aria-hidden />}
            label="Share on X"
            href={links.x}
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
