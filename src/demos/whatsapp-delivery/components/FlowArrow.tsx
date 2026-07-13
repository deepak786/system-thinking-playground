import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

type FlowArrowProps = {
  /** When true, the arrow pulses to hint that data is flowing along it. */
  active?: boolean
  label?: string
}

/** Vertical connector between pipeline stages. */
export function FlowArrow({ active = false, label }: FlowArrowProps) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-0.5 text-slate-500">
      {label ? (
        <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
      ) : null}
      <motion.span
        animate={active ? { y: [0, 4, 0], opacity: [0.5, 1, 0.5] } : { opacity: 0.45 }}
        transition={active ? { duration: 1.1, repeat: Infinity } : { duration: 0.2 }}
        className={active ? 'text-brand-400' : ''}
      >
        <ChevronDown className="h-5 w-5" />
      </motion.span>
    </div>
  )
}
