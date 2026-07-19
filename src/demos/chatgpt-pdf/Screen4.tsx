import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, MessageCircle, MessageCircleQuestion } from 'lucide-react'
import { EASE_OUT, riseIn, staggerContainer } from './animations'
import { SELECTED_CHUNKS } from './data'
import { cn } from '../../lib/cn'
import { ProgressIndicator } from './components/ProgressIndicator'
import { QuestionChip } from './components/QuestionChip'
import { NextStepButton } from './components/NextStepButton'

type Props = {
  question: string
  onNext: () => void
}

/**
 * The packaging choreography, in strictly ordered phases:
 *  - enter:    the three selected chunks arrive already grouped (continuity
 *              with Screen 3's stack) with the question above them
 *  - join:     the question flies down and docks on top of the chunks
 *  - wrap:     a container seals everything into one parcel — the inner
 *              rows go quiet while the parcel itself gains the emphasis —
 *              then a long, uninterrupted beat to read the contents
 *  - caption:  "Everything in this package becomes the prompt sent to
 *              ChatGPT." — one sentence tying the animation to the term
 *  - send:     the parcel shrinks and glides into the ChatGPT avatar
 *  - received: the avatar lights up, pops to ~110% and settles with a
 *              glow — information received, no answer yet
 *  - done:     Next Step appears; the screen waits
 */
const PHASES = [
  'enter',
  'join',
  'wrap',
  'caption',
  'send',
  'received',
  'done',
] as const
type Phase = (typeof PHASES)[number]

const PHASE_AT_MS: Record<Exclude<Phase, 'enter'>, number> = {
  join: 1400,
  wrap: 2300,
  caption: 5100,
  send: 7500,
  received: 8350,
  done: 9000,
}

/**
 * Screen 4: what actually gets sent. Purely conceptual — no tokens, no
 * context windows, no prompt formatting. The user should finish thinking
 * "ChatGPT receives only my question and the most relevant chunks."
 */
export function Screen4({ question, onNext }: Props) {
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
      <ProgressIndicator current={4} title="What Gets Sent" />

      <div className="mt-[clamp(16px,3vh,32px)] flex flex-col items-center gap-2.5 text-center">
        <motion.h1
          variants={riseIn}
          className="max-w-xl text-balance text-[26px] font-semibold leading-[1.1] tracking-[-0.015em] text-[#1d1d1f] sm:text-[32px]"
        >
          Only the relevant information is sent
        </motion.h1>
        <motion.p
          variants={riseIn}
          className="max-w-[52ch] text-balance text-[15px] leading-normal text-[#6e6e73] sm:text-base"
        >
          ChatGPT doesn&rsquo;t see every document — only your question and
          the most relevant chunks are sent.
        </motion.p>
      </div>

      {/* The question's usual slot; reserved height so nothing shifts when
          it departs to join the package. */}
      <div className="mt-[clamp(14px,2.5vh,24px)] flex min-h-[38px] items-center justify-center">
        {!reached('join') && (
          <motion.div layoutId="question-package">
            <QuestionChip question={question} />
          </motion.div>
        )}
      </div>

      {/* The package. Fixed-height wrapper keeps the captions and avatar
          below perfectly still while the contents grow. */}
      <div className="min-h-[252px]">
        <motion.div variants={riseIn} className="mx-auto mt-[clamp(10px,2vh,16px)] w-full max-w-[400px]">
          <motion.div
            animate={
              reached('send')
                ? { y: 235, scale: 0.08, opacity: 0 }
                : { y: 0, scale: 1, opacity: 1 }
            }
            transition={
              reached('send')
                ? { duration: 0.7, ease: 'easeIn' }
                : { duration: 0.3 }
            }
            className={cn(
              'rounded-2xl border p-4 transition-[background-color,border-color,box-shadow] duration-500',
              reached('wrap')
                ? 'border-[#0071e3]/30 bg-[#f7faff] shadow-[0_12px_36px_rgba(0,113,227,0.16)]'
                : 'border-transparent bg-transparent',
            )}
          >
            <AnimatePresence>
              {reached('wrap') && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-3 text-center text-[13px] font-semibold text-[#1d1d1f]"
                >
                  What Gets Sent to ChatGPT
                </motion.p>
              )}
            </AnimatePresence>

            <ul className="flex flex-col gap-1.5">
              {/* The question docks here — same shared element that left
                  its slot above, now the package's first row. */}
              {reached('join') && (
                <motion.li
                  layoutId="question-package"
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={cn(
                    'flex items-center gap-2 rounded-full border bg-[#0071e3]/[0.04] py-2 pl-3 pr-4 transition-[border-color] duration-500',
                    reached('wrap') ? 'border-black/[0.06]' : 'border-[#0071e3]/25',
                  )}
                >
                  <MessageCircleQuestion
                    className="h-4 w-4 shrink-0 text-[#0071e3]"
                    strokeWidth={1.75}
                  />
                  <span className="truncate text-[13px] font-medium text-[#1d1d1f]">
                    &ldquo;{question}&rdquo;
                  </span>
                </motion.li>
              )}

              {SELECTED_CHUNKS.map((chunk) => (
                <motion.li
                  key={chunk.id}
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 transition-[border-color,box-shadow] duration-500',
                    reached('wrap')
                      ? 'border-black/[0.06] shadow-none'
                      : 'border-[#0071e3]/25 shadow-[0_4px_14px_rgba(0,113,227,0.10)]',
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
          </motion.div>
        </motion.div>
      </div>

      {/* A single caption that ties what the user just watched directly to
          the terminology — arrives only after a long reading pause. */}
      <div className="flex min-h-[28px] flex-col items-center justify-start text-center">
        {reached('caption') && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="text-[13px] font-medium text-[#1d1d1f]"
          >
            Everything in this package becomes the{' '}
            <span className="font-semibold text-[#0071e3]">prompt</span> sent
            to ChatGPT.
          </motion.p>
        )}
      </div>

      {/* The destination: appears just before the send. On receipt it
          lights up blue, pops to ~110%, settles back, and keeps a soft
          glow — a satisfying "received" moment without an answer. */}
      <div className="mt-[clamp(8px,1.5vh,14px)] flex min-h-[68px] flex-col items-center justify-center gap-1.5">
        {reached('caption') && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, backgroundColor: '#1d1d1f' }}
              animate={
                reached('received')
                  ? {
                      opacity: 1,
                      scale: [1, 1.12, 0.98, 1],
                      backgroundColor: '#0071e3',
                      boxShadow: [
                        '0 0 0 0 rgba(0,113,227,0)',
                        '0 0 0 12px rgba(0,113,227,0.18)',
                        '0 0 0 2px rgba(0,113,227,0.08)',
                        '0 6px 20px rgba(0,113,227,0.35)',
                      ],
                    }
                  : { opacity: 1, scale: 1, backgroundColor: '#1d1d1f' }
              }
              transition={
                reached('received')
                  ? { duration: 0.75, ease: 'easeOut' }
                  : { type: 'spring', stiffness: 320, damping: 24 }
              }
              className="flex h-11 w-11 items-center justify-center rounded-full"
            >
              <MessageCircle className="h-5 w-5 text-white" strokeWidth={1.75} />
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                color: reached('received') ? '#0071e3' : '#6e6e73',
              }}
              className="text-xs font-medium"
            >
              ChatGPT
            </motion.span>
          </>
        )}
      </div>

      {/* Footer: reserved height so the button's arrival doesn't shift the
          layout. The screen pauses here until the user clicks Next Step. */}
      <div className="mt-[clamp(10px,2vh,16px)] flex min-h-[104px] flex-col items-center justify-start gap-3">
        <AnimatePresence>
          {phase === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.35 }}
              className="flex flex-col items-center gap-3"
            >
              <NextStepButton onClick={onNext} />
              <p className="text-[13px] text-[#86868b]">
                Next: watching ChatGPT write the answer
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
