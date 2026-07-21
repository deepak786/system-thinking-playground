import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { RagMotion } from '../shared/RagMotion'
import { useOptionalLayoutId } from '../../../lib/useLiteMotion'
import { ArrowRight, Package, Plus, RotateCcw, Send } from 'lucide-react'
import { demoPathById } from '../../paths'
import { EASE_OUT, SPRING, staggerContainer } from './animations'
import {
  ALL_CHUNKS,
  SELECTED_CHUNKS,
  SELECTED_SET,
  SENTENCE_WORDS,
  TOTAL_WORDS,
} from './data'
import { StepHeader } from './components/StepHeader'
import { PDFCard } from './components/PDFCard'
import { QuestionCard } from './components/QuestionCard'
import { ChunkCard } from './components/ChunkCard'
import { ContextContainer } from './components/ContextContainer'
import { SealedPackage } from './components/SealedPackage'
import { InformationPanel } from './components/InformationPanel'
import { ChatGPTCard } from './components/ChatGPTCard'
import { AnswerCard } from './components/AnswerCard'
import { NavigationFooter } from './components/NavigationFooter'

/**
 * Episode 4 of the "How AI Works" series: what does ChatGPT actually
 * receive? The demo plays like preparing a package for mailing — the PDF
 * splits (recap), three chunks survive, the question and the chunks are
 * assembled into one parcel, the parcel opens into plain readable
 * information, gets delivered to ChatGPT, and the answer is written
 * sentence by sentence with each sentence pulsing alongside the snippet
 * it came from. No prompt/token/context-window terminology anywhere.
 */
type Stage = 'select' | 'assemble' | 'send' | 'answer'

const HEADERS: Record<
  Stage,
  { step: number; name: string; title: string; subtitle: string }
> = {
  select: {
    step: 1,
    name: 'Selected Chunks',
    title: 'Your PDF never reaches ChatGPT',
    subtitle: 'Only a tiny part of it ever leaves.',
  },
  assemble: {
    step: 2,
    name: 'Assemble',
    title: 'Everything is assembled together',
    subtitle: 'Multiple pieces become one package.',
  },
  send: {
    step: 3,
    name: 'Send',
    title: 'This is what ChatGPT receives',
    subtitle: 'Plain, readable information — nothing else.',
  },
  answer: {
    step: 4,
    name: 'Answer',
    title: 'Now ChatGPT can answer',
    subtitle: 'Watch where each sentence comes from.',
  },
}

/** After the answer lands, the headline becomes the cliffhanger. */
const ENDING_HEADER = {
  step: 4,
  name: 'Answer',
  title: 'How does ChatGPT generate the answer?',
  subtitle: 'We\u2019ll answer that in the next video.',
}

export function PdfContext() {
  const pdfShellId = useOptionalLayoutId('pdf-shell')
  const [stage, setStage] = useState<Stage>('select')
  const [selectBeat, setSelectBeat] = useState(0)
  const [assembleBeat, setAssembleBeat] = useState(0)
  const [sendBeat, setSendBeat] = useState(0)
  const [thinking, setThinking] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [typingDone, setTypingDone] = useState(false)
  const [answerDone, setAnswerDone] = useState(false)
  const [endingQuestion, setEndingQuestion] = useState(false)
  const [showTeaser, setShowTeaser] = useState(false)

  // Select: PDF → question → split into 12 chunks → 3 highlighted, 9 fade.
  useEffect(() => {
    if (stage !== 'select') {
      setSelectBeat(0)
      return
    }
    const timeouts = [
      setTimeout(() => setSelectBeat(1), 1000),
      setTimeout(() => setSelectBeat(2), 2100),
      setTimeout(() => setSelectBeat(3), 3400),
      setTimeout(() => setSelectBeat(4), 4700),
    ]
    return () => timeouts.forEach(clearTimeout)
  }, [stage])

  // Assemble: pieces spread out → glide into one open parcel → the
  // parcel compresses shut and gets its seal.
  useEffect(() => {
    if (stage !== 'assemble') {
      setAssembleBeat(0)
      return
    }
    const timeouts = [
      setTimeout(() => setAssembleBeat(1), 1500),
      setTimeout(() => setAssembleBeat(2), 3100),
      setTimeout(() => setAssembleBeat(3), 4100),
    ]
    return () => timeouts.forEach(clearTimeout)
  }, [stage])

  // Send: the sealed parcel opens for inspection → ChatGPT appears →
  // the parcel reseals → delivery → ChatGPT lights up.
  useEffect(() => {
    if (stage !== 'send') {
      setSendBeat(0)
      return
    }
    const timeouts = [
      setTimeout(() => setSendBeat(1), 1100),
      setTimeout(() => setSendBeat(2), 3100),
      setTimeout(() => setSendBeat(3), 4300),
      setTimeout(() => setSendBeat(4), 5300),
      setTimeout(() => setSendBeat(5), 6400),
    ]
    return () => timeouts.forEach(clearTimeout)
  }, [stage])

  // Answer: thinking dots, then the reply streams out word by word —
  // the in-progress sentence pulses together with its source snippet.
  useEffect(() => {
    if (stage !== 'answer') {
      setThinking(false)
      setWordCount(0)
      setTypingDone(false)
      setAnswerDone(false)
      setEndingQuestion(false)
      setShowTeaser(false)
      return
    }
    const timeouts: ReturnType<typeof setTimeout>[] = []
    let interval: ReturnType<typeof setInterval> | undefined
    timeouts.push(setTimeout(() => setThinking(true), 700))
    timeouts.push(
      setTimeout(() => {
        setThinking(false)
        let n = 0
        interval = setInterval(() => {
          n += 1
          setWordCount(n)
          if (n >= TOTAL_WORDS) {
            clearInterval(interval)
            timeouts.push(
              setTimeout(() => setTypingDone(true), 900),
              setTimeout(() => setAnswerDone(true), 1300),
              setTimeout(() => setEndingQuestion(true), 2700),
              setTimeout(() => setShowTeaser(true), 3600),
            )
          }
        }, 105)
      }, 2200),
    )
    return () => {
      timeouts.forEach(clearTimeout)
      if (interval) clearInterval(interval)
    }
  }, [stage])

  // Which sentence is being written right now (drives the twin pulses).
  let pulseIndex = -1
  if (stage === 'answer' && wordCount > 0 && !typingDone) {
    let seen = 0
    for (let i = 0; i < SENTENCE_WORDS.length; i += 1) {
      seen += SENTENCE_WORDS[i].length
      if (wordCount <= seen) {
        pulseIndex = i
        break
      }
    }
  }

  const header = endingQuestion ? ENDING_HEADER : HEADERS[stage]
  const split = stage === 'select' && selectBeat >= 2
  const chosen = stage === 'select' && selectBeat >= 3

  const restart = () => setStage('select')

  return (
    <RagMotion>
      <div className="-m-4 flex min-h-full flex-col justify-center rounded-3xl bg-[#fafaf9] px-5 py-[clamp(16px,2.5vh,28px)] sm:px-8 lg:-m-6">
        <div className="mx-auto flex w-full max-w-[680px] flex-col px-2">
          {/* Header crossfades between steps; the canvas below persists. */}
          <div className="min-h-[128px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${header.step}-${header.title}`}
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

          {/* The canvas: PDF → chunks → parcel → panel → answer. */}
          <div className="flex min-h-[330px] flex-col items-center justify-start gap-4">
            {stage === 'select' && (
              <>
                {!split ? (
                  <PDFCard />
                ) : (
                  <motion.ul
                    layoutId={pdfShellId}
                    transition={SPRING}
                    className="grid w-full max-w-[480px] grid-cols-2 gap-2 rounded-2xl sm:grid-cols-4"
                  >
                    {ALL_CHUNKS.map((title, i) => {
                      const isSelected = SELECTED_SET.has(title)
                      return (
                        <motion.li
                          key={title}
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            ease: EASE_OUT,
                            delay: 0.15 + i * 0.05,
                          }}
                          className="min-w-0"
                        >
                          <ChunkCard
                            title={title}
                            selected={isSelected}
                            highlighted={chosen && isSelected}
                            faded={chosen && !isSelected}
                          />
                        </motion.li>
                      )
                    })}
                  </motion.ul>
                )}
                <AnimatePresence>
                  {selectBeat >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                    >
                      <QuestionCard />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {stage === 'assemble' &&
              (assembleBeat < 1 ? (
                // Spread: the four ingredients, still separate pieces.
                <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
                  <QuestionCard />
                  <div className="flex flex-col items-center gap-2">
                    {SELECTED_CHUNKS.map((chunk) => (
                      <ChunkCard
                        key={chunk.title}
                        title={chunk.title}
                        selected
                        highlighted
                      />
                    ))}
                  </div>
                </div>
              ) : assembleBeat < 2 ? (
                // Assembled: the same cards glide into one labelled parcel.
                <ContextContainer>
                  <QuestionCard mini />
                  <div className="flex w-full flex-col items-center gap-1.5">
                    {SELECTED_CHUNKS.map((chunk) => (
                      <ChunkCard
                        key={chunk.title}
                        title={chunk.title}
                        selected
                        highlighted
                        mini
                      />
                    ))}
                  </div>
                </ContextContainer>
              ) : (
                // Sealed: the open parcel compresses shut and gets stamped.
                <SealedPackage />
              ))}

            {stage === 'send' && (
              <div className="flex w-full flex-col items-center gap-5">
                <motion.div
                  animate={
                    sendBeat >= 4
                      ? { y: 110, scale: 0.4, opacity: 0 }
                      : { y: 0, scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.8, ease: EASE_OUT }}
                  className="flex w-full justify-center"
                >
                  {/* Sealed on arrival → opened for inspection → resealed
                      for delivery. The layoutId keeps it one object. */}
                  {sendBeat >= 1 && sendBeat < 3 ? (
                    <InformationPanel />
                  ) : (
                    <SealedPackage />
                  )}
                </motion.div>
                <AnimatePresence>
                  {sendBeat >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                    >
                      <ChatGPTCard active={sendBeat >= 4} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {stage === 'answer' && (
              <div className="flex w-full flex-col items-center gap-3">
                <ChatGPTCard active={thinking || (wordCount > 0 && !typingDone)} />
                <InformationPanel compact pulseIndex={pulseIndex} />
                <AnswerCard
                  thinking={thinking}
                  wordCount={wordCount}
                  pulseIndex={pulseIndex}
                  typingDone={typingDone}
                />
              </div>
            )}
          </div>

          {/* Status zone: one message per stage, crossfading. */}
          <div className="mt-3 flex min-h-[64px] items-start justify-center">
            <AnimatePresence mode="wait">
              {stage === 'select' && selectBeat >= 4 && (
                <motion.p
                  key="select-msg"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="text-[15px] font-medium text-[#1d1d1f]"
                >
                  Only{' '}
                  <span className="font-semibold text-[#0071e3]">
                    these {SELECTED_CHUNKS.length} chunks
                  </span>{' '}
                  continue.
                </motion.p>
              )}

              {stage === 'assemble' && assembleBeat >= 3 && (
                <motion.p
                  key="assemble-msg"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="flex flex-wrap items-center justify-center gap-2 text-[14px] font-medium text-[#6e6e73]"
                >
                  <span className="text-[#1d1d1f]">Question</span>
                  <Plus className="h-3.5 w-3.5 text-[#a1a1a6]" strokeWidth={2} />
                  <span className="text-[#1d1d1f]">Relevant information</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#a1a1a6]" strokeWidth={2} />
                  <span className="font-semibold text-[#0071e3]">One context</span>
                </motion.p>
              )}

              {stage === 'send' && sendBeat === 3 && (
                <motion.p
                  key="sealing"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="flex items-center gap-1.5 text-[13px] text-[#86868b]"
                >
                  <Package className="h-3.5 w-3.5 text-[#0071e3]" strokeWidth={1.75} />
                  Sealing the package&hellip;
                </motion.p>
              )}

              {stage === 'send' && sendBeat === 4 && (
                <motion.p
                  key="delivering"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="flex items-center gap-1.5 text-[13px] text-[#86868b]"
                >
                  <Send className="h-3.5 w-3.5 text-[#0071e3]" strokeWidth={1.75} />
                  Delivering&hellip;
                </motion.p>
              )}

              {stage === 'send' && sendBeat >= 5 && (
                <motion.p
                  key="send-msg"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="max-w-[46ch] text-balance text-center text-[15px] font-medium text-[#1d1d1f]"
                >
                  ChatGPT only sees this information.{' '}
                  <span className="font-semibold text-[#0071e3]">
                    It never reads the entire PDF.
                  </span>
                </motion.p>
              )}

              {stage === 'answer' && answerDone && (
                <motion.p
                  key="answer-msg"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                  className="max-w-[48ch] text-balance text-center text-[15px] font-medium text-[#1d1d1f]"
                >
                  The answer is generated from the selected information —{' '}
                  <span className="font-semibold text-[#0071e3]">
                    not from the entire PDF
                  </span>
                  .
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {stage === 'select' && (
            <NavigationFooter
              visible={selectBeat >= 4}
              onNext={() => setStage('assemble')}
            />
          )}
          {stage === 'assemble' && (
            <NavigationFooter
              visible={assembleBeat >= 3}
              onNext={() => setStage('send')}
            />
          )}
          {stage === 'send' && (
            <NavigationFooter
              visible={sendBeat >= 5}
              onNext={() => setStage('answer')}
            />
          )}

          {stage === 'answer' && (
            <div className="mt-[clamp(12px,2vh,20px)] flex min-h-[110px] flex-col items-center justify-start gap-3">
              {showTeaser && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={demoPathById('pdf-generation')}
                      className="group flex flex-col items-center gap-1 rounded-2xl border border-[#0071e3]/25 bg-white px-8 py-4 shadow-[0_8px_28px_rgba(0,113,227,0.10)] outline-none transition-[border-color,box-shadow] duration-200 hover:border-[#0071e3]/50 hover:shadow-[0_12px_36px_rgba(0,113,227,0.16)] focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafaf9]"
                    >
                      <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#86868b]">
                        Next demo
                      </span>
                      <span className="flex items-center gap-1.5 text-[15px] font-semibold text-[#1d1d1f]">
                        How ChatGPT Generates Answers
                        <ArrowRight
                          className="h-4 w-4 text-[#0071e3] transition-transform duration-200 group-hover:translate-x-[3px]"
                          strokeWidth={2}
                        />
                      </span>
                    </Link>
                  </motion.div>

                  <motion.button
                    type="button"
                    onClick={restart}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
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
    </RagMotion>
  )
}
