import { motion } from 'framer-motion'
import { useEntranceVariants } from '../animations'
import { TOTAL_STEPS } from '../data'

type Props = {
  current: number
  /** Short name of the current step, e.g. "Introduction". */
  title: string
}

/**
 * "Step 1 of 6" + step title + six dots. Lives at the top of the screen so
 * visitors know this is a short guided journey before they commit to anything.
 */
export function ProgressIndicator({ current, title }: Props) {
  const { rise, lite } = useEntranceVariants()

  return (
    <motion.div
      variants={rise}
      className="flex flex-col items-center gap-1.5"
      aria-label={`Step ${current} of ${TOTAL_STEPS}: ${title}`}
    >
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-[#86868b]">
        Step {current} of {TOTAL_STEPS}
      </span>
      <span className="text-[15px] font-medium text-[#1d1d1f]">{title}</span>
      <div className="mt-0.5 flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const isActive = i + 1 === current
          return isActive ? (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: lite ? 420 : 500,
                damping: 22,
                delay: lite ? 0.25 : 0.6,
              }}
              className="h-2 w-5 rounded-full bg-[#0071e3]"
            />
          ) : (
            <span key={i} className="h-2 w-2 rounded-full bg-black/[0.12]" />
          )
        })}
      </div>
    </motion.div>
  )
}
