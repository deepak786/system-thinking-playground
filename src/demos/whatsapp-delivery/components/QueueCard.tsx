import { AnimatePresence, motion } from 'framer-motion'
import { Inbox } from 'lucide-react'
import type { Message } from '../types'
import { Card } from '../../../shared/Card'
import { MessageCard } from './MessageCard'

type QueueCardProps = {
  queue: Message[]
}

/** The pending queue: where messages wait while the recipient is offline. */
export function QueueCard({ queue }: QueueCardProps) {
  return (
    <Card accent="amber" className="w-full max-w-[260px] px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40">
          <Inbox className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-slate-100">Pending Queue</p>
        <span className="ml-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-300">
          {queue.length}
        </span>
      </div>

      <div className="flex min-h-[52px] flex-col gap-1.5">
        <AnimatePresence mode="popLayout" initial={false}>
          {queue.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-dashed border-slate-700 py-3 text-center text-xs text-slate-500"
            >
              Queue is empty
            </motion.p>
          ) : (
            queue.map((m) => (
              <MessageCard key={m.id} message={m} compact layoutScope="flow" />
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
