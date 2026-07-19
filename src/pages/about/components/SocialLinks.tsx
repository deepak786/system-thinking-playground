import { Globe } from 'lucide-react'
import {
  GITHUB_URL,
  LINKEDIN_URL,
  PERSONAL_WEBSITE,
  YOUTUBE_URL,
} from '../../../config/site'
import { cn } from '../../../lib/cn'
import { GithubIcon, LinkedinIcon, YoutubeIcon } from './BrandIcons'

type Props = {
  className?: string
  /** Icon-only compact mode (used in the footer). */
  compact?: boolean
}

const LINKS = [
  { label: 'GitHub', href: GITHUB_URL, icon: GithubIcon },
  { label: 'LinkedIn', href: LINKEDIN_URL, icon: LinkedinIcon },
  { label: 'YouTube', href: YOUTUBE_URL, icon: YoutubeIcon },
  { label: 'Website', href: PERSONAL_WEBSITE, icon: Globe },
] as const

/** External profile links — all URLs come from `config/site`. */
export function SocialLinks({ className, compact = false }: Props) {
  return (
    <nav
      aria-label="Social links"
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      {LINKS.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          title={label}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl bg-slate-800/80 font-semibold text-slate-200 ring-1 ring-slate-700 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
            compact ? 'h-10 w-10 justify-center' : 'px-4 py-2.5 text-sm',
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
          {!compact && <span>{label}</span>}
        </a>
      ))}
    </nav>
  )
}
