import { motion } from 'framer-motion'
import { fadeUp } from '../animations'

type Props = {
  /** Anchor id, also used by the parent section's aria-labelledby. */
  id: string
  title: string
  subtitle?: string
}

/** Consistent heading block for every About section. */
export function SectionHeading({ id, title, subtitle }: Props) {
  return (
    <motion.div variants={fadeUp} className="max-w-2xl">
      <h2 id={id} className="text-xl font-bold text-slate-100 sm:text-2xl">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-sm text-slate-400 sm:text-[15px]">{subtitle}</p>}
    </motion.div>
  )
}
