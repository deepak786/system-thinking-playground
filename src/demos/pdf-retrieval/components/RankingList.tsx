import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { CANDIDATES, SORTED_CANDIDATES } from '../data'
import { EASE_OUT } from '../animations'

type Phase = 'enter' | 'fill' | 'sorted' | 'cut'

type Props = {
  /** Fires once the list has sorted and the losers have faded. */
  onSettled: () => void
}

/**
 * The Rank screen's refinement step: the 8 candidates the search kept
 * appear in shuffled order with empty bars, the bars fill, the list
 * sorts itself (layout animation), and the weak matches fade away
 * leaving the top three. The score is shown, never explained.
 */
export function RankingList({ onSettled }: Props) {
  const [phase, setPhase] = useState<Phase>('enter')

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setPhase('fill'), 800),
      setTimeout(() => setPhase('sorted'), 2700),
      setTimeout(() => setPhase('cut'), 3800),
    ]
    return () => timeouts.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (phase !== 'cut') return
    const t = setTimeout(onSettled, 900)
    return () => clearTimeout(t)
  }, [phase, onSettled])

  const rows = phase === 'enter' || phase === 'fill' ? CANDIDATES : SORTED_CANDIDATES

  return (
    <div className="flex w-full max-w-[440px] flex-col gap-2">
      <motion.p
        animate={{ opacity: phase === 'cut' ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.4 }}
        className="text-center text-[12px] font-medium uppercase tracking-[0.08em] text-[#0071e3]"
      >
        Top Matches
      </motion.p>
      {rows.map((c, i) => {
        const dropped = phase === 'cut' && !c.kept
        return (
          <motion.div
            key={c.title}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: dropped ? 0.18 : 1, y: 0 }}
            transition={{
              layout: { type: 'spring', stiffness: 260, damping: 30 },
              opacity: dropped
                ? { duration: 0.9, ease: 'easeInOut' }
                : { duration: 0.45, ease: EASE_OUT, delay: 0.06 * i },
              y: { duration: 0.45, ease: EASE_OUT, delay: 0.06 * i },
            }}
            className={cn(
              // Every row keeps the candidate glow it earned on the wall;
              // the cut upgrades the top three and dims the rest.
              'flex items-center gap-3 rounded-xl border bg-white px-4 py-2',
              phase === 'cut' && c.kept
                ? 'border-[#0071e3] bg-[#0071e3]/[0.04] shadow-[0_2px_12px_rgba(0,113,227,0.18)]'
                : 'border-[#0071e3]/25 shadow-[0_1px_6px_rgba(0,113,227,0.07)]',
              'transition-[border-color,background-color,box-shadow] duration-500',
            )}
          >
            <span className="w-[124px] shrink-0 truncate text-left text-[12px] font-medium text-[#1d1d1f]">
              {c.title}
            </span>
            <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
              <motion.span
                initial={{ width: '0%' }}
                animate={{ width: phase === 'enter' ? '0%' : `${c.score}%` }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 * i }}
                className={cn(
                  'absolute inset-y-0 left-0 rounded-full',
                  c.score >= 70 ? 'bg-[#0071e3]' : 'bg-[#a9c9ec]',
                )}
              />
            </span>
            <span
              className={cn(
                'w-10 shrink-0 text-right text-[12px] font-semibold tabular-nums',
                c.score >= 70 ? 'text-[#0071e3]' : 'text-[#a1a1a6]',
              )}
            >
              {phase === 'enter' ? '' : `${c.score}%`}
            </span>
            {phase === 'cut' && c.kept && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0071e3]"
              >
                <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
              </motion.span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
