import { RotateCcw } from 'lucide-react'
import { CAPACITY_OPTIONS } from '../data'
import { Button } from '../../../shared/Button'
import { cn } from '../../../lib/cn'

type ControlBarProps = {
  capacity: number
  disabled: boolean
  onCapacity: (capacity: number) => void
  onReset: () => void
}

/** Bottom bar: cache size selector plus reset. */
export function ControlBar({ capacity, disabled, onCapacity, onReset }: ControlBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">Cache size</span>
        <div className="flex overflow-hidden rounded-xl ring-1 ring-slate-700">
          {CAPACITY_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => onCapacity(option)}
              disabled={disabled}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                capacity === option
                  ? 'bg-brand-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <Button variant="danger" icon={<RotateCcw className="h-4 w-4" />} onClick={onReset}>
        Reset
      </Button>
    </div>
  )
}
