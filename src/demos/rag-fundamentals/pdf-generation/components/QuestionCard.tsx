import { motion } from 'framer-motion'
import { MessageCircleQuestion } from 'lucide-react'
import { QUESTION } from '../data'
import { SPRING } from '../animations'

/**
 * The user's question — pinned at the top while ChatGPT reads and
 * writes, so the goal never leaves the screen.
 */
export function QuestionCard() {
  return (
    <motion.div
      layoutId="gen-question"
      layout
      transition={SPRING}
      className="flex max-w-full items-center gap-2 rounded-xl border border-[#0071e3]/30 bg-[#0071e3]/[0.05] px-4 py-2 shadow-[0_2px_10px_rgba(0,113,227,0.10)]"
    >
      <MessageCircleQuestion className="h-4 w-4 shrink-0 text-[#0071e3]" strokeWidth={1.75} />
      <span className="truncate text-[13px] font-medium text-[#1d1d1f]">
        &ldquo;{QUESTION}&rdquo;
      </span>
    </motion.div>
  )
}
