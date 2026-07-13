import { AnimatePresence, motion } from 'framer-motion'
import { ListOrdered, Search } from 'lucide-react'
import { degreeLabel, levelTheme, personById } from '../data'
import type { SearchState } from '../types'
import { Card } from '../../../shared/Card'
import { cn } from '../../../lib/cn'

type QueuePanelProps = {
  state: SearchState
}

function PersonChip({ id, degree, dimmed }: { id: string; degree: number; dimmed?: boolean }) {
  const theme = levelTheme(degree)
  return (
    <motion.span
      layout
      layoutId={`queue-${id}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: dimmed ? 0.7 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1',
        theme.chip,
      )}
    >
      {personById[id].name}
      <span className="text-[10px] opacity-80">{degreeLabel(degree)}</span>
    </motion.span>
  )
}

/**
 * The "checking line" — this IS the queue that powers breadth-first search.
 * New people join at the back; the person at the front gets checked next,
 * which is exactly why closer levels always finish before farther ones.
 */
export function QueuePanel({ state }: QueuePanelProps) {
  const checking = state.checkingId

  return (
    <Card className="px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
          <ListOrdered className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-slate-100">The Checking Line</p>
        <span className="ml-auto text-xs font-medium text-slate-500">
          {state.queue.length} waiting
        </span>
      </div>

      <p className="mb-3 text-xs text-slate-400">
        People wait in line to have their connections checked. Newly found
        people join the <span className="font-semibold text-slate-300">back</span>, and the{' '}
        <span className="font-semibold text-slate-300">front</span> goes next — so
        everyone close to you is finished before anyone farther away.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {/* Currently being checked */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-950/60 px-2.5 py-1.5 ring-1 ring-slate-700">
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[11px] font-medium text-slate-400">Checking now:</span>
          {checking ? (
            <PersonChip id={checking} degree={state.degreeById[checking]} />
          ) : (
            <span className="text-[11px] text-slate-600">nobody</span>
          )}
        </div>

        <span className="text-xs font-semibold text-slate-500">← front</span>

        {/* The waiting line */}
        <div className="flex min-h-[30px] flex-1 flex-wrap items-center gap-1.5 rounded-xl border border-dashed border-slate-700 px-2.5 py-1.5">
          <AnimatePresence initial={false}>
            {state.queue.length === 0 ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] text-slate-600"
              >
                {state.done ? 'Line empty — search complete' : 'Line is empty'}
              </motion.span>
            ) : (
              state.queue.map((id) => (
                <PersonChip key={id} id={id} degree={state.degreeById[id]} dimmed />
              ))
            )}
          </AnimatePresence>
        </div>

        <span className="text-xs font-semibold text-slate-500">back ←</span>
      </div>
    </Card>
  )
}
