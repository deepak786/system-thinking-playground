import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { cn } from '../../../lib/cn'
import type { Relevance } from '../data'

/**
 * The verdict stamp a chunk receives once the question has checked it:
 * a blue check (relevant), a softer check (possibly), or a gray x.
 */
export function RelevanceBadge({ relevance }: { relevance: Relevance }) {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={cn(
        'absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full shadow-sm',
        relevance === 'yes' && 'bg-[#0071e3]',
        relevance === 'maybe' && 'bg-[#5aa9f0]',
        relevance === 'no' && 'bg-[#d2d2d7]',
      )}
    >
      {relevance === 'no' ? (
        <X className="h-2.5 w-2.5 text-white" strokeWidth={3} />
      ) : (
        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
      )}
    </motion.span>
  )
}
