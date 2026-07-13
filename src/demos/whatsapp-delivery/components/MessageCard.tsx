import { motion } from 'framer-motion'
import type { Message } from '../types'
import { TickIcon } from './TickIcon'
import { formatShort } from '../../../lib/time'
import { cn } from '../../../lib/cn'

type MessageCardProps = {
  message: Message
  /** Compact variant used inside the small phone/queue screens. */
  compact?: boolean
  /**
   * Namespace for the Framer Motion `layoutId`. Locations that should animate
   * into each other (Queue → Delivered → Read panels) must share a scope;
   * locations that render the same message simultaneously (the phone screens)
   * must use distinct scopes, otherwise Framer Motion hides one of the
   * duplicate elements.
   */
  layoutScope: string
  /** Optional amber chip shown above the text (e.g. "Next out" in the queue). */
  queueBadge?: string
}

const statusAccent: Record<Message['status'], string> = {
  sent: 'border-slate-600/60',
  delivered: 'border-slate-500/60',
  read: 'border-sky-500/50',
}

/** Rounded chat bubble representing a single message plus its delivery ticks. */
export function MessageCard({
  message,
  compact = false,
  layoutScope,
  queueBadge,
}: MessageCardProps) {
  return (
    <motion.div
      layout
      layoutId={`${layoutScope}-${message.id}`}
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 500, damping: 34 }}
      className={cn(
        'rounded-2xl rounded-br-sm border bg-brand-500/10 text-left shadow-sm',
        statusAccent[message.status],
        compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2.5',
      )}
    >
      {queueBadge && (
        <span className="mb-1 inline-flex items-center rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-300 ring-1 ring-amber-500/30">
          {queueBadge}
        </span>
      )}
      <p
        className={cn(
          'font-medium text-slate-100',
          compact ? 'text-[11px] leading-snug' : 'text-sm',
        )}
      >
        {message.text}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span
          className={cn(
            'font-mono text-slate-500',
            compact ? 'text-[9px]' : 'text-[10px]',
          )}
        >
          {message.id}
        </span>
        <span className="flex items-center gap-1">
          <span
            className={cn(
              'text-slate-400',
              compact ? 'text-[9px]' : 'text-[10px]',
            )}
          >
            {formatShort(message.timestamp)}
          </span>
          <TickIcon status={message.status} />
        </span>
      </div>
    </motion.div>
  )
}
