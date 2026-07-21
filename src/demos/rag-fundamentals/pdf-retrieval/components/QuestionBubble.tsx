import { motion } from 'framer-motion'
import { MessageCircleQuestion } from 'lucide-react'
import { cn } from '../../../../lib/cn'
import { useLiteMotion, useOptionalLayoutId } from '../../../../lib/useLiteMotion'
import { QUESTION } from '../data'

type Props = {
  /** While the search sweep runs, the bubble quietly pulses. */
  searching?: boolean
}

/**
 * The one question the whole demo revolves around. A shared layoutId lets
 * it glide from below the chunk wall (Problem) to above it (Search).
 */
export function QuestionBubble({ searching = false }: Props) {
  const lite = useLiteMotion()
  const sharedId = useOptionalLayoutId('question-bubble')
  return (
    <motion.div
      layoutId={sharedId}
      layout={!lite}
      animate={searching ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={
        searching
          ? { duration: lite ? 0.8 : 1.2, repeat: Infinity, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 300, damping: 30 }
      }
      className={cn(
        'inline-flex max-w-full items-center gap-2 rounded-full border bg-white py-2 pl-3 pr-4',
        searching
          ? 'border-[#0071e3]/40 shadow-[0_2px_14px_rgba(0,113,227,0.22)]'
          : 'border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
      )}
    >
      <MessageCircleQuestion
        className="h-4 w-4 shrink-0 text-[#0071e3]"
        strokeWidth={1.75}
      />
      <span className="truncate text-[13px] font-medium text-[#1d1d1f]">
        &ldquo;{QUESTION}&rdquo;
      </span>
    </motion.div>
  )
}
