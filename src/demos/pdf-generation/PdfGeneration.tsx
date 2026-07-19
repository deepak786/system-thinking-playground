import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { ArrowRight, Check, Plus, RotateCcw } from 'lucide-react'
import { cn } from '../../lib/cn'
import { demoPathById } from '../paths'
import { EASE_OUT, staggerContainer } from './animations'
import {
  INFO_CHUNKS,
  LEARNED,
  PIPELINE,
  RAG_PARTS,
  SENTENCE_WORDS,
  TOTAL_WORDS,
} from './data'
import { StepHeader } from './components/StepHeader'
import { QuestionCard } from './components/QuestionCard'
import { ContextPackage } from './components/ContextPackage'
import { ChatGPTCard } from './components/ChatGPTCard'
import { InfoCard, type ReadState } from './components/InfoCard'
import { GeneratedAnswer } from './components/GeneratedAnswer'
import { PipelineSummary } from './components/PipelineSummary'
import { NavigationFooter } from './components/NavigationFooter'

/**
 * Episode 5 — the finale of the "RAG Fundamentals" playlist. One
 * learning objective: once ChatGPT receives the question and the
 * relevant information, it reads that information and writes a
 * natural-language answer. Receive → Read → Generate → Summary, ending
 * with the whole pipeline and the plain-language definition of RAG.
 */
type Stage = 'receive' | 'read' | 'generate' | 'summary'

const HEADERS: Record<
  Stage,
  { step: number; name: string; title: string; subtitle: string }
> = {
  receive: {
    step: 1,
    name: 'Receive',
    title: 'ChatGPT receives the context',
    subtitle: 'One package: your question and the relevant information.',
  },
  read: {
    step: 2,
    name: 'Read',
    title: 'ChatGPT reads the information',
    subtitle: 'No searching, no magic — just careful reading.',
  },
  generate: {
    step: 3,
    name: 'Generate',
    title: 'The answer begins to take shape',
    subtitle: 'Every sentence comes from the information provided.',
  },
  summary: {
    step: 4,
    name: 'Summary',
    title: 'The complete journey',
    subtitle: 'From a 320-page PDF to one clear answer.',
  },
}

export function PdfGeneration() {
  const [stage, setStage] = useState<Stage>('receive')
  const [receiveBeat, setReceiveBeat] = useState(0)
  const [readIndex, setReadIndex] = useState(-1)
  const [wordCount, setWordCount] = useState(0)
  const [typingDone, setTypingDone] = useState(false)
  const [generateDone, setGenerateDone] = useState(false)
  const [summaryBeat, setSummaryBeat] = useState(0)
  const [pipeCount, setPipeCount] = useState(0)

  // Receive: the package arrives → ChatGPT appears → delivery.
  useEffect(() => {
    if (stage !== 'receive') {
      setReceiveBeat(0)
      return
    }
    const timeouts = [
      setTimeout(() => setReceiveBeat(1), 1700),
      setTimeout(() => setReceiveBeat(2), 2900),
      setTimeout(() => setReceiveBeat(3), 4000),
    ]
    return () => timeouts.forEach(clearTimeout)
  }, [stage])

  // Read: the package opens; each card is read one at a time.
  useEffect(() => {
    if (stage !== 'read') {
      setReadIndex(-1)
      return
    }
    const timeouts = INFO_CHUNKS.map((_, i) =>
      setTimeout(() => setReadIndex(i), 1500 + i * 1000),
    )
    timeouts.push(
      setTimeout(() => setReadIndex(INFO_CHUNKS.length), 1500 + INFO_CHUNKS.length * 1000),
    )
    return () => timeouts.forEach(clearTimeout)
  }, [stage])

  // Generate: the answer streams out word by word.
  useEffect(() => {
    if (stage !== 'generate') {
      setWordCount(0)
      setTypingDone(false)
      setGenerateDone(false)
      return
    }
    const timeouts: ReturnType<typeof setTimeout>[] = []
    let interval: ReturnType<typeof setInterval> | undefined
    timeouts.push(
      setTimeout(() => {
        let n = 0
        interval = setInterval(() => {
          n += 1
          setWordCount(n)
          if (n >= TOTAL_WORDS) {
            clearInterval(interval)
            timeouts.push(
              setTimeout(() => setTypingDone(true), 900),
              setTimeout(() => setGenerateDone(true), 1300),
            )
          }
        }, 105)
      }, 1300),
    )
    return () => {
      timeouts.forEach(clearTimeout)
      if (interval) clearInterval(interval)
    }
  }, [stage])

  // Summary: pipeline stops appear → pause → a bracket frames the whole
  // pipeline and names it (RAG) → plain-language formula → the "what you
  // learned" checklist → celebration → CTAs.
  useEffect(() => {
    if (stage !== 'summary') {
      setSummaryBeat(0)
      setPipeCount(0)
      return
    }
    const timeouts: ReturnType<typeof setTimeout>[] = PIPELINE.map((_, i) =>
      setTimeout(() => setPipeCount(i + 1), 700 + i * 450),
    )
    const pipelineDone = 700 + PIPELINE.length * 450
    timeouts.push(
      setTimeout(() => setSummaryBeat(1), pipelineDone + 700),
      setTimeout(() => setSummaryBeat(2), pipelineDone + 1800),
      setTimeout(() => setSummaryBeat(3), pipelineDone + 3000),
      setTimeout(() => setSummaryBeat(4), pipelineDone + 4700),
      setTimeout(() => setSummaryBeat(5), pipelineDone + 5600),
    )
    return () => timeouts.forEach(clearTimeout)
  }, [stage])

  // Which sentence is being written right now (drives the twin pulses).
  let pulseIndex = -1
  if (stage === 'generate' && wordCount > 0 && !typingDone) {
    let seen = 0
    for (let i = 0; i < SENTENCE_WORDS.length; i += 1) {
      seen += SENTENCE_WORDS[i].length
      if (wordCount <= seen) {
        pulseIndex = i
        break
      }
    }
  }

  const readState = (i: number): ReadState =>
    readIndex > i ? 'read' : readIndex === i ? 'reading' : 'idle'
  const allRead = stage === 'read' && readIndex >= INFO_CHUNKS.length
  const header = HEADERS[stage]

  const restart = () => setStage('receive')

  return (
    <MotionConfig reducedMotion="user">
      <div className="-m-4 flex min-h-full flex-col justify-center rounded-3xl bg-[#fafaf9] px-5 py-[clamp(16px,2.5vh,28px)] sm:px-8 lg:-m-6">
        <div className="mx-auto flex w-full max-w-[680px] flex-col px-2">
          {/* Header crossfades between steps; the canvas below persists. */}
          <div className="min-h-[128px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={header.step}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
              >
                <StepHeader
                  step={header.step}
                  name={header.name}
                  title={header.title}
                  subtitle={header.subtitle}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* The canvas. */}
          <div className="flex min-h-[320px] flex-col items-center justify-start gap-4">
            {stage === 'receive' && (
              <div className="flex w-full flex-col items-center gap-5">
                <motion.div
                  animate={
                    receiveBeat >= 2
                      ? { y: 110, scale: 0.4, opacity: 0 }
                      : { y: 0, scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.8, ease: EASE_OUT }}
                  className="flex w-full justify-center"
                >
                  <ContextPackage />
                </motion.div>
                <AnimatePresence>
                  {receiveBeat >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                    >
                      <ChatGPTCard active={receiveBeat >= 2} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {stage === 'read' && (
              <div className="flex w-full flex-col items-center gap-3">
                <ChatGPTCard active={readIndex >= 0 && readIndex < INFO_CHUNKS.length} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.2 }}
                >
                  <QuestionCard />
                </motion.div>
                <div className="flex w-full flex-col items-center gap-2">
                  {INFO_CHUNKS.map((chunk, i) => (
                    <motion.div
                      key={chunk.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        ease: EASE_OUT,
                        delay: 0.4 + i * 0.12,
                      }}
                      className="flex w-full justify-center"
                    >
                      <InfoCard chunk={chunk} state={readState(i)} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {stage === 'generate' && (
              <div className="flex w-full flex-col items-center gap-4">
                <QuestionCard />
                <div className="grid w-full gap-4 sm:grid-cols-2">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#86868b]">
                      Relevant information
                    </span>
                    {INFO_CHUNKS.map((chunk, i) => (
                      <InfoCard
                        key={chunk.title}
                        chunk={chunk}
                        state="read"
                        pulsing={i === pulseIndex}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#86868b]">
                      Generated answer
                    </span>
                    <GeneratedAnswer
                      wordCount={wordCount}
                      pulseIndex={pulseIndex}
                      typingDone={typingDone}
                    />
                  </div>
                </div>
              </div>
            )}

            {stage === 'summary' && (
              <div className="flex w-full flex-col items-center gap-5">
                {/* The bracket: once the viewer has watched the whole
                    pipeline, a frame draws around it and *names* the
                    process they already understand. */}
                <div
                  className={cn(
                    'relative rounded-2xl border-2 px-5 pb-5 transition-all duration-700',
                    summaryBeat >= 1
                      ? 'border-[#0071e3]/40 bg-white pt-7 shadow-[0_10px_32px_rgba(0,113,227,0.10)]'
                      : 'border-transparent pt-5',
                  )}
                >
                  <AnimatePresence>
                    {summaryBeat >= 1 && (
                      <motion.span
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.25 }}
                        className="absolute -top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#0071e3]/40 bg-[#fafaf9] px-4 py-1 text-[12px] font-semibold text-[#0071e3] shadow-[0_2px_10px_rgba(0,113,227,0.14)]"
                      >
                        Retrieval-Augmented Generation (RAG)
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <PipelineSummary visibleCount={pipeCount} />
                </div>

                {/* The plain-language expansion of the label. */}
                <AnimatePresence>
                  {summaryBeat >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                      className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2"
                    >
                      <span className="mr-1 text-[12px] text-[#86868b]">
                        is simply
                      </span>
                      {RAG_PARTS.map((part, i) => (
                        <span key={part} className="flex items-center gap-2">
                          {i > 0 && (
                            <Plus className="h-3.5 w-3.5 text-[#a1a1a6]" strokeWidth={2} />
                          )}
                          <motion.span
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.45,
                              ease: EASE_OUT,
                              delay: 0.15 + i * 0.2,
                            }}
                            className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-[#1d1d1f] shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                          >
                            {part}
                          </motion.span>
                        </span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* The achievement checklist — one line per video. */}
                <AnimatePresence>
                  {summaryBeat >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                      className="flex w-full max-w-[380px] flex-col gap-2.5 rounded-2xl border border-black/[0.08] bg-white px-6 py-5 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
                    >
                      <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#86868b]">
                        In this playlist you learned
                      </span>
                      {LEARNED.map((item, i) => (
                        <motion.span
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.45,
                            ease: EASE_OUT,
                            delay: 0.25 + i * 0.3,
                          }}
                          className="flex items-center gap-2.5 text-[13.5px] font-medium text-[#1d1d1f]"
                        >
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              duration: 0.35,
                              ease: EASE_OUT,
                              delay: 0.35 + i * 0.3,
                            }}
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#34c759]/12"
                          >
                            <Check className="h-3 w-3 text-[#34c759]" strokeWidth={3} />
                          </motion.span>
                          {item}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Status zone: one message per stage, crossfading. */}
          <div className="mt-3 flex min-h-[56px] items-start justify-center">
            <AnimatePresence mode="wait">
              {stage === 'receive' && receiveBeat >= 3 && (
                <motion.p
                  key="receive-msg"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="text-[15px] font-medium text-[#1d1d1f]"
                >
                  ChatGPT now has{' '}
                  <span className="font-semibold text-[#0071e3]">
                    everything it needs
                  </span>
                  .
                </motion.p>
              )}

              {stage === 'read' && allRead && (
                <motion.p
                  key="read-msg"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.4 }}
                  className="max-w-[50ch] text-balance text-center text-[15px] font-medium text-[#1d1d1f]"
                >
                  ChatGPT understands the relationship between{' '}
                  <span className="font-semibold text-[#0071e3]">your question</span>{' '}
                  and the information provided.
                </motion.p>
              )}

              {stage === 'generate' && generateDone && (
                <motion.p
                  key="generate-msg"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="max-w-[48ch] text-balance text-center text-[15px] font-medium text-[#1d1d1f]"
                >
                  ChatGPT combines the relevant information into{' '}
                  <span className="font-semibold text-[#0071e3]">one clear answer</span>.
                </motion.p>
              )}

              {stage === 'summary' && summaryBeat >= 4 && (
                <motion.div
                  key="summary-msg"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <p className="max-w-[46ch] text-balance text-center text-[17px] font-semibold text-[#1d1d1f]">
                    🎉 You now understand how AI answers questions about your PDF.
                  </p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.35 }}
                    className="max-w-[52ch] text-balance text-center text-[13px] text-[#86868b]"
                  >
                    You&rsquo;ve learned the complete Retrieval-Augmented Generation
                    (RAG) workflow.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {stage === 'receive' && (
            <NavigationFooter
              visible={receiveBeat >= 3}
              onNext={() => setStage('read')}
            />
          )}
          {stage === 'read' && (
            <NavigationFooter visible={allRead} onNext={() => setStage('generate')} />
          )}
          {stage === 'generate' && (
            <NavigationFooter
              visible={generateDone}
              onNext={() => setStage('summary')}
            />
          )}

          {stage === 'summary' && (
            <div className="mt-[clamp(12px,2vh,20px)] flex min-h-[120px] flex-col items-center justify-start gap-3">
              {summaryBeat >= 5 && (
                <>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link
                        to={demoPathById('chatgpt-pdf')}
                        className="group flex items-center justify-center gap-2 rounded-2xl bg-[#0071e3] px-7 py-3 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(0,113,227,0.28)] outline-none transition-[background-color,box-shadow] duration-200 hover:bg-[#0077ed] hover:shadow-[0_12px_32px_rgba(0,113,227,0.36)] focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafaf9]"
                      >
                        <RotateCcw className="h-4 w-4" strokeWidth={2} />
                        Replay playlist
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 }}
                      className="flex items-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-6 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
                    >
                      <span className="text-[13px] text-[#86868b]">Next series</span>
                      <span className="text-[14px] font-semibold text-[#1d1d1f]">
                        Embeddings Fundamentals
                      </span>
                      <ArrowRight className="h-4 w-4 text-[#a1a1a6]" strokeWidth={2} />
                    </motion.div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={restart}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-medium text-[#6e6e73] outline-none transition-colors duration-200 hover:text-[#1d1d1f] focus-visible:ring-2 focus-visible:ring-[#0071e3]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                    Replay demo
                  </motion.button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  )
}
