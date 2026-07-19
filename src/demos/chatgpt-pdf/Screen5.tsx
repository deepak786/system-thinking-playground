import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, MessageCircle } from 'lucide-react'
import { EASE_OUT, riseIn, staggerContainer } from './animations'
import { DEMO_ANSWER, SELECTED_CHUNKS } from './data'
import { cn } from '../../lib/cn'
import { ProgressIndicator } from './components/ProgressIndicator'
import { QuestionChip } from './components/QuestionChip'
import { NextStepButton } from './components/NextStepButton'

type Props = {
  question: string
  onNext: () => void
}

/**
 * The generation choreography:
 *  - enter:     the ChatGPT avatar arrives already lit up — exactly the
 *               state Screen 4 left it in — and holds for a beat
 *  - thinking:  the avatar starts a slow breathing pulse and the label
 *               "ChatGPT reads the information…" fades in
 *  - reading:   the package opens as a checklist — the question and the
 *               three chunks tick in one by one, then fade back out
 *  - ponder:    the checklist is gone and only "Thinking…" remains — a
 *               deliberate beat of reasoning before anything is written
 *  - answer:    an empty chat bubble fades in, and after a moment the
 *               answer types in bursts with a human rhythm; key facts get
 *               a brief tint as they appear. The caret keeps blinking for
 *               a second after the last character — "finished writing"
 *  - generated: the caret disappears and the closing caption lands
 *  - done:      Next Step appears; the screen waits
 *
 * Phases through `answer` run on a fixed clock; everything after is
 * triggered by the typing actually finishing.
 */
const PHASES = ['enter', 'thinking', 'reading', 'ponder', 'answer', 'generated', 'done'] as const
type Phase = (typeof PHASES)[number]

const TIMED_PHASES: Partial<Record<Phase, number>> = {
  thinking: 900,
  reading: 1900,
  ponder: 4900,
  answer: 5700,
}

/** What ChatGPT "reads" when the package opens — no code, no raw prompt. */
const READING_ITEMS = [
  'Your question',
  ...SELECTED_CHUNKS.map((c) => `${c.title} — ${c.source}`),
]

/**
 * Assistant-style typing rhythm: quick bursts broken by short pauses.
 * Punctuation gets deliberate stops, and occasionally a word boundary
 * hesitates for a beat — the burst/pause cadence people associate with
 * AI assistants. Everything else is fast with jitter.
 */
function delayAfter(char: string | undefined, next: string | undefined): number {
  if (char === '\n' || next === '\n') return 40
  if (char === '.') return next === undefined ? 0 : 380
  if (char === ',') return 190
  if (char === ' ' && Math.random() < 0.1) return 240 + Math.random() * 160
  return 16 + Math.random() * 26
}

/**
 * The source-backed facts inside the answer — each gets a brief tint as
 * it types, reinforcing that the answer is built from the retrieved
 * chunks. Must be exact substrings of DEMO_ANSWER.
 */
const KEY_FACTS = [
  '18 paid vacation days',
  '1.5 days per month',
  '5 unused days',
  'manager approval',
  '11 public holidays',
]

type Segment = { start: number; end: number; isFact: boolean }

/** DEMO_ANSWER split into plain and fact segments, in order. */
const SEGMENTS: Segment[] = (() => {
  const spans = KEY_FACTS.map((fact) => {
    const start = DEMO_ANSWER.indexOf(fact)
    return { start, end: start + fact.length }
  })
    .filter((s) => s.start !== -1)
    .sort((a, b) => a.start - b.start)

  const segments: Segment[] = []
  let cursor = 0
  for (const span of spans) {
    if (span.start > cursor) {
      segments.push({ start: cursor, end: span.start, isFact: false })
    }
    segments.push({ start: span.start, end: span.end, isFact: true })
    cursor = span.end
  }
  if (cursor < DEMO_ANSWER.length) {
    segments.push({ start: cursor, end: DEMO_ANSWER.length, isFact: false })
  }
  return segments
})()

/** Roughly how long (in typed characters) a fact stays tinted. */
const FACT_TINT_CHARS = 26

/**
 * Screen 5: generation. ChatGPT reads the question together with the
 * selected chunks and writes a natural-language answer — synthesized from
 * several chunks, not copied from one. No answer mechanics, no jargon.
 */
export function Screen5({ question, onNext }: Props) {
  const [phase, setPhase] = useState<Phase>('enter')
  const [typedCount, setTypedCount] = useState(0)

  const reached = (p: Phase) => PHASES.indexOf(phase) >= PHASES.indexOf(p)
  const doneTyping = typedCount >= DEMO_ANSWER.length

  useEffect(() => {
    const timeouts = (
      Object.entries(TIMED_PHASES) as Array<[Phase, number]>
    ).map(([p, atMs]) => setTimeout(() => setPhase(p), atMs))
    return () => timeouts.forEach(clearTimeout)
  }, [])

  // Type one character at a time once the answer phase begins. The first
  // character waits a moment so the bubble is seen empty before "typing".
  useEffect(() => {
    if (!reached('answer') || doneTyping) return
    const delay =
      typedCount === 0
        ? 650
        : delayAfter(DEMO_ANSWER[typedCount - 1], DEMO_ANSWER[typedCount])
    const t = setTimeout(() => setTypedCount((c) => c + 1), delay)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, typedCount])

  // The closing beats are anchored to the typing finishing, not the clock.
  // The caret keeps blinking for ~1.1s first — "ChatGPT has finished
  // writing" — then the caption lands, then the button.
  useEffect(() => {
    if (!doneTyping) return
    const t1 = setTimeout(() => setPhase('generated'), 1100)
    const t2 = setTimeout(() => setPhase('done'), 2400)
    return () => [t1, t2].forEach(clearTimeout)
  }, [doneTyping])

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-[680px] flex-col px-2"
    >
      <ProgressIndicator current={5} title="Writing the Answer" />

      <div className="mt-[clamp(16px,3vh,32px)] flex flex-col items-center gap-2.5 text-center">
        <motion.h1
          variants={riseIn}
          className="max-w-xl text-balance text-[26px] font-semibold leading-[1.1] tracking-[-0.015em] text-[#1d1d1f] sm:text-[32px]"
        >
          Finally, ChatGPT writes the answer
        </motion.h1>
        <motion.p
          variants={riseIn}
          className="max-w-[52ch] text-balance text-[15px] leading-normal text-[#6e6e73] sm:text-base"
        >
          It reads your question together with the selected chunks — nothing
          else — and replies in plain language.
        </motion.p>
      </div>

      <motion.div
        variants={riseIn}
        className="mt-[clamp(14px,2.5vh,24px)] flex justify-center"
      >
        <QuestionChip question={question} />
      </motion.div>

      {/* The avatar, carried over lit from Screen 4. Breathes while it
          "reads"; settles once the answer starts typing. */}
      <motion.div
        variants={riseIn}
        className="mt-[clamp(14px,2.5vh,22px)] flex flex-col items-center gap-1.5"
      >
        <motion.div
          animate={
            phase === 'thinking' || phase === 'reading' || phase === 'ponder'
              ? {
                  scale: [1, 1.06, 1],
                  boxShadow: [
                    '0 6px 20px rgba(0,113,227,0.30)',
                    '0 6px 26px rgba(0,113,227,0.48)',
                    '0 6px 20px rgba(0,113,227,0.30)',
                  ],
                }
              : { scale: 1, boxShadow: '0 6px 20px rgba(0,113,227,0.30)' }
          }
          transition={
            phase === 'thinking' || phase === 'reading' || phase === 'ponder'
              ? { duration: 2, ease: 'easeInOut', repeat: Infinity }
              : { duration: 0.5, ease: 'easeOut' }
          }
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0071e3]"
        >
          <MessageCircle className="h-[22px] w-[22px] text-white" strokeWidth={1.75} />
        </motion.div>
        <span className="text-xs font-medium text-[#6e6e73]">ChatGPT</span>
      </motion.div>

      {/* Status line: reserved height. "Reads…" while the package is open,
          "Thinking…" once it closes — a beat of reasoning before writing. */}
      <div className="mt-2 flex min-h-[24px] items-center justify-center">
        <AnimatePresence mode="wait">
          {reached('thinking') && !reached('ponder') && (
            <motion.p
              key="status-reading"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="text-[13px] text-[#86868b]"
            >
              ChatGPT reads the information&hellip;
            </motion.p>
          )}
          {phase === 'ponder' && (
            <motion.p
              key="status-thinking"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="text-[13px] text-[#86868b]"
            >
              Thinking&hellip;
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Center stage: first the opened package (checklist), then the
          answer bubble. Fixed min-height so nothing below shifts. */}
      <div className="mt-1 flex min-h-[235px] flex-col items-center justify-start">
        <AnimatePresence mode="wait">
          {reached('reading') && !reached('ponder') && (
            <motion.ul
              key="reading-list"
              exit={{ opacity: 0, transition: { duration: 0.35 } }}
              className="flex flex-col gap-2 pt-2"
            >
              {READING_ITEMS.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT, delay: i * 0.42 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#0071e3]" strokeWidth={2.5} />
                  <span className="text-[13px] font-medium text-[#1d1d1f]">
                    {item}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          )}

          {reached('answer') && (
            <motion.div
              key="answer-bubble"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="w-full max-w-[480px] rounded-2xl rounded-tl-md border border-black/[0.06] bg-white px-5 py-4 shadow-[0_4px_18px_rgba(0,0,0,0.05)]"
            >
              <p className="min-h-[150px] whitespace-pre-line text-[14px] leading-relaxed text-[#1d1d1f]">
                {SEGMENTS.map((seg) => {
                  if (typedCount <= seg.start) return null
                  const text = DEMO_ANSWER.slice(
                    seg.start,
                    Math.min(typedCount, seg.end),
                  )
                  if (!seg.isFact) return <span key={seg.start}>{text}</span>
                  // Tinted while freshly typed; settles to medium weight.
                  const fresh =
                    !doneTyping && typedCount < seg.end + FACT_TINT_CHARS
                  return (
                    <span
                      key={seg.start}
                      className={cn(
                        'rounded font-medium transition-colors duration-300',
                        fresh
                          ? 'bg-[#0071e3]/10 text-[#0071e3]'
                          : 'bg-transparent text-[#1d1d1f]',
                      )}
                    >
                      {text}
                    </span>
                  )
                })}
                {!reached('generated') && reached('answer') && (
                  <motion.span
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                    className="ml-px inline-block h-[1em] w-[2px] translate-y-[2px] rounded-full bg-[#0071e3]"
                  />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* One closing caption: success and lesson in a single line. */}
      <div className="flex min-h-[40px] flex-col items-center justify-start text-center">
        {reached('generated') && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="max-w-[52ch] text-balance text-[13px] font-medium text-[#0071e3]"
          >
            <Check
              className="mr-1 inline-block h-3.5 w-3.5 -translate-y-px"
              strokeWidth={2.5}
            />
            ChatGPT generated this answer using only the retrieved
            information.
          </motion.p>
        )}
      </div>

      {/* Footer: reserved height; waits for the user. */}
      <div className="mt-[clamp(10px,2vh,16px)] flex min-h-[104px] flex-col items-center justify-start gap-3">
        <AnimatePresence>
          {phase === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.3 }}
              className="flex flex-col items-center gap-3"
            >
              <NextStepButton onClick={onNext} />
              <p className="text-[13px] text-[#86868b]">
                Next: why this approach matters
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
