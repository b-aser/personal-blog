import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Aser's Blog
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/blog" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            Posts
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
