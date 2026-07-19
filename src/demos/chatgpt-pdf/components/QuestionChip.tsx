import { motion } from 'framer-motion'
import { MessageCircleQuestion } from 'lucide-react'
import { riseIn } from '../animations'

type Props = {
  question: string
}

/**
 * The user's question, carried forward from Screen 1 as a quiet pill so the
 * narrative thread ("this is all in service of answering YOUR question")
 * stays visible on every step.
 */
export function QuestionChip({ question }: Props) {
  return (
    <motion.div variants={riseIn} className="flex justify-center">
      <div className="flex max-w-full items-center gap-2 rounded-full border border-black/[0.06] bg-white py-2 pl-3 pr-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <MessageCircleQuestion
          className="h-4 w-4 shrink-0 text-[#0071e3]"
          strokeWidth={1.75}
        />
        <span className="truncate text-sm text-[#1d1d1f]">
          &ldquo;{question}&rdquo;
        </span>
      </div>
    </motion.div>
  )
}
