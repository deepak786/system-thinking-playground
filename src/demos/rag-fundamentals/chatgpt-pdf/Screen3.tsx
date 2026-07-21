import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Search, Send } from 'lucide-react'
import { EASE_OUT, riseIn, staggerContainer } from './animations'
import {
  CHUNKS,
  RELEVANT_CHUNK_COUNT,
  RELEVANT_MIN_SCORE,
  TOTAL_CHUNK_COUNT,
} from './data'
import { cn } from '../../../lib/cn'
import { useLiteMotion } from '../../../lib/useLiteMotion'
import { ProgressIndicator } from './components/ProgressIndicator'
import { QuestionChip } from './components/QuestionChip'
import { RetrievalCard, type RetrievalMode } from './components/RetrievalCard'
import { NextStepButton } from './components/NextStepButton'

type Props = {
  question: string
  onNext: () => void
}

/**
 * The retrieval choreography:
 *  - enter:    header, question, and the chunks from step 2 settle in
 *  - checking: the question glides down toward the collection and hops
 *              across the chunks, one quick check at a time
 *  - results:  all verdicts land together — three ranked visually, the
 *              rest fade to gray — and the tally is shown
 *  - gather:   the rejected cards fade away and the three selected chunks
 *              fly together into a small stack: "these — and only these —
 *              are what ChatGPT will receive"
 *  - done:     Next Step appears; the screen waits for the user
 */
type Phase =
  | { kind: 'enter' }
  | { kind: 'checking'; index: number }
  | { kind: 'results' }
  | { kind: 'gather' }
  | { kind: 'done' }

const CHECK_START_MS = 1600
/** Quick hops — the question examines chunks, it doesn't deliberate. */
const CHECK_MS = 160
const RESULTS_AT_MS = CHECK_START_MS + CHUNKS.length * CHECK_MS + 150
/** Hold on the ranked grid long enough to read the tally, then gather. */
const GATHER_AT_MS = RESULTS_AT_MS + 1700
const DONE_AT_MS = GATHER_AT_MS + 1000

/**
 * Relevant chunks ranked by how well they match (best first), so emphasis
 * can be purely visual — no numbers anywhere.
 */
const RANKS: ReadonlyMap<number, 'rank1' | 'rank2' | 'rank3'> = new Map(
  CHUNKS.filter((c) => c.matchScore >= RELEVANT_MIN_SCORE)
    .sort((a, b) => b.matchScore - a.matchScore)
    .map((c, i) => [c.id, `rank${i + 1}` as 'rank1' | 'rank2' | 'rank3']),
)

/** Rank badges pop weakest-first, building up to the best match. */
const CHIP_DELAY: Record<'rank1' | 'rank2' | 'rank3', number> = {
  rank3: 0,
  rank2: 0.2,
  rank1: 0.45,
}

/**
 * Screen 3: retrieval, kept entirely visual — no embedding or vector talk.
 * The user should finish thinking "ChatGPT doesn't read everything; it
 * first finds the most relevant pieces."
 */
export function Screen3({ question, onNext }: Props) {
  const lite = useLiteMotion()
  const [phase, setPhase] = useState<Phase>({ kind: 'enter' })

  useEffect(() => {
    const timeouts = [
      ...CHUNKS.map((_, i) =>
        setTimeout(
          () => setPhase({ kind: 'checking', index: i }),
          CHECK_START_MS + i * CHECK_MS,
        ),
      ),
      setTimeout(() => setPhase({ kind: 'results' }), RESULTS_AT_MS),
      setTimeout(() => setPhase({ kind: 'gather' }), GATHER_AT_MS),
      setTimeout(() => setPhase({ kind: 'done' }), DONE_AT_MS),
    ]
    return () => timeouts.forEach(clearTimeout)
  }, [])

  const gathered = phase.kind === 'gather' || phase.kind === 'done'

  // During the pass, only the card under the question lights up; every
  // verdict lands together afterwards — one search, then one decision.
  const cardMode = (i: number): RetrievalMode => {
    if (phase.kind === 'checking') {
      return i === phase.index ? 'checking' : 'idle'
    }
    if (phase.kind === 'results') {
      return RANKS.get(CHUNKS[i].id) ?? 'rejected'
    }
    if (gathered) {
      // Ranked cards leave for the stack; rejected ones fade out in place
      // (still mounted, so the grid never reflows).
      return 'gone'
    }
    return 'idle'
  }

  const isChecking = phase.kind === 'checking'
  const showResults = phase.kind === 'results'

  /** The selected chunks, best match first — the stack's top-down order. */
  const selectedChunks = CHUNKS.filter((c) => RANKS.has(c.id)).sort(
    (a, b) => b.matchScore - a.matchScore,
  )

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-[680px] flex-col px-2"
    >
      <ProgressIndicator current={3} title="Finding Relevant Chunks" />

      <div className="mt-[clamp(16px,3vh,32px)] flex flex-col items-center gap-2.5 text-center">
        <motion.h1
          variants={riseIn}
          className="max-w-xl text-balance text-[26px] font-semibold leading-[1.1] tracking-[-0.015em] text-[#1d1d1f] sm:text-[32px]"
        >
          Next, ChatGPT finds the chunks that match your question
        </motion.h1>
        <motion.p
          variants={riseIn}
          className="max-w-[52ch] text-balance text-[15px] leading-normal text-[#6e6e73] sm:text-base"
        >
          It doesn&rsquo;t read all {TOTAL_CHUNK_COUNT} pieces — every chunk is
          quickly checked against your question, and only the best matches
          move on.
        </motion.p>
      </div>

      {/* The question physically reaches down toward the collection while
          checking — it is the thing doing the searching. */}
      <motion.div
        animate={isChecking ? { y: 10 } : { y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className={cn(
          'mt-[clamp(14px,2.5vh,24px)] transition-shadow duration-300',
          isChecking && 'drop-shadow-[0_6px_14px_rgba(0,113,227,0.25)]',
        )}
      >
        <QuestionChip question={question} />
      </motion.div>

      {/* Live status label narrating the search. */}
      <motion.div
        variants={riseIn}
        className="mt-[clamp(10px,2vh,16px)] flex items-center justify-center gap-1.5 text-[13px] text-[#86868b]"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={phase.kind === 'checking' ? 'checking' : gathered ? 'gathered' : phase.kind}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'flex items-center gap-1.5',
              (showResults || gathered) && 'font-medium text-[#1d1d1f]',
            )}
          >
            {phase.kind === 'enter' && (
              <>
                <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
                {TOTAL_CHUNK_COUNT} chunks ready to search
              </>
            )}
            {isChecking && (
              <>
                <Search className="h-3.5 w-3.5 animate-pulse text-[#0071e3]" strokeWidth={1.75} />
                Checking each chunk against your question…
              </>
            )}
            {showResults && (
              <>
                <Check className="h-3.5 w-3.5 text-[#0071e3]" strokeWidth={2.5} />
                {RELEVANT_CHUNK_COUNT} relevant chunks found — the other{' '}
                {TOTAL_CHUNK_COUNT - RELEVANT_CHUNK_COUNT} were skipped
              </>
            )}
            {gathered && (
              <>
                <Send className="h-3.5 w-3.5 text-[#0071e3]" strokeWidth={1.75} />
                These chunks will be sent to ChatGPT
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* The chunk collection from step 2, in the same 3+2 arrangement.
          At gather, the selected cards fly out of the grid into a small
          centered stack (shared-element flights) — visibly the same cards
          regrouping, ready to be handed to ChatGPT. */}
      <div className="relative mt-[clamp(12px,2vh,20px)]">
        <ul className="grid min-h-[228px] grid-cols-3 content-start gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {CHUNKS.map((chunk, i) => {
            const mode = cardMode(i)
            const placement = cn(
              'col-span-3 sm:col-span-2',
              i === 3 && 'lg:col-start-2',
              i === 4 && 'sm:col-start-2 lg:col-start-auto',
            )
            // Selected cards leave for the stack; an invisible placeholder
            // holds their grid slot so nothing else moves.
            if (gathered && RANKS.has(chunk.id)) {
              return <li key={chunk.id} aria-hidden className={cn(placement, 'invisible')} />
            }
            return (
              <RetrievalCard
                key={chunk.id}
                chunk={chunk}
                mode={mode}
                delay={0.35 + i * 0.08}
                chipDelay={
                  mode === 'rank1' || mode === 'rank2' || mode === 'rank3'
                    ? CHIP_DELAY[mode]
                    : 0
                }
                layoutId={`retrieval-${chunk.id}`}
                className={placement}
              />
            )
          })}
        </ul>

        {/* The selection stack: compact rows, best match on top. */}
        {gathered && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <ul className="flex w-[320px] max-w-full flex-col">
              {selectedChunks.map((chunk, i) => (
                <motion.li
                  key={chunk.id}
                  layoutId={lite ? undefined : `retrieval-${chunk.id}`}
                  initial={lite ? { opacity: 0, y: 8 } : false}
                  animate={lite ? { opacity: 1, y: 0 } : undefined}
                  transition={{
                    layout: {
                      type: 'spring',
                      stiffness: 320,
                      damping: 30,
                      delay: lite ? 0 : i * 0.08,
                    },
                    duration: 0.2,
                    delay: lite ? i * 0.05 : 0,
                  }}
                  style={{ zIndex: selectedChunks.length - i }}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border border-[#0071e3]/25 bg-white px-3.5 py-2.5 shadow-[0_4px_14px_rgba(0,113,227,0.10)]',
                    i > 0 && '-mt-1.5',
                  )}
                >
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#0071e3]" strokeWidth={2.5} />
                  <span className="truncate text-[13px] font-semibold text-[#1d1d1f]">
                    {chunk.title}
                  </span>
                  <span className="ml-auto shrink-0 truncate text-[11px] text-[#86868b]">
                    {chunk.source}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer: reserved height so the button's arrival doesn't shift the
          layout. The screen pauses here until the user clicks Next Step. */}
      <div className="mt-[clamp(12px,2vh,20px)] flex min-h-[104px] flex-col items-center justify-start gap-3">
        <AnimatePresence>
          {phase.kind === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="flex flex-col items-center gap-3"
            >
              <NextStepButton onClick={onNext} />
              <p className="text-[13px] text-[#86868b]">
                Next: building the message ChatGPT receives
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
