import { AnimatePresence, motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { degreeLabel, levelTheme, PEOPLE, personById } from '../data'
import type { PersonId, SearchState } from '../types'
import { Card } from '../../../shared/Card'
import { cn } from '../../../lib/cn'

type LevelsPanelProps = {
  state: SearchState
  onSelect: (id: PersonId | null) => void
}

const LEVEL_HINTS: Record<number, string> = {
  0: 'The starting point',
  1: 'People you know directly',
  2: 'Friends of your friends',
  3: 'One more hop away',
}

/**
 * Connection levels filling up as the search ripples outward. A whole level
 * always completes before the next one starts — the signature of BFS.
 */
export function LevelsPanel({ state, onSelect }: LevelsPanelProps) {
  const byDegree = new Map<number, PersonId[]>()
  for (const person of PEOPLE) {
    const degree = state.degreeById[person.id]
    if (degree === undefined) continue
    const list = byDegree.get(degree) ?? []
    list.push(person.id)
    byDegree.set(degree, list)
  }

  return (
    <Card data-tour="levels" className="px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30">
          <Users className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-slate-100">Connection Levels</p>
        <span className="ml-auto text-xs font-medium text-slate-500">
          {Object.keys(state.degreeById).length} / {PEOPLE.length} found
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3].map((degree) => {
          const theme = levelTheme(degree)
          const ids = byDegree.get(degree) ?? []
          return (
            <div key={degree} className="flex items-start gap-2.5">
              <span
                className={cn(
                  'mt-0.5 inline-flex w-11 shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1',
                  theme.chip,
                )}
              >
                {degreeLabel(degree)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex min-h-[22px] flex-wrap gap-1.5">
                  {ids.length === 0 ? (
                    <span className="text-[11px] italic text-slate-600">
                      nobody found yet
                    </span>
                  ) : (
                    <AnimatePresence initial={false}>
                      {ids.map((id) => (
                        <motion.button
                          key={id}
                          type="button"
                          layout
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() =>
                            onSelect(state.selectedId === id ? null : id)
                          }
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 transition-colors',
                            theme.chip,
                            state.selectedId === id && 'ring-2 ring-white/70',
                          )}
                        >
                          {personById[id].name}
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  {LEVEL_HINTS[degree]}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
