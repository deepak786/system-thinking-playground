import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEntranceVariants } from '../animations'

type Props = {
  onStart: () => void
}

/**
 * The one action on this screen — the only saturated element on the page.
 * The arrow slides right on hover to signal forward motion (a journey, not a
 * form submission); the microcopy below kills the last two objections.
 */
export function PrimaryAction({ onStart }: Props) {
  const { rise, lite } = useEntranceVariants()

  return (
    <motion.div variants={rise} className="flex flex-col items-center gap-3">
      <motion.button
        type="button"
        onClick={onStart}
        whileHover={lite ? undefined : { y: -1 }}
        whileTap={{ scale: 0.97 }}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0071e3] px-16 py-4 text-[17px] font-semibold text-white shadow-[0_8px_24px_rgba(0,113,227,0.28)] outline-none transition-[background-color,box-shadow] duration-200 hover:bg-[#0077ed] hover:shadow-[0_12px_32px_rgba(0,113,227,0.36)] focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafaf9] sm:w-auto sm:min-w-[300px]"
      >
        Start Demo
        <ArrowRight
          className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-[3px]"
          strokeWidth={2}
        />
      </motion.button>
      <p className="text-[13px] text-[#86868b]">
        Takes about 2 minutes&thinsp;&middot;&thinsp;No sign-up
      </p>
    </motion.div>
  )
}
