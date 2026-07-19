import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '../../../../lib/cn'
import { SPRING } from '../animations'

type Props = {
  /** Lights up when the package arrives / while writing the answer. */
  active?: boolean
}

/** ChatGPT as a quiet destination card — no anatomy, just a recipient. */
export function ChatGPTCard({ active = false }: Props) {
  return (
    <motion.div
      layoutId="chatgpt-card"
      layout
      transition={SPRING}
      className={cn(
        'flex items-center gap-2.5 rounded-2xl border bg-white px-6 py-3.5',
        active
          ? 'border-[#0071e3]/50 shadow-[0_8px_28px_rgba(0,113,227,0.22)]'
          : 'border-black/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.06)]',
        'transition-[border-color,box-shadow] duration-500',
      )}
    >
      <motion.span
        animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }}
        transition={
          active
            ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full',
          active ? 'bg-[#0071e3]' : 'bg-[#1d1d1f]',
          'transition-colors duration-500',
        )}
      >
        <Sparkles className="h-[18px] w-[18px] text-white" strokeWidth={1.75} />
      </motion.span>
      <span className="text-[15px] font-semibold text-[#1d1d1f]">ChatGPT</span>
    </motion.div>
  )
}
