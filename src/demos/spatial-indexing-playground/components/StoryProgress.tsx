import { Columns2 } from 'lucide-react'
import { CHAPTERS } from '../narration/chapters'
import type { ChapterId } from '../types'
import { cn } from '../../../lib/cn'

type StoryProgressProps = {
  activeId: ChapterId | 'compare'
  completed: ChapterId[]
  walkthroughDone: boolean
  compareOpen: boolean
  isUnlocked: (id: ChapterId) => boolean
  onSelect: (id: ChapterId) => void
  onOpenCompare: () => void
}

/** Search Everything → Fixed Grid → Adaptive Grid → Hexagonal Grid → Compare */
export function StoryProgress({
  activeId,
  completed,
  walkthroughDone,
  compareOpen,
  isUnlocked,
  onSelect,
  onOpenCompare,
}: StoryProgressProps) {
  return (
    <nav
      aria-label="Story chapters"
      className="rounded-2xl bg-slate-900/50 px-3 py-3 ring-1 ring-slate-800/80 sm:px-4"
    >
      <ol className="flex flex-wrap items-center gap-1 sm:gap-0">
        {CHAPTERS.map((ch, i) => {
          const unlocked = isUnlocked(ch.id)
          const done = completed.includes(ch.id)
          const active = !compareOpen && ch.id === activeId
          return (
            <li key={ch.id} className="flex items-center">
              {i > 0 && (
                <span
                  className={cn(
                    'mx-1 hidden h-px w-5 sm:block sm:w-8',
                    done || walkthroughDone ? 'bg-slate-500' : 'bg-slate-800',
                  )}
                />
              )}
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onSelect(ch.id)}
                className={cn(
                  'rounded-xl px-2.5 py-2 text-left transition-colors sm:px-3',
                  active && 'bg-white/[0.06] ring-1 ring-white/10',
                  unlocked
                    ? 'hover:bg-white/[0.04]'
                    : 'cursor-not-allowed opacity-40',
                )}
              >
                <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Step {ch.step}
                </span>
                <span
                  className={cn(
                    'block text-xs font-semibold sm:text-sm',
                    active ? 'text-slate-100' : 'text-slate-400',
                  )}
                >
                  {ch.shortLabel}
                </span>
              </button>
            </li>
          )
        })}

        <li className="flex items-center">
          <span
            className={cn(
              'mx-1 hidden h-px w-5 sm:block sm:w-8',
              walkthroughDone ? 'bg-slate-500' : 'bg-slate-800',
            )}
          />
          <button
            type="button"
            disabled={!walkthroughDone}
            onClick={onOpenCompare}
            className={cn(
              'rounded-xl px-2.5 py-2 text-left transition-colors sm:px-3',
              compareOpen && 'bg-white/[0.06] ring-1 ring-white/10',
              walkthroughDone
                ? 'hover:bg-white/[0.04]'
                : 'cursor-not-allowed opacity-40',
            )}
          >
            <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Step 5
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 text-xs font-semibold sm:text-sm',
                compareOpen ? 'text-slate-100' : 'text-slate-400',
              )}
            >
              <Columns2 className="h-3.5 w-3.5" />
              Compare
            </span>
          </button>
        </li>
      </ol>
    </nav>
  )
}
