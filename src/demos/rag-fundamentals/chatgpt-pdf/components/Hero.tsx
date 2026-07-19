import { motion } from 'framer-motion'
import { riseIn } from '../animations'

/** Eyebrow + title + subtitle: the promise of the whole demo. */
export function Hero() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <motion.span
        variants={riseIn}
        className="text-xs font-medium uppercase tracking-[0.08em] text-[#0071e3]"
      >
        Interactive Demo
      </motion.span>

      <motion.h1
        variants={riseIn}
        className="max-w-2xl text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.015em] text-[#1d1d1f] sm:text-[42px]"
      >
        How ChatGPT Answers Questions About Your PDF
      </motion.h1>

      <motion.p
        variants={riseIn}
        className="max-w-[52ch] text-balance text-[17px] leading-normal text-[#6e6e73] sm:text-lg"
      >
        Discover what happens behind the scenes when you ask ChatGPT questions
        about a document.
      </motion.p>
    </div>
  )
}
