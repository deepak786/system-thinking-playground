import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  /** Optional accent color used for the top border / glow. */
  accent?: 'slate' | 'brand' | 'sky' | 'violet' | 'amber'
}

const accentRing: Record<NonNullable<CardProps['accent']>, string> = {
  slate: 'ring-slate-700/60',
  brand: 'ring-brand-500/40',
  sky: 'ring-sky-500/40',
  violet: 'ring-violet-500/40',
  amber: 'ring-amber-500/40',
}

/**
 * Generic surface used across the playground. Frosted, rounded and subtly
 * elevated so nested content reads as a distinct "panel".
 */
export function Card({ children, className, accent = 'slate', ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-slate-900/70 backdrop-blur ring-1 shadow-soft',
        accentRing[accent],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
