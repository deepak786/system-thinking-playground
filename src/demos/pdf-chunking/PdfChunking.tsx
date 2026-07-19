import { useEffect, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { ArrowRight, Check, RotateCcw, Scissors, ScanLine, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { EASE_OUT, staggerContainer } from './animations'
import {
  JUST_RIGHT_LEVEL,
  PDF_PAGES,
  SIZE_LEVELS,
  TRACKED_TITLE,
  type Verdict,
} from './data'
import { StepHeader } from './components/StepHeader'
import { PDFCard } from './components/PDFCard'
import { QuestionBadge } from './components/QuestionBadge'
import { ChunkCanvas, type CanvasStage } from './components/ChunkCanvas'
import { SizeSlider } from './components/SizeSlider'
import { NavigationFooter } from './components/NavigationFooter'

/**
 * Interactive walkthrough of why AI splits PDFs into chunks — the second
 * episode of the "How AI Works" series. Hands-on rather than cinematic:
 * the viewer clicks Split PDF (scan → slice → break apart), drags a
 * chunk-size slider and watches the trade-off live while one section
 * ("Vacation Policy") stays tracked across sizes, then predicts which
 * chunks matter before revealing the answer — the hook for the next video.
 *
 * One continuous canvas rather than separate slides: the same tiles morph
 * through every stage via shared layoutIds.
 */
type Stage = 'intro' | 'scan' | 'slice' | 'split' | 'size' | 'relevant'

const HEADERS: Record<
  Stage,
  { step: number; name: string; title: string; subtitle: string }
> = {
  intro: {
    step: 1,
    name: 'Problem',
    title: 'One question, one huge PDF',
    subtitle: 'The answer sits on a single page of the Employee Handbook.',
  },
  scan: {
    step: 2,
    name: 'Split',
    title: 'The PDF breaks into chunks',
    subtitle: 'Each piece is small enough to read on its own.',
  },
  slice: {
    step: 2,
    name: 'Split',
    title: 'The PDF breaks into chunks',
    subtitle: 'Each piece is small enough to read on its own.',
  },
  split: {
    step: 2,
    name: 'Split',
    title: 'The PDF breaks into chunks',
    subtitle: 'Each piece is small enough to read on its own.',
  },
  size: {
    step: 3,
    name: 'Chunk Size',
    title: 'Choosing the right chunk size',
    subtitle: 'Drag the slider and watch the trade-off.',
  },
  relevant: {
    step: 4,
    name: 'Search',
    title: 'Most chunks are ignored',
    subtitle: 'AI never reads them all — so which ones matter?',
  },
}

/** After the reveal settles, the headline itself becomes the cliffhanger. */
const ENDING_HEADER = {
  step: 4,
  name: 'Search',
  title: 'How does AI know which chunks are relevant?',
  subtitle: 'That question is the next episode.',
}

const VERDICT_STYLE: Record<Verdict, string> = {
  bad: 'text-[#e8594f]',
  ok: 'text-[#86868b]',
  good: 'text-[#0071e3]',
}

export function PdfChunking() {
  const [stage, setStage] = useState<Stage>('intro')
  const [level, setLevel] = useState(JUST_RIGHT_LEVEL)
  const [hasExplored, setHasExplored] = useState(false)
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [showTeaser, setShowTeaser] = useState(false)
  const [endingQuestion, setEndingQuestion] = useState(false)
  const [introBeat, setIntroBeat] = useState(0)

  // Intro tension build: document → question → all pages flash → the ask.
  // The Split PDF button only appears once the problem has landed.
  useEffect(() => {
    if (stage !== 'intro') {
      setIntroBeat(0)
      return
    }
    const timeouts = [
      setTimeout(() => setIntroBeat(1), 900),
      setTimeout(() => setIntroBeat(2), 1800),
      setTimeout(() => setIntroBeat(3), 3200),
    ]
    return () => timeouts.forEach(clearTimeout)
  }, [stage])

  // Split choreography: scan the page, slice it, let the pieces fly,
  // then hand the viewer the slider.
  useEffect(() => {
    if (stage === 'scan') {
      const t = setTimeout(() => setStage('slice'), 1300)
      return () => clearTimeout(t)
    }
    if (stage === 'slice') {
      const t = setTimeout(() => setStage('split'), 1000)
      return () => clearTimeout(t)
    }
    if (stage === 'split') {
      const t = setTimeout(() => setStage('size'), 1900)
      return () => clearTimeout(t)
    }
    return undefined
  }, [stage])

  // Final stage: let the grid settle, then invite a prediction.
  useEffect(() => {
    if (stage !== 'relevant') {
      setShowPrompt(false)
      return
    }
    const t = setTimeout(() => setShowPrompt(true), 800)
    return () => clearTimeout(t)
  }, [stage])

  // After the slow reveal: fade → highlight → stat, then the headline
  // swaps to the cliffhanger question, then the next-video hand-off.
  useEffect(() => {
    if (!answerRevealed) {
      setEndingQuestion(false)
      setShowTeaser(false)
      return
    }
    const timeouts = [
      setTimeout(() => setEndingQuestion(true), 2600),
      setTimeout(() => setShowTeaser(true), 3600),
    ]
    return () => timeouts.forEach(clearTimeout)
  }, [answerRevealed])

  const canvasStage: CanvasStage =
    stage === 'intro' || stage === 'scan' || stage === 'slice'
      ? (stage as CanvasStage)
      : stage === 'relevant'
        ? 'relevant'
        : 'chunks'
  const lvl = SIZE_LEVELS[level]
  const header = endingQuestion ? ENDING_HEADER : HEADERS[stage]

  const restart = () => {
    setStage('intro')
    setLevel(JUST_RIGHT_LEVEL)
    setHasExplored(false)
    setAnswerRevealed(false)
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

          {/* Document identity; bows out once the split begins. */}
          <div className="flex min-h-[92px] flex-col items-center justify-start gap-3">
            <AnimatePresence>
              {stage === 'intro' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 }}
                >
                  <PDFCard glowing />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* The canvas: one set of tiles, morphing through every stage. */}
          <div className="flex min-h-[210px] items-start justify-center">
            <ChunkCanvas
              stage={canvasStage}
              level={level}
              answerRevealed={answerRevealed}
              introFlash={stage === 'intro' && introBeat === 2}
            />
          </div>

          {/* The slider — the demo's hero control, right under the grid it
              drives. Space is reserved only around the stages that use it. */}
          {(stage === 'split' || stage === 'size') && (
            <div className="mt-[clamp(10px,2vh,16px)] flex min-h-[76px] justify-center">
              <AnimatePresence>
                {stage === 'size' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.2 }}
                    className="flex w-full justify-center"
                  >
                    <SizeSlider
                      level={level}
                      onChange={(next) => {
                        setLevel(next)
                        setHasExplored(true)
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Status zone: one message per stage, crossfading. */}
          <div className="mt-3 flex min-h-[76px] items-start justify-center">
            <AnimatePresence mode="wait">
              {stage === 'intro' && (
                <motion.div
                  key="q"
                  initial={false}
                  className="flex flex-col items-center gap-2"
                >
                  <AnimatePresence>
                    {introBeat >= 1 && (
                      <motion.div
                        key="intro-q"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                      >
                        <QuestionBadge />
                      </motion.div>
                    )}
                    {introBeat >= 3 && (
                      <motion.p
                        key="intro-ask"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                        className="text-[16px] font-semibold text-[#1d1d1f]"
                      >
                        Should AI read all of this?
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {stage === 'scan' && (
                <motion.p
                  key="scanning"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="flex items-center gap-1.5 text-[13px] text-[#86868b]"
                >
                  <ScanLine className="h-3.5 w-3.5 text-[#0071e3]" strokeWidth={1.75} />
                  Scanning&hellip;
                </motion.p>
              )}

              {stage === 'slice' && (
                <motion.p
                  key="splitting"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="flex items-center gap-1.5 text-[13px] text-[#86868b]"
                >
                  <Scissors className="h-3.5 w-3.5 text-[#0071e3]" strokeWidth={1.75} />
                  Splitting&hellip;
                </motion.p>
              )}

              {stage === 'split' && (
                <motion.p
                  key="split-count"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.5 }}
                  className="text-[15px] font-medium text-[#1d1d1f]"
                >
                  1 PDF became{' '}
                  <span className="font-semibold text-[#0071e3]">
                    {SIZE_LEVELS[JUST_RIGHT_LEVEL].chunks} chunks
                  </span>
                  .
                </motion.p>
              )}

              {stage === 'size' && (
                <motion.div
                  key={`verdict-${level}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className="flex flex-col items-center gap-1 text-center"
                >
                  <p
                    className={cn(
                      'flex items-center gap-1.5 text-[14px] font-semibold',
                      VERDICT_STYLE[lvl.verdict],
                    )}
                  >
                    {lvl.verdict === 'good' && (
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    )}
                    {lvl.verdict === 'bad' && (
                      <X className="h-4 w-4" strokeWidth={2.5} />
                    )}
                    {lvl.label}
                    <span className="font-normal text-[#a1a1a6]">
                      &middot; &asymp;{lvl.chunks} chunks from {PDF_PAGES} pages
                    </span>
                  </p>
                  <p className="max-w-[46ch] text-balance text-[13px] text-[#86868b]">
                    {lvl.caption}
                  </p>
                  <p className="flex items-center gap-1.5 text-[12px] text-[#a1a1a6]">
                    <span className="h-2 w-2 rounded-full border border-[#0071e3] bg-[#0071e3]/[0.15]" />
                    Watch where &ldquo;{TRACKED_TITLE}&rdquo; ends up
                  </p>
                </motion.div>
              )}

              {stage === 'relevant' && showPrompt && !answerRevealed && (
                <motion.div
                  key="predict"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="flex flex-col items-center gap-1.5 text-center"
                >
                  <p className="text-[16px] font-semibold text-[#1d1d1f]">
                    Which chunks would you search?
                  </p>
                  <QuestionBadge />
                </motion.div>
              )}

              {stage === 'relevant' && answerRevealed && (
                <motion.div
                  key="revealed"
                  initial={false}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  {/* The statistic: how much work the split just avoided. */}
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT, delay: 1.6 }}
                    className="flex items-center gap-2 text-[14px] text-[#6e6e73]"
                  >
                    <span className="font-semibold text-[#1d1d1f]">
                      {PDF_PAGES} pages
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#a1a1a6]" strokeWidth={2} />
                    <span className="font-semibold text-[#1d1d1f]">
                      {SIZE_LEVELS[JUST_RIGHT_LEVEL].chunks} chunks
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#a1a1a6]" strokeWidth={2} />
                    <span className="font-semibold text-[#0071e3]">
                      only 3 searched
                    </span>
                  </motion.p>
                  {/* The curiosity beat lives in the headline (ENDING_HEADER),
                      which swaps in ~2.6 s after the reveal. */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {stage === 'intro' && (
            <NavigationFooter
              visible={introBeat >= 3}
              label="Split PDF"
              icon="scissors"
              onNext={() => setStage('scan')}
            />
          )}

          {(stage === 'scan' || stage === 'slice' || stage === 'split' || stage === 'size') && (
            <NavigationFooter
              visible={stage === 'size' && hasExplored}
              label="Continue"
              onNext={() => {
                setLevel(JUST_RIGHT_LEVEL)
                setStage('relevant')
              }}
            />
          )}

          {stage === 'relevant' && !answerRevealed && (
            <NavigationFooter
              visible={showPrompt}
              label="Show Answer"
              onNext={() => setAnswerRevealed(true)}
            />
          )}

          {stage === 'relevant' && answerRevealed && (
            <div className="mt-[clamp(12px,2vh,20px)] flex min-h-[110px] flex-col items-center justify-start gap-3">
              {showTeaser && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="flex flex-col items-center gap-1 rounded-2xl border border-[#0071e3]/25 bg-white px-8 py-4 shadow-[0_8px_28px_rgba(0,113,227,0.10)]"
                  >
                    <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#86868b]">
                      Next video
                    </span>
                    <span className="flex items-center gap-1.5 text-[15px] font-semibold text-[#1d1d1f]">
                      How AI Finds the Right Information
                      <ArrowRight className="h-4 w-4 text-[#0071e3]" strokeWidth={2} />
                    </span>
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
