import { AnimatePresence, motion } from 'framer-motion'
import { History, RotateCw } from 'lucide-react'
import type { Snapshot } from '../types'
import { Card } from '../../../shared/Card'
import { cn } from '../../../lib/cn'

type StackColumnProps = {
  kind: 'undo' | 'redo'
  stack: Snapshot[]
  emptyLabel: string
}

const meta = {
  undo: {
    title: 'Undo Stack',
    hint: 'Every saved state — newest on top',
    icon: History,
    chip: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
    topRing: 'ring-sky-400/60',
    topBadge: 'bg-sky-500 text-slate-950',
    topLabel: 'TOP · current',
  },
  redo: {
    title: 'Redo Stack',
    hint: 'Undone states, waiting to come back',
    icon: RotateCw,
    chip: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
    topRing: 'ring-amber-400/60',
    topBadge: 'bg-amber-500 text-slate-950',
    topLabel: 'TOP · next redo',
  },
} as const

/**
 * One of the two stacks, drawn top-down (last array item first) so "pop the
 * top" is literally the top card sliding away. Cards keep their layoutId, so
 * undo/redo visibly flies a card from one stack to the other.
 */
export function StackColumn({ kind, stack, emptyLabel }: StackColumnProps) {
  const m = meta[kind]
  const Icon = m.icon
  const topDown = [...stack].reverse()

  return (
    <Card className="flex min-h-[260px] flex-col px-4 py-3">
      <div className="mb-1 flex items-center gap-2">
        <span
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg ring-1',
            m.chip,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-slate-100">{m.title}</p>
        <span className="ml-auto text-xs font-medium text-slate-500">
          {stack.length} {stack.length === 1 ? 'state' : 'states'}
        </span>
      </div>
      <p className="mb-3 text-[11px] text-slate-500">{m.hint}</p>

      <div className="flex flex-1 flex-col gap-2">
        <AnimatePresence initial={false}>
          {topDown.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-dashed border-slate-700 px-3 py-6 text-center text-xs text-slate-600"
            >
              {emptyLabel}
            </motion.div>
          ) : (
            topDown.map((snapshot, index) => {
              const isTop = index === 0
              return (
                <motion.div
                  key={snapshot.id}
                  layout
                  layoutId={snapshot.id}
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  className={cn(
                    'rounded-xl bg-slate-950/70 px-3 py-2 ring-1',
                    isTop ? m.topRing : 'ring-slate-800',
                    !isTop && 'opacity-70',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <p className="min-w-0 flex-1 truncate font-mono text-xs font-medium text-slate-200">
                      {snapshot.text}
                    </p>
                    {isTop && (
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold',
                          m.topBadge,
                        )}
                      >
                        {m.topLabel}
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
