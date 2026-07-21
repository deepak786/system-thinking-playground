import { AnimatePresence, motion } from 'framer-motion'
import { Check, FileText } from 'lucide-react'
import { cn } from '../../../../lib/cn'
import { useLiteMotion } from '../../../../lib/useLiteMotion'
import type { DemoDocument } from '../data'
import {
  SCAN_CFG,
  SLICE_COUNT,
  sliceLayoutId,
  type DocSpeed,
  type DocSub,
} from '../chunkingTimeline'

export type DocCardMode = 'idle' | 'dimmed' | DocSub | 'processed'

type Props = {
  doc: DemoDocument
  docIndex: number
  mode: DocCardMode
  speed: DocSpeed
}

/** Varied skeleton line widths so the page reads as real text, not stripes. */
const LINE_WIDTHS = ['80%', '62%', '74%', '55%', '78%', '66%', '48%']

/**
 * One document in the row. Fully controlled: Screen 2's timeline decides the
 * mode, this component only renders it.
 *
 *  idle/dimmed/focus → compact pill (dimmed fades back; focus lifts forward)
 *  scan/slice/transform → a small portrait page being scanned and cut
 *  processed → dimmed pill with a "✓ n chunks" badge
 */
export function DocumentScanCard({ doc, docIndex, mode, speed }: Props) {
  const lite = useLiteMotion()
  const isPage = mode === 'scan' || mode === 'slice' || mode === 'transform'

  return (
    <motion.li
      layout={!lite}
      transition={{ layout: { type: 'spring', stiffness: 350, damping: 32 } }}
      className="flex items-center justify-center"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isPage ? (
          <ScanPage
            key="page"
            doc={doc}
            docIndex={docIndex}
            sub={mode as DocSub}
            speed={speed}
          />
        ) : (
          <Pill key="pill" doc={doc} mode={mode} />
        )}
      </AnimatePresence>
    </motion.li>
  )
}

function Pill({ doc, mode }: { doc: DemoDocument; mode: DocCardMode }) {
  const processed = mode === 'processed'
  const focus = mode === 'focus'
  const dimmed = mode === 'dimmed'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{
        opacity: processed ? 0.72 : dimmed ? 0.5 : 1,
        scale: focus ? 1.04 : dimmed ? 0.98 : 1,
      }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 transition-[border-color,box-shadow] duration-300',
        focus
          ? 'border-[#0071e3]/40 shadow-[0_4px_14px_rgba(0,113,227,0.18)]'
          : 'border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
      )}
    >
      <FileText
        className={cn(
          'h-3.5 w-3.5 shrink-0',
          focus ? 'text-[#0071e3]' : 'text-[#86868b]',
        )}
        strokeWidth={1.75}
      />
      <span className="whitespace-nowrap text-[13px] font-medium text-[#1d1d1f]">
        {doc.name}
      </span>
      {processed && (
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24, delay: 0.1 }}
          className="flex items-center gap-0.5 whitespace-nowrap rounded-md bg-[#0071e3]/[0.08] px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-[#0071e3]"
        >
          <Check className="h-3 w-3" strokeWidth={2.5} />
          {doc.chunkCount} chunks
        </motion.span>
      )}
    </motion.div>
  )
}

/**
 * The document while it is being chunked. The page is pre-built from 7
 * slice elements with collapsed seams, so the cut is real geometry. Every
 * slice carries a layoutId — when the transform sub-phase removes them
 * here, their mini-chunk twins mount in the grid and Framer Motion flies
 * each one from the page into its slot, one at a time. The document
 * literally leaves the row and reassembles as chunks.
 */
function ScanPage({
  doc,
  docIndex,
  sub,
  speed,
}: {
  doc: DemoDocument
  docIndex: number
  sub: DocSub
  speed: DocSpeed
}) {
  const lite = useLiteMotion()
  const cfg = SCAN_CFG[speed]
  const scanning = sub === 'scan'
  const slicing = sub === 'slice'
  const transforming = sub === 'transform'

  return (
    <motion.div
      initial={{ opacity: 0, scale: lite ? 1 : 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: lite ? 1 : 0.9 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="flex w-[104px] flex-col items-center"
    >
      {/* Caption keeps the document's identity readable while it's a page;
          it fades as the last slices leave — the document is "used up". */}
      <motion.div
        animate={{ opacity: transforming ? 0 : 1 }}
        transition={{ duration: 0.4, delay: transforming ? 0.4 : 0 }}
        className="mb-1.5 flex w-full items-center justify-center gap-1"
      >
        <FileText className="h-3 w-3 shrink-0 text-[#0071e3]" strokeWidth={1.75} />
        <span className="truncate text-[10px] font-medium text-[#6e6e73]">
          {doc.name}
        </span>
      </motion.div>

      <div className="relative h-[112px] w-[80px]">
        <div className="flex h-full w-full flex-col">
          {Array.from({ length: SLICE_COUNT }, (_, i) => {
            // During transform every slice leaves the page; its layoutId
            // twin mounts in the chunk grid and flies over there, one at a
            // time. Nothing dissolves — the document becomes the chunks.
            if (transforming) return null

            return (
              <motion.div
                key={i}
                layoutId={lite ? undefined : sliceLayoutId(docIndex, i)}
                animate={
                  slicing
                    ? {
                        // Slices spring apart along the cuts — and hold,
                        // aligned, so "divided" registers before anything moves.
                        y: (i - (SLICE_COUNT - 1) / 2) * 4,
                        transition: {
                          delay: lite ? 0 : cfg.separateDelayS,
                          type: lite ? ('tween' as const) : ('spring' as const),
                          duration: lite ? 0.2 : undefined,
                          stiffness: lite ? undefined : 400,
                          damping: lite ? undefined : 28,
                        },
                      }
                    : { y: 0 }
                }
                className={cn(
                  'relative flex flex-1 items-center border border-black/[0.08] bg-white px-2',
                  i === 0 && 'rounded-t-md',
                  i === SLICE_COUNT - 1 && 'rounded-b-md',
                  i > 0 && '-mt-px',
                )}
              >
                <div
                  className="h-[3px] rounded-full bg-black/[0.08]"
                  style={{ width: LINE_WIDTHS[i] }}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Scanned-area wash: a soft tint that grows behind the scan line —
            "this part has been read". */}
        {scanning && (
          <motion.div
            initial={{ height: '0%' }}
            animate={{ height: '100%' }}
            transition={{
              delay: cfg.scanDelayS,
              duration: cfg.scanS,
              ease: 'linear',
            }}
            className="pointer-events-none absolute inset-x-0 top-0 rounded-t-md bg-gradient-to-b from-[#0071e3]/[0.03] to-[#0071e3]/[0.09]"
          />
        )}

        {/* The scan line itself: thin, glowing, linear sweep. */}
        {scanning && (
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{
              delay: cfg.scanDelayS,
              duration: cfg.scanS,
              ease: 'linear',
            }}
            className="pointer-events-none absolute -left-1.5 -right-1.5 h-[2px] rounded-full bg-[#0071e3] shadow-[0_0_8px_rgba(0,113,227,0.55)]"
          />
        )}

        {/* Cut lines: appear top-to-bottom the moment the scan finishes. */}
        {slicing &&
          Array.from({ length: SLICE_COUNT - 1 }, (_, i) => {
            const pct = (i + 1) / SLICE_COUNT
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scaleX: 0.6 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: i * cfg.cutStaggerS, duration: 0.15 }}
                style={{ top: `${pct * 100}%` }}
                className="pointer-events-none absolute -left-1 -right-1 border-t border-dashed border-[#0071e3]/50"
              />
            )
          })}
      </div>
    </motion.div>
  )
}
