import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bot,
  Check,
  ChevronRight,
  FileText,
  MessageCircle,
  Package,
  RotateCcw,
  Scissors,
  Search,
  X,
} from 'lucide-react'
import { EASE_OUT, riseIn, staggerContainer } from './animations'
import { cn } from '../../../lib/cn'
import { ProgressIndicator } from './components/ProgressIndicator'

type Props = {
  onRestart: () => void
}

/**
 * The conclusion choreography:
 *  - enter:    title and subtitle settle, brief pause
 *  - compare:  the two columns appear, then each comparison row fades in —
 *              left and right together, one pair at a time
 *  - pipeline: the six-step recap draws itself left to right
 *  - sentence: "This entire process is called Retrieval-Augmented
 *              Generation" …
 *  - acronym:  … and "(RAG)" pops in a beat later — the takeaway
 *  - done:     Start Again appears
 */
const PHASES = ['enter', 'compare', 'pipeline', 'sentence', 'acronym', 'done'] as const
type Phase = (typeof PHASES)[number]

const PHASE_AT_MS: Record<Exclude<Phase, 'enter'>, number> = {
  compare: 1100,
  pipeline: 4400,
  sentence: 6700,
  acronym: 7600,
  done: 8400,
}

const WITHOUT_RAG = [
  'May rely on general knowledge',
  'Can miss company-specific details',
  'May produce inaccurate answers',
]

const WITH_RAG = [
  'Uses your documents',
  'Finds the relevant information',
  'Generates grounded answers',
]

/** The whole demo in six nodes — every label echoes a screen just seen. */
const PIPELINE = [
  { icon: FileText, label: 'Documents' },
  { icon: Scissors, label: 'Split into chunks' },
  { icon: Search, label: 'Find relevant chunks' },
  { icon: Package, label: 'Question + chunks' },
  { icon: Bot, label: 'ChatGPT writes' },
  { icon: MessageCircle, label: 'Accurate response' },
]

/** Delay (s) for comparison row i — both columns share it, so pairs land together. */
const rowDelay = (i: number) => 0.35 + i * 0.65

/**
 * Screen 6: the conclusion. No new concepts — just why RAG matters (a
 * side-by-side comparison), the whole pipeline in one glance, and the
 * name for what the user just watched.
 */
export function Screen6({ onRestart }: Props) {
  const [phase, setPhase] = useState<Phase>('enter')

  useEffect(() => {
    const timeouts = (
      Object.entries(PHASE_AT_MS) as Array<[Phase, number]>
    ).map(([p, atMs]) => setTimeout(() => setPhase(p), atMs))
    return () => timeouts.forEach(clearTimeout)
  }, [])

  const reached = (p: Phase) => PHASES.indexOf(phase) >= PHASES.indexOf(p)

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-[680px] flex-col px-2"
    >
      <ProgressIndicator current={6} title="Why It Matters" />

      <div className="mt-[clamp(16px,3vh,32px)] flex flex-col items-center gap-2.5 text-center">
        <motion.h1
          variants={riseIn}
          className="max-w-xl text-balance text-[26px] font-semibold leading-[1.1] tracking-[-0.015em] text-[#1d1d1f] sm:text-[32px]"
        >
          Why RAG matters
        </motion.h1>
        <motion.p
          variants={riseIn}
          className="max-w-[56ch] text-balance text-[15px] leading-normal text-[#6e6e73] sm:text-base"
        >
          Retrieval-Augmented Generation helps ChatGPT answer using your own
          knowledge instead of relying only on what it already knows.
        </motion.p>
      </div>

      {/* Side-by-side comparison; rows land in left-right pairs. */}
      <div className="mt-[clamp(16px,3vh,28px)] min-h-[188px]">
        {reached('compare') && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="rounded-2xl border border-black/[0.08] bg-white p-4"
            >
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#86868b]">
                Without RAG
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {WITHOUT_RAG.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, ease: EASE_OUT, delay: rowDelay(i) }}
                    className="flex items-center gap-2"
                  >
                    <X className="h-3.5 w-3.5 shrink-0 text-[#e8594f]" strokeWidth={2.5} />
                    <span className="text-[13px] text-[#6e6e73]">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="rounded-2xl border border-[#0071e3]/25 bg-white p-4 shadow-[0_8px_28px_rgba(0,113,227,0.10)]"
            >
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#0071e3]">
                With RAG
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {WITH_RAG.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, ease: EASE_OUT, delay: rowDelay(i) }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#0071e3]" strokeWidth={2.5} />
                    <span className="text-[13px] font-medium text-[#1d1d1f]">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </div>

      {/* The full pipeline, drawn left to right — the demo in one glance. */}
      <div className="mt-[clamp(14px,2.5vh,24px)] flex min-h-[86px] items-start justify-center">
        {reached('pipeline') && (
          <div className="flex flex-wrap items-start justify-center gap-y-3">
            {PIPELINE.map((step, i) => (
              <div key={step.label} className="flex items-start">
                {i > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.28 - 0.1 }}
                    className="flex h-9 items-center"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-[#c7c7cc]" strokeWidth={2} />
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT, delay: i * 0.28 }}
                  className="flex w-[82px] flex-col items-center gap-1.5"
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-inset',
                      i === PIPELINE.length - 1
                        ? 'bg-[#0071e3] ring-transparent'
                        : 'bg-[#0071e3]/[0.06] ring-[#0071e3]/15',
                    )}
                  >
                    <step.icon
                      className={cn(
                        'h-4 w-4',
                        i === PIPELINE.length - 1 ? 'text-white' : 'text-[#0071e3]',
                      )}
                      strokeWidth={1.75}
                    />
                  </div>
                  <span className="text-center text-[11px] leading-tight text-[#6e6e73]">
                    {step.label}
                  </span>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* The takeaway: sentence first, acronym a beat later. */}
      <div className="mt-[clamp(10px,2vh,16px)] flex min-h-[28px] items-center justify-center text-center">
        {reached('sentence') && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="max-w-[56ch] text-balance text-[14px] font-medium text-[#1d1d1f]"
          >
            This entire process is called Retrieval-Augmented Generation
            <AnimatePresence>
              {reached('acronym') && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                  className="ml-1.5 inline-block font-semibold text-[#0071e3]"
                >
                  (RAG)
                </motion.span>
              )}
            </AnimatePresence>
            .
          </motion.p>
        )}
      </div>

      {/* Clean success ending: a single restart action. */}
      <div className="mt-[clamp(14px,2.5vh,24px)] flex min-h-[110px] flex-col items-center justify-start gap-3">
        <AnimatePresence>
          {phase === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.button
                type="button"
                onClick={onRestart}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0071e3] px-16 py-4 text-[17px] font-semibold text-white shadow-[0_8px_24px_rgba(0,113,227,0.28)] outline-none transition-[background-color,box-shadow] duration-200 hover:bg-[#0077ed] hover:shadow-[0_12px_32px_rgba(0,113,227,0.36)] focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafaf9] sm:w-auto sm:min-w-[300px]"
              >
                <RotateCcw
                  className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-rotate-45"
                  strokeWidth={2}
                />
                Start Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
