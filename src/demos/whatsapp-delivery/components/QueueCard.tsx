import { AnimatePresence, motion } from 'framer-motion'
import { Inbox, MoveDown } from 'lucide-react'
import type { Message } from '../types'
import { Card } from '../../../shared/Card'
import { MessageCard } from './MessageCard'

type QueueCardProps = {
  queue: Message[]
}

/** The pending queue: where messages wait, in FIFO order, while offline. */
export function QueueCard({ queue }: QueueCardProps) {
  return (
    <Card accent="amber" className="w-full max-w-[300px] px-4 py-3.5">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40">
          <Inbox className="h-5 w-5" />
        </span>
        <p className="text-base font-semibold text-slate-100">Pending Queue</p>
        <span className="ml-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-300">
          {queue.length}
        </span>
      </div>

      {/* FIFO principle callout — only meaningful once there's something queued */}
      {queue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-amber-300/90"
        >
          First In
          <MoveDown className="h-3.5 w-3.5" />
          First Out
        </motion.div>
      )}

      <div className="flex min-h-[60px] flex-col gap-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {queue.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-dashed border-slate-700 py-4 text-center text-xs text-slate-500"
            >
              Queue is empty
            </motion.p>
          ) : (
            queue.map((m, i) => (
              <MessageCard
                key={m.id}
                message={m}
                compact
                layoutScope="flow"
                queueBadge={i === 0 ? 'Next out' : `#${i + 1} in line`}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <p className="mt-3 border-t border-slate-800 pt-2.5 text-center text-[11px] leading-snug text-slate-400">
        Temporary storage for messages waiting to be delivered.
      </p>
    </Card>
  )
}
