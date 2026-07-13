import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { StatusBadge } from './StatusBadge'

type PhoneProps = {
  name: string
  online: boolean
  avatarColor?: string
  children?: ReactNode
  className?: string
  /** Emoji or short initials shown inside the avatar circle. */
  avatar?: string
}

/**
 * A simplified phone "device" card. Renders a status bar, an avatar header with
 * presence, and a screen area for arbitrary content (message previews, etc.).
 */
export function Phone({
  name,
  online,
  avatarColor = 'bg-brand-500',
  avatar,
  children,
  className,
}: PhoneProps) {
  return (
    <div
      className={cn(
        'relative w-full max-w-[300px] rounded-[2.2rem] bg-slate-950 p-2.5 ring-1 ring-slate-700/80 shadow-glow',
        className,
      )}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-2.5 z-10 h-1.5 w-20 -translate-x-1/2 rounded-full bg-slate-700" />

      <div className="overflow-hidden rounded-[1.8rem] bg-slate-900">
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-slate-800 bg-slate-900/80 px-4 pb-2.5 pt-5">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold text-slate-950',
              avatarColor,
            )}
          >
            {avatar ?? name.charAt(0)}
          </div>
          <div className="min-w-0 text-left">
            <p className="truncate text-base font-semibold text-slate-100">{name}</p>
            <StatusBadge online={online} className="mt-0.5 !px-1.5 !py-0" />
          </div>
        </div>

        {/* Screen */}
        <div className="min-h-[190px] bg-grid px-3 py-3.5">{children}</div>
      </div>
    </div>
  )
}
