import { RotateCcw } from 'lucide-react'
import { LIMIT_OPTIONS, WINDOW_OPTIONS } from '../data'
import { Button } from '../../../shared/Button'
import { cn } from '../../../lib/cn'

type RuleBarProps = {
  limit: number
  windowMs: number
  onLimit: (limit: number) => void
  onWindow: (windowMs: number) => void
  onReset: () => void
}

function OptionGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-400">{label}</span>
      <div className="flex overflow-hidden rounded-xl ring-1 ring-slate-700">
        {children}
      </div>
    </div>
  )
}

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 text-xs font-semibold transition-colors',
        active
          ? 'bg-brand-500 text-slate-950'
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700',
      )}
    >
      {children}
    </button>
  )
}

/** Bottom bar for picking the rule (limit + window) and resetting. */
export function RuleBar({ limit, windowMs, onLimit, onWindow, onReset }: RuleBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
      <OptionGroup label="Max requests">
        {LIMIT_OPTIONS.map((option) => (
          <OptionButton
            key={option}
            active={limit === option}
            onClick={() => onLimit(option)}
          >
            {option}
          </OptionButton>
        ))}
      </OptionGroup>

      <OptionGroup label="Per window of">
        {WINDOW_OPTIONS.map((option) => (
          <OptionButton
            key={option.ms}
            active={windowMs === option.ms}
            onClick={() => onWindow(option.ms)}
          >
            {option.label}
          </OptionButton>
        ))}
      </OptionGroup>

      <Button variant="danger" icon={<RotateCcw className="h-4 w-4" />} onClick={onReset}>
        Reset
      </Button>
    </div>
  )
}
