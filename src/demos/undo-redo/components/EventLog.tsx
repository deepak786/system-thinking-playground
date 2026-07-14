import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Ban,
  Eraser,
  Keyboard,
  RotateCcw,
  RotateCw,
  ScrollText,
  Undo2,
} from 'lucide-react'
import type { LogEntry, LogKind } from '../types'
import { Card } from '../../../shared/Card'
import { formatClock } from '../../../lib/time'
import { cn } from '../../../lib/cn'

type EventLogProps = {
  log: LogEntry[]
}

const kindMeta: Record<LogKind, { icon: typeof Ban; color: string; ring: string }> = {
  typed: { icon: Keyboard, color: 'text-emerald-300', ring: 'ring-emerald-500/30 bg-emerald-500/10' },
  undo: { icon: Undo2, color: 'text-sky-300', ring: 'ring-sky-500/30 bg-sky-500/10' },
  redo: { icon: RotateCw, color: 'text-amber-300', ring: 'ring-amber-500/30 bg-amber-500/10' },
  cleared: { icon: Eraser, color: 'text-rose-300', ring: 'ring-rose-500/30 bg-rose-500/10' },
  blocked: { icon: Ban, color: 'text-slate-400', ring: 'ring-slate-500/30 bg-slate-500/10' },
  reset: { icon: RotateCcw, color: 'text-rose-300', ring: 'ring-rose-500/30 bg-rose-500/10' },
}

/** Scrolling, timestamped story of every edit, undo, and redo. */
export function EventLog({ log }: EventLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [log.length])

  return (
    <Card className="flex h-full flex-col px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30">
          <ScrollText className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-slate-100">Story So Far</p>
        <span className="ml-auto text-xs font-medium text-slate-500">
          {log.length} events
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-1 overflow-y-auto no-scrollbar pr-1"
      >
        <AnimatePresence initial={false}>
          {log.map((entry) => {
            const meta = kindMeta[entry.kind]
            const Icon = meta.icon
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2.5 rounded-lg px-1.5 py-1"
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ring-1',
                    meta.ring,
                    meta.color,
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs font-medium text-slate-200">{entry.message}</p>
                  <p className="font-mono text-[10px] text-slate-500">
                    {formatClock(entry.timestamp)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </Card>
  )
}
