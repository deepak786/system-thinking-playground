import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

type Variant = 'primary' | 'success' | 'muted' | 'info' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: Variant
  icon?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-500 hover:bg-brand-400 text-slate-950 shadow-[0_8px_20px_-8px_rgba(28,183,101,0.7)]',
  success:
    'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_8px_20px_-8px_rgba(16,185,129,0.7)]',
  info: 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-[0_8px_20px_-8px_rgba(14,165,233,0.7)]',
  muted:
    'bg-slate-800 hover:bg-slate-700 text-slate-200 ring-1 ring-slate-700',
  danger:
    'bg-rose-500/90 hover:bg-rose-500 text-white shadow-[0_8px_20px_-8px_rgba(244,63,94,0.7)]',
}

/**
 * Pill-shaped action button with icon support and consistent disabled styling.
 */
export function Button({
  children,
  variant = 'muted',
  icon,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold',
        'transition-all duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100',
        variants[variant],
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
