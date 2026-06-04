import { RssIcon } from 'lucide-react'
import Link from 'next/link'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 p-6 sm:flex-row items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight hover:text-foreground"
          >
            Aser&apos;s Blog
          </Link>
          <p className="mt-2 text-xs text-muted-foreground ">
            Thoughts, notes, and writing.
          </p>
          <Link href="/rss" className="text-xs tracking-tight hover:text-foreground flex items-center gap-1">
            <p className="flex items-center gap-1">RSS Feed <RssIcon className="size-3" /></p>
          </Link>
          

        </div>
        <div className="text-right text-xs text-muted-foreground">
          © {year} Aser. All rights reserved.
        </div>

      </div>
    </footer>
  )
}
