import { AnimatePresence, motion } from 'framer-motion'
import { MoveRight, Route } from 'lucide-react'
import { degreeLabel, levelTheme, personById } from '../data'
import type { SearchState, SelectedPath } from '../types'
import { cn } from '../../../lib/cn'

type PathStripProps = {
  state: SearchState
  selectedPath: SelectedPath
}

/**
 * Shows the shortest chain of people from You to whoever is selected —
 * the practical payoff of BFS: "how do I actually know this person?"
 */
export function PathStrip({ state, selectedPath }: PathStripProps) {
  const target = state.selectedId
  const hasPath = target !== null && selectedPath.ids.length > 0

  return (
    <div className="flex min-h-[42px] flex-wrap items-center gap-2 rounded-xl bg-slate-950/60 px-3 py-2 ring-1 ring-slate-800">
      <Route className="h-4 w-4 shrink-0 text-slate-400" />
      <AnimatePresence mode="wait" initial={false}>
        {hasPath ? (
          <motion.div
            key={target}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap items-center gap-1.5"
          >
            <span className="text-xs text-slate-400">
              Shortest chain to{' '}
              <span className="font-semibold text-slate-200">
                {personById[target].name}
              </span>
              :
            </span>
            {selectedPath.ids.map((id, i) => {
              const degree = state.degreeById[id]
              const theme = levelTheme(degree)
              return (
                <span key={id} className="flex items-center gap-1.5">
                  {i > 0 && <MoveRight className="h-3.5 w-3.5 text-slate-500" />}
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1',
                      theme.chip,
                    )}
                  >
                    {personById[id].name}
                  </span>
                </span>
              )
            })}
            <span className="ml-1 text-xs font-semibold text-slate-300">
              = {degreeLabel(state.degreeById[target])} connection (
              {selectedPath.ids.length - 1}{' '}
              {selectedPath.ids.length - 1 === 1 ? 'hop' : 'hops'})
            </span>
          </motion.div>
        ) : (
          <motion.span
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-slate-500"
          >
            Click any discovered person to see the shortest chain of people
            connecting you.
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
