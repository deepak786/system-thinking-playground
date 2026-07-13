import { motion } from 'framer-motion'
import { Server } from 'lucide-react'
import { Card } from '../../../shared/Card'
import { cn } from '../../../lib/cn'

type ServerCardProps = {
  /** Number of messages currently held in the queue (shown as a badge). */
  queued: number
  /** Whether a message just passed through (drives a brief highlight). */
  active?: boolean
}

/** Represents the WhatsApp relay server sitting between the two users. */
export function ServerCard({ queued, active = false }: ServerCardProps) {
  return (
    <Card
      accent="violet"
      className={cn(
        'w-full max-w-[260px] px-4 py-3 transition-colors',
        active && 'ring-2 ring-violet-400/70',
      )}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/40"
        >
          <Server className="h-5 w-5" />
        </motion.div>
        <div className="text-left">
          <p className="text-sm font-semibold text-slate-100">WhatsApp Server</p>
          <p className="text-xs text-slate-400">Relays & stores messages</p>
        </div>
        <span className="ml-auto rounded-full bg-violet-500/15 px-2.5 py-1 text-xs font-bold text-violet-300 ring-1 ring-violet-500/30">
          {queued} held
        </span>
      </div>
    </Card>
  )
}
