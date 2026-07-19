import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { EASE_OUT } from '../animations'

type Props = {
  /** The button only renders once the screen's animation has played. */
  visible: boolean
  label?: string
  onNext: () => void
}

/**
 * The single forward action at the bottom of each stage. Reserved height
 * so the button's arrival never shifts the layout above it.
 */
export function NavigationFooter({ visible, label = 'Next', onNext }: Props) {
  return (
    <div className="mt-[clamp(12px,2vh,20px)] flex min-h-[72px] flex-col items-center justify-start">
      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            onClick={onNext}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.2 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0071e3] px-14 py-3.5 text-[16px] font-semibold text-white shadow-[0_8px_24px_rgba(0,113,227,0.28)] outline-none transition-[background-color,box-shadow] duration-200 hover:bg-[#0077ed] hover:shadow-[0_12px_32px_rgba(0,113,227,0.36)] focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafaf9] sm:w-auto sm:min-w-[240px]"
          >
            {label}
            <ArrowRight
              className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-[3px]"
              strokeWidth={2}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
