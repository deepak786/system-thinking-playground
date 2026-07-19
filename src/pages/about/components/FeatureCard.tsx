import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { fadeUp } from '../animations'

type Props = {
  icon: LucideIcon
  title: string
  description: string
  /** Tailwind text color class for the icon accent. */
  accentClass: string
}

/** Section 3 — one design principle behind the visualizations. */
export function FeatureCard({ icon: Icon, title, description, accentClass }: Props) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-3 rounded-2xl bg-slate-900/70 p-5 ring-1 ring-slate-700/60 shadow-soft"
    >
      <span
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 ring-1 ring-slate-700',
          accentClass,
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div>
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
    </motion.div>
  )
}
