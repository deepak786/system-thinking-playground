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
}

const statusAccent: Record<Message['status'], string> = {
  sent: 'border-slate-600/60',
  delivered: 'border-slate-500/60',
  read: 'border-sky-500/50',
}

/** Rounded chat bubble representing a single message plus its delivery ticks. */
export function MessageCard({ message, compact = false, layoutScope }: MessageCardProps) {
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
      <p
        className={cn(
          'font-medium text-slate-100',
          compact ? 'text-[11px] leading-snug' : 'text-sm',
        )}
      >
        {message.text}
      </p>
      <div className="mt-1 flex items-center justify-end gap-1">
        <span
          className={cn(
            'text-slate-400',
            compact ? 'text-[9px]' : 'text-[10px]',
          )}
        >
          {formatShort(message.timestamp)}
        </span>
        <TickIcon status={message.status} />
      </div>
    </motion.div>
  )
}
