import { motion } from 'framer-motion'
import {
  ArrowRight,
  FileText,
  MessageSquare,
  Package,
  Scissors,
  SearchCheck,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../../../lib/cn'
import { PIPELINE } from '../data'
import { EASE_OUT } from '../animations'

const ICONS: LucideIcon[] = [
  FileText,
  Scissors,
  SearchCheck,
  Package,
  Sparkles,
  MessageSquare,
]

type Props = {
  /** How many pipeline stops are visible so far. */
  visibleCount: number
}

/**
 * The whole playlist in one line: PDF → Chunks → Relevant chunks →
 * Question + chunks → ChatGPT → Answer. Stops appear one at a time.
 */
export function PipelineSummary({ visibleCount }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2.5">
      {PIPELINE.map((label, i) => {
        const Icon = ICONS[i]
        const visible = i < visibleCount
        return (
          <span key={label} className="flex items-center gap-2">
            {i > 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="h-3.5 w-3.5 text-[#a1a1a6]" strokeWidth={2} />
              </motion.span>
            )}
            <motion.span
              initial={false}
              animate={{
                opacity: visible ? 1 : 0,
                y: visible ? 0 : 10,
                scale: visible ? 1 : 0.9,
              }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className={cn(
                'flex items-center gap-1.5 rounded-full border bg-white py-1.5 pl-2.5 pr-3 text-[12px] font-medium shadow-[0_2px_8px_rgba(0,0,0,0.05)]',
                i === PIPELINE.length - 1
                  ? 'border-[#0071e3] bg-[#0071e3]/[0.05] text-[#0071e3]'
                  : 'border-black/[0.08] text-[#1d1d1f]',
              )}
            >
              <Icon
                className={cn(
                  'h-3.5 w-3.5',
                  i === PIPELINE.length - 1 ? 'text-[#0071e3]' : 'text-[#6e6e73]',
                )}
                strokeWidth={1.75}
              />
              {label}
            </motion.span>
          </span>
        )
      })}
    </div>
  )
}
