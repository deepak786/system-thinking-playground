import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { EASE_OUT, staggerContainer } from './animations'
import { CANDIDATE_TITLES, CHUNKS, RELEVANCE_LABEL } from './data'
import { StepHeader } from './components/StepHeader'
import { QuestionBubble } from './components/QuestionBubble'
import { ChunkGrid } from './components/ChunkGrid'
import { RankingList } from './components/RankingList'
import { ContextContainer } from './components/ContextContainer'
import { NavigationFooter } from './components/NavigationFooter'

/**
 * Episode 3 of the "How AI Works" series: after a PDF becomes chunks,
 * how does AI find the right ones? Four stages on one evolving canvas —
 * a wall of 20 chunks meets one question (Problem), the question visits
 * every chunk one at a time (Search), the closest candidates rank
 * themselves (Rank), and only the top three fly into the context box
 * bound for ChatGPT (Context). No jargon, no scores explained.
 */
type Stage = 'problem' | 'search' | 'rank' | 'context'

const HEADERS: Record<
  Stage,
  { step: number; name: string; title: string; subtitle: string }
> = {
  problem: {
    step: 1,
    name: 'Problem',
    title: 'Many chunks. One question.',
    subtitle: 'Your PDF is now a wall of chunks — and the answer hides in a few of them.',
  },
  search: {
    step: 2,
    name: 'Search',
    title: 'Find the relevant chunks',
    subtitle: 'The question checks every chunk and decides: skip or match.',
  },
  rank: {
    step: 3,
    name: 'Rank',
    title: 'Only the best matches remain',
    subtitle: 'AI doesn\u2019t stop at the first match — it ranks all 8 candidates.',
  },
  context: {
    step: 4,
    name: 'Context',
    title: 'Only these chunks move forward',
    subtitle: 'Everything else stays behind.',
  },
}

/** After the parcel is packed, the headline becomes the cliffhanger. */
const ENDING_HEADER = {
  step: 4,
  name: 'Context',
  title: 'What does ChatGPT actually receive?',
  subtitle: 'We\u2019ll answer that in the next video.',
}

/** Dwell per chunk: skips are quick, possible matches get a beat, strong
 * matches get a long one — the sweep reads as a decision, not a highlight. */
const DWELL_MS: Record<'no' | 'maybe' | 'yes', number> = {
  no: 200,
  maybe: 460,
  yes: 780,
}

export function PdfRetrieval() {
  const [stage, setStage] = useState<Stage>('problem')
  const [problemBeat, setProblemBeat] = useState(0)
  const [scanIndex, setScanIndex] = useState(-1)
  const [searchNarrowed, setSearchNarrowed] = useState(false)
  const [rankSettled, setRankSettled] = useState(false)
  const [contextBeat, setContextBeat] = useState(0)
  const [endingQuestion, setEndingQuestion] = useState(false)
  const [showTeaser, setShowTeaser] = useState(false)

  // Problem: grid → question → every chunk glows → "should AI read every
  // chunk?" — the button waits until the absurdity has landed.
  useEffect(() => {
    if (stage !== 'problem') {
      setProblemBeat(0)
      return
    }
    const timeouts = [
      setTimeout(() => setProblemBeat(1), 1300),
      setTimeout(() => setProblemBeat(2), 2300),
      setTimeout(() => setProblemBeat(3), 3500),
    ]
    return () => timeouts.forEach(clearTimeout)
  }, [stage])

  // Search: the question evaluates chunks one by one — quick skips,
  // a longer pause on each match — then the wall narrows.
  useEffect(() => {
    if (stage !== 'search') {
      setScanIndex(-1)
      setSearchNarrowed(false)
      return
    }
    let i = -1
    let timer: ReturnType<typeof setTimeout>
    const step = () => {
      i += 1
      setScanIndex(i)
      if (i >= CHUNKS.length) {
        timer = setTimeout(() => setSearchNarrowed(true), 500)
        return
      }
      timer = setTimeout(step, DWELL_MS[CHUNKS[i].relevance])
    }
    timer = setTimeout(step, 800)
    return () => clearTimeout(timer)
  }, [stage])

  // Context recap: the wall returns → 17 fade slowly → 3 fly into the box
  // → caption → the headline turns into the cliffhanger → next-demo card.
  useEffect(() => {
    if (stage !== 'context') {
      setContextBeat(0)
      setEndingQuestion(false)
      setShowTeaser(false)
      return
    }
    const timeouts = [
      setTimeout(() => setContextBeat(1), 900),
      setTimeout(() => setContextBeat(2), 2500),
      setTimeout(() => setContextBeat(3), 3400),
      setTimeout(() => setEndingQuestion(true), 4800),
      setTimeout(() => setShowTeaser(true), 5700),
    ]
    return () => timeouts.forEach(clearTimeout)
  }, [stage])

  const scanning = stage === 'search' && scanIndex >= 0 && scanIndex < CHUNKS.length
  const scanComplete = stage === 'search' && scanIndex >= CHUNKS.length
  const checking = scanning ? CHUNKS[scanIndex] : null
  const header = endingQuestion ? ENDING_HEADER : HEADERS[stage]

  const restart = () => {
    setStage('problem')
    setRankSettled(false)
  }

  return (
    <MotionConfig reducedMotion="user">
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

          {/* From Search onward the question sits above the wall it queries
              (a shared layoutId floats it up from the Problem screen). */}
          <div className="mb-3 flex min-h-[40px] items-center justify-center">
            {stage !== 'problem' && <QuestionBubble searching={scanning} />}
          </div>

          {/* The canvas: wall of chunks, ranking list, or packed context. */}
          <div className="flex min-h-[300px] flex-col items-center justify-start gap-4">
            <AnimatePresence mode="wait">
              {stage !== 'rank' ? (
                <motion.div
                  key="wall"
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  className="flex w-full flex-col items-center gap-4"
                >
                  <ChunkGrid
                    glowing={stage === 'problem' && problemBeat === 2}
                    scanIndex={stage === 'search' ? scanIndex : -1}
                    scanComplete={scanComplete || stage === 'context'}
                    faded={searchNarrowed || (stage === 'context' && contextBeat >= 1)}
                    topOnly={stage === 'context'}
                    packed={stage === 'context' && contextBeat >= 2}
                    quickEnter={stage === 'context'}
                  />
                  {stage === 'context' && contextBeat >= 2 && <ContextContainer />}
                </motion.div>
              ) : (
                <motion.div
                  key="ranking"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                  className="flex w-full justify-center"
                >
                  <RankingList onSettled={() => setRankSettled(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status zone: one message per stage, crossfading. */}
          <div className="mt-3 flex min-h-[76px] items-start justify-center">
            <AnimatePresence mode="wait">
              {stage === 'problem' && (
                <motion.div
                  key="problem-status"
                  initial={false}
                  className="flex flex-col items-center gap-2"
                >
                  <AnimatePresence>
                    {problemBeat >= 1 && (
                      <motion.div
                        key="problem-q"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                      >
                        <QuestionBubble />
                      </motion.div>
                    )}
                    {problemBeat >= 3 && (
                      <motion.p
                        key="problem-ask"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                        className="text-[16px] font-semibold text-[#1d1d1f]"
                      >
                        Should AI read every chunk?
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {stage === 'search' && checking && (
                <motion.p
                  key={`check-${scanIndex}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2 text-[14px]"
                >
                  <span className="font-medium text-[#1d1d1f]">{checking.title}</span>
                  <span className="text-[#d2d2d7]">&mdash;</span>
                  <span
                    className={cn(
                      'flex items-center gap-1 font-semibold',
                      checking.relevance === 'no'
                        ? 'text-[#a1a1a6]'
                        : checking.relevance === 'maybe'
                          ? 'text-[#5aa9f0]'
                          : 'text-[#0071e3]',
                    )}
                  >
                    {checking.relevance === 'no' ? (
                      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                    ) : (
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                    )}
                    {RELEVANCE_LABEL[checking.relevance]}
                  </span>
                </motion.p>
              )}

              {stage === 'search' && searchNarrowed && (
                <motion.p
                  key="narrowed"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.9 }}
                  className="max-w-[46ch] text-balance text-center text-[15px] font-medium text-[#1d1d1f]"
                >
                  {CHUNKS.length} chunks narrowed down to{' '}
                  <span className="font-semibold text-[#0071e3]">
                    {CANDIDATE_TITLES.length} possible matches
                  </span>
                  .
                </motion.p>
              )}

              {stage === 'rank' && rankSettled && (
                <motion.p
                  key="ranked"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="max-w-[46ch] text-balance text-center text-[15px] font-medium text-[#1d1d1f]"
                >
                  {CANDIDATE_TITLES.length} candidates in — only the{' '}
                  <span className="font-semibold text-[#0071e3]">top 3</span>{' '}
                  move forward.
                </motion.p>
              )}

              {stage === 'context' && contextBeat >= 3 && (
                <motion.p
                  key="context-caption"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                  className="max-w-[46ch] text-balance text-center text-[15px] font-medium text-[#1d1d1f]"
                >
                  Instead of sending the entire PDF,{' '}
                  <span className="font-semibold text-[#0071e3]">
                    only the most relevant chunks continue
                  </span>
                  .
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {stage === 'problem' && (
            <NavigationFooter
              visible={problemBeat >= 3}
              onNext={() => setStage('search')}
            />
          )}

          {stage === 'search' && (
            <NavigationFooter
              visible={searchNarrowed}
              onNext={() => setStage('rank')}
            />
          )}

          {stage === 'rank' && (
            <NavigationFooter
              visible={rankSettled}
              onNext={() => {
                setRankSettled(false)
                setStage('context')
              }}
            />
          )}

          {stage === 'context' && (
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
                      to="/pdf-context"
                      className="group flex flex-col items-center gap-1 rounded-2xl border border-[#0071e3]/25 bg-white px-8 py-4 shadow-[0_8px_28px_rgba(0,113,227,0.10)] outline-none transition-[border-color,box-shadow] duration-200 hover:border-[#0071e3]/50 hover:shadow-[0_12px_36px_rgba(0,113,227,0.16)] focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafaf9]"
                    >
                      <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#86868b]">
                        Next demo
                      </span>
                      <span className="flex items-center gap-1.5 text-[15px] font-semibold text-[#1d1d1f]">
                        What Does ChatGPT Actually Receive?
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
    </MotionConfig>
  )
}
