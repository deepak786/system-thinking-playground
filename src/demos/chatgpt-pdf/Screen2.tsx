import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, Check } from 'lucide-react'
import { EASE_OUT, riseIn, staggerContainer } from './animations'
import { CHUNKS, DOCUMENTS, TOTAL_CHUNK_COUNT } from './data'
import {
  buildSchedule,
  CHUNK_CARD_LAYOUT_IDS,
  docSpeed,
  MINIS_PER_DOC,
  SCAN_CFG,
  sliceLayoutId,
  type Stage,
} from './chunkingTimeline'
import { cn } from '../../lib/cn'
import { ProgressIndicator } from './components/ProgressIndicator'
import { QuestionChip } from './components/QuestionChip'
import { ChunkCard } from './components/ChunkCard'
import { MiniChunk } from './components/MiniChunk'
import { AnimatedCounter } from './components/AnimatedCounter'
import {
  DocumentScanCard,
  type DocCardMode,
} from './components/DocumentScanCard'
import { NextStepButton } from './components/NextStepButton'

type Props = {
  question: string
  onNext: () => void
}

/**
 * Screen 2: the first step of RAG, experienced rather than stated.
 * Document → focus → scan → slice → transform → chunks, one document at a
 * time, so the user finishes thinking "now I understand what chunking means".
 * All timing lives in chunkingTimeline.ts.
 */
export function Screen2({ question, onNext }: Props) {
  const [stage, setStage] = useState<Stage>({ kind: 'gather' })

  useEffect(() => {
    const timeouts = buildSchedule().map(({ atMs, stage: next }) =>
      setTimeout(() => setStage(next), atMs),
    )
    return () => timeouts.forEach(clearTimeout)
  }, [])

  const docMode = (d: number): DocCardMode => {
    if (stage.kind === 'gather') return 'idle'
    if (stage.kind === 'doc') {
      if (d === stage.doc) return stage.sub
      return d < stage.doc ? 'processed' : 'dimmed'
    }
    return 'processed'
  }

  /** Mini-chunks for doc d exist once its transform sub-phase has begun. */
  const minisVisible = (d: number): boolean => {
    if (stage.kind === 'doc') {
      return d < stage.doc || (d === stage.doc && stage.sub === 'transform')
    }
    return stage.kind === 'flourish'
  }

  const isSlicing = stage.kind === 'doc'
  const showExampleChunks = stage.kind === 'consolidate' || stage.kind === 'done'
  const showSummary = stage.kind === 'flourish' || showExampleChunks

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-[680px] flex-col px-2"
    >
      <ProgressIndicator current={2} title="Splitting into Chunks" />

      <div className="mt-[clamp(16px,3vh,32px)] flex flex-col items-center gap-2.5 text-center">
        <motion.h1
          variants={riseIn}
          className="max-w-xl text-balance text-[26px] font-semibold leading-[1.1] tracking-[-0.015em] text-[#1d1d1f] sm:text-[32px]"
        >
          First, the documents are split into chunks
        </motion.h1>
        <motion.p
          variants={riseIn}
          className="max-w-[52ch] text-balance text-[15px] leading-normal text-[#6e6e73] sm:text-base"
        >
          ChatGPT can&rsquo;t read every page at once — each document is broken
          into small, focused pieces it can search later.
        </motion.p>
      </div>

      <div className="mt-[clamp(14px,2.5vh,24px)]">
        <QuestionChip question={question} />
      </div>

      {/* The document row. Fixed min-height reserves room for the expanded
          scan page so the rest of the layout never shifts. */}
      <motion.ul
        variants={riseIn}
        className="mt-[clamp(12px,2vh,20px)] flex min-h-[140px] flex-wrap items-center justify-center gap-2"
      >
        {DOCUMENTS.map((doc, d) => (
          <DocumentScanCard
            key={doc.name}
            doc={doc}
            docIndex={d}
            mode={docMode(d)}
            speed={docSpeed(d)}
          />
        ))}
      </motion.ul>

      {/* Live status label narrating the process. */}
      <motion.div
        variants={riseIn}
        className="mt-[clamp(8px,1.5vh,12px)] flex items-center justify-center gap-1.5 text-[13px] text-[#86868b]"
      >
        <ArrowDown
          className={cn('h-4 w-4', isSlicing && 'animate-bounce')}
          strokeWidth={1.75}
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={stage.kind === 'doc' ? 'doc' : showSummary ? 'summary' : 'gather'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className={cn(
              showSummary && 'flex items-center gap-1 font-medium text-[#1d1d1f]',
            )}
          >
            {stage.kind === 'gather' && 'Reading the documents…'}
            {stage.kind === 'doc' && 'Splitting each document into pieces…'}
            {showSummary && (
              <>
                <Check className="h-3.5 w-3.5 text-[#0071e3]" strokeWidth={2.5} />
                <span>
                  <AnimatedCounter value={TOTAL_CHUNK_COUNT} duration={0.8} />{' '}
                  searchable chunks created
                  {showExampleChunks && ' — showing 5 example chunks'}
                </span>
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Chunk grid: slices fly in here as mini-chunk tiles while documents
          are processed; at consolidation five tiles grow into the example
          chunks and the rest dissolve. Fixed min-height so the page never
          jumps as tiles mount and unmount. */}
      <ul className="mt-[clamp(12px,2vh,20px)] grid min-h-[228px] grid-cols-3 content-start gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <AnimatePresence>
          {!showExampleChunks &&
            DOCUMENTS.map((_, d) =>
              minisVisible(d)
                ? Array.from({ length: MINIS_PER_DOC }, (_, j) => (
                    <MiniChunk
                      key={`mini-${d}-${j}`}
                      layoutId={sliceLayoutId(d, j)}
                      delay={j * SCAN_CFG[docSpeed(d)].morphStaggerS}
                    />
                  ))
                : null,
            )}
          {showExampleChunks &&
            CHUNKS.map((chunk, i) => (
              <ChunkCard
                key={chunk.id}
                chunk={chunk}
                layoutId={CHUNK_CARD_LAYOUT_IDS[i]}
                delay={i * 0.08}
                className={cn(
                  'col-span-3 sm:col-span-2',
                  i === 3 && 'lg:col-start-2',
                  i === 4 && 'sm:col-start-2 lg:col-start-auto',
                )}
              />
            ))}
        </AnimatePresence>
      </ul>

      {/* Footer: reserved height so the button's arrival doesn't shift the
          layout. The screen pauses here until the user clicks Next Step. */}
      <div className="mt-[clamp(12px,2vh,20px)] flex min-h-[104px] flex-col items-center justify-start gap-3">
        <AnimatePresence>
          {stage.kind === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="flex flex-col items-center gap-3"
            >
              <NextStepButton onClick={onNext} />
              <p className="text-[13px] text-[#86868b]">
                Next: finding the chunks that match your question
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
