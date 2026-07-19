import { motion } from 'framer-motion'
import { cn } from '../../../lib/cn'
import { riseIn } from '../animations'
import { TOTAL_STEPS } from '../data'

type Props = {
  step: number
  /** Short stage name shown beside the counter, e.g. "Assemble". */
  name: string
  title: string
  subtitle?: string
}

/**
 * Named step counter, dots, large centered title, optional one-line
 * subtitle. Every stage opens with this so the demo reads as one journey.
 */
export function StepHeader({ step, name, title, subtitle }: Props) {
  return (
    <div className="flex flex-col items-center gap-2.5 text-center">
      <motion.div variants={riseIn} className="flex flex-col items-center gap-2">
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#86868b]">
          Step {step} of {TOTAL_STEPS} <span className="text-[#d2d2d7]">&middot;</span>{' '}
          <span className="text-[#0071e3]">{name}</span>
        </p>
        <div className="flex items-center gap-1.5" aria-hidden>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i + 1 === step ? 'w-5 bg-[#0071e3]' : 'w-1.5 bg-black/[0.12]',
              )}
            />
          ))}
        </div>
      </motion.div>

      <motion.h1
        variants={riseIn}
        className="mt-2 max-w-xl text-balance text-[26px] font-semibold leading-[1.1] tracking-[-0.015em] text-[#1d1d1f] sm:text-[32px]"
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          variants={riseIn}
          className="max-w-[54ch] text-balance text-[15px] leading-normal text-[#6e6e73] sm:text-base"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
