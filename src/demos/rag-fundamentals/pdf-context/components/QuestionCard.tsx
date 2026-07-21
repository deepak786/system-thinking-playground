import { motion } from 'framer-motion'
import { MessageCircleQuestion } from 'lucide-react'
import { cn } from '../../../../lib/cn'
import { useLiteMotion, useOptionalLayoutId } from '../../../../lib/useLiteMotion'
import { QUESTION } from '../data'
import { SPRING } from '../animations'

type Props = {
  /** Compact variant used once the card sits inside the package. */
  mini?: boolean
}

/**
 * The user's question as a card — one of the two ingredients of the
 * package. A shared layoutId carries it from under the PDF, across the
 * assembly, and into the context container.
 */
export function QuestionCard({ mini = false }: Props) {
  const lite = useLiteMotion()
  const sharedId = useOptionalLayoutId('question-card')
  return (
    <motion.div
      layoutId={sharedId}
      layout={!lite}
      transition={SPRING}
      className={cn(
        'flex max-w-full items-center gap-2 rounded-xl border border-[#0071e3]/30 bg-[#0071e3]/[0.05] shadow-[0_2px_10px_rgba(0,113,227,0.10)]',
        mini ? 'px-3 py-1.5' : 'px-4 py-2.5',
      )}
    >
      <MessageCircleQuestion
        className={cn('shrink-0 text-[#0071e3]', mini ? 'h-3.5 w-3.5' : 'h-4 w-4')}
        strokeWidth={1.75}
      />
      <span
        className={cn(
          'truncate font-medium text-[#1d1d1f]',
          mini ? 'text-[12px]' : 'text-[13px]',
        )}
      >
        &ldquo;{QUESTION}&rdquo;
      </span>
    </motion.div>
  )
}
