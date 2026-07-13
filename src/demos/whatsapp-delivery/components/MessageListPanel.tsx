import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Message } from '../types'
import { Card } from '../../../shared/Card'
import { MessageCard } from './MessageCard'
import { cn } from '../../../lib/cn'

type MessageListPanelProps = {
  title: string
  icon: ReactNode
  messages: Message[]
  accent: 'brand' | 'sky'
  emptyLabel: string
}

const dotColor: Record<MessageListPanelProps['accent'], string> = {
  brand: 'bg-emerald-400',
  sky: 'bg-sky-400',
}

/** Reusable panel that lists messages for a given stage (Delivered / Read). */
export function MessageListPanel({
  title,
  icon,
  messages,
  accent,
  emptyLabel,
}: MessageListPanelProps) {
  return (
    <Card accent={accent} className="flex min-h-0 flex-1 flex-col px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg ring-1',
            accent === 'brand'
              ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
              : 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
          )}
        >
          {icon}
        </span>
        <p className="text-sm font-semibold text-slate-100">{title}</p>
        <span
          className={cn(
            'ml-auto flex items-center gap-1.5 text-xs font-bold text-slate-300',
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', dotColor[accent])} />
          {messages.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="popLayout" initial={false}>
          {messages.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-dashed border-slate-700 py-4 text-center text-xs text-slate-500"
            >
              {emptyLabel}
            </motion.p>
          ) : (
            messages.map((m) => (
              <MessageCard key={m.id} message={m} layoutScope="flow" />
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
