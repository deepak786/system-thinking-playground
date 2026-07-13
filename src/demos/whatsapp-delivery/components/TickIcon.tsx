import { motion } from 'framer-motion'
import type { MessageStatus } from '../types'
import { cn } from '../../../lib/cn'

type TickIconProps = {
  status: MessageStatus
  className?: string
}

/**
 * WhatsApp-style delivery ticks:
 *  - sent      → single gray tick
 *  - delivered → double gray tick
 *  - read      → double blue tick (animated color change)
 */
export function TickIcon({ status, className }: TickIconProps) {
  const isDouble = status === 'delivered' || status === 'read'
  const isRead = status === 'read'

  return (
    <motion.span
      className={cn('relative inline-flex h-3.5 w-5 items-center', className)}
      aria-label={
        status === 'sent'
          ? 'Sent'
          : status === 'delivered'
            ? 'Delivered'
            : 'Read'
      }
    >
      <motion.span
        animate={{ color: isRead ? '#38bdf8' : '#94a3b8' }}
        transition={{ duration: 0.4 }}
        className="relative inline-flex h-3.5 w-5"
      >
        <Check className="absolute left-0 top-0" />
        {isDouble && <Check className="absolute left-[6px] top-0" />}
      </motion.span>
    </motion.span>
  )
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 15"
      className={cn('h-3.5 w-3.5', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 8.5 4.8 12 15 1.5" />
    </svg>
  )
}
