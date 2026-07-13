import { SquarePlay } from 'lucide-react'
import { cn } from '../lib/cn'

type WatchOnYouTubeProps = {
  href: string
  className?: string
}

/**
 * "Watch on YouTube" link used in demo headers. Deliberately a link (not an
 * embed) so views, watch time, and subscribes land on the channel itself.
 */
export function WatchOnYouTube({ href, className }: WatchOnYouTubeProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white',
        'shadow-[0_8px_20px_-8px_rgba(220,38,38,0.7)] transition-all duration-150 hover:bg-red-500 active:scale-[0.97]',
        className,
      )}
    >
      <SquarePlay className="h-4 w-4" />
      Watch on YouTube
    </a>
  )
}
