import { cn } from '../lib/cn'

type StatusBadgeProps = {
  online: boolean
  className?: string
  /** Label shown before the state, e.g. "Alice". */
  label?: string
}

/**
 * Small online/offline pill with a pulsing dot. Reusable across any demo that
 * needs to show a presence state.
 */
export function StatusBadge({ online, className, label }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
        online
          ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
          : 'bg-slate-500/15 text-slate-400 ring-slate-500/30',
        className,
      )}
    >
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          online ? 'bg-emerald-400 animate-pulse-ring' : 'bg-slate-500',
        )}
      />
      {label ? <span className="text-slate-300">{label}</span> : null}
      {online ? 'Online' : 'Offline'}
    </span>
  )
}
