import { motion } from 'framer-motion'
import { MessageCircleQuestion } from 'lucide-react'
import { useEntranceVariants } from '../animations'

type Props = {
  value: string
}

/**
 * The user's line in the script, already written. Displayed read-only —
 * this is a guided demo, not a real Q&A product, and the whole story
 * (retrieval results, answer) is scripted around this exact question.
 */
export function QuestionPanel({ value }: Props) {
  const { rise } = useEntranceVariants()

  return (
    <motion.div variants={rise}>
      <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#86868b]">
        Your Question
      </p>
      <div className="relative mt-3">
        <p className="w-full rounded-2xl border border-black/[0.08] bg-white py-[22px] pl-6 pr-14 text-[17px] text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.05)] sm:text-lg">
          {value}
        </p>
        <MessageCircleQuestion
          className="pointer-events-none absolute right-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#a1a1a6]"
          strokeWidth={1.75}
        />
      </div>
    </motion.div>
  )
}
