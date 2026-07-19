import { CHUNKS, DOCUMENTS } from './data'

/**
 * The single source of truth for the chunking choreography on Screen 2.
 *
 * Every document runs through the same four sub-phases:
 *   focus     — the document is highlighted, everything else dims (a beat
 *               for the viewer to lock onto the subject)
 *   scan      — a scan line sweeps the page, tinting the scanned area
 *   slice     — cut lines appear, the page separates into 7 slices and
 *               holds briefly ("the document has been divided")
 *   transform — slices detach one at a time and EVERY one morphs into a
 *               mini-chunk tile in the grid (shared-element flights); no
 *               piece ever dissolves into nothing
 *
 * The first document runs slow — it carries the lesson. The remaining four
 * repeat the identical process fast: teach once, summarize afterwards.
 */
export type DocSpeed = 'slow' | 'fast'
export type DocSub = 'focus' | 'scan' | 'slice' | 'transform'

export type Stage =
  | { kind: 'gather' }
  | { kind: 'doc'; doc: number; sub: DocSub }
  | { kind: 'flourish' }
  | { kind: 'consolidate' }
  | { kind: 'done' }

export const INTRO_MS = 1100
/**
 * Beat with the complete collection of 35 tiles visible and the total
 * counter counting up — held long enough (per the lesson) to register
 * "hundreds of pieces really were created" before extras dissolve.
 */
export const FLOURISH_HOLD_MS = 1300
/** Mini-chunks dissolve / example chunks morph in, then Next Step appears. */
export const CONSOLIDATE_HOLD_MS = 900

export const DOC_PHASE_MS: Record<DocSpeed, Record<DocSub, number>> = {
  // The slice durations include a deliberate held beat AFTER the slices
  // finish separating (~450ms slow, ~200ms fast) before the first piece
  // departs — the brain needs that gap to register "these slices are the
  // chunks" as two events, not one continuous effect.
  slow: { focus: 500, scan: 850, slice: 1050, transform: 1600 },
  fast: { focus: 160, scan: 400, slice: 550, transform: 800 },
}

export const SLICE_COUNT = 7
/** Every slice becomes a tile — the whole document turns into chunks. */
export const MINIS_PER_DOC = SLICE_COUNT

/** In-page animation details for DocumentScanCard, per speed (seconds). */
export const SCAN_CFG: Record<
  DocSpeed,
  {
    scanS: number
    scanDelayS: number
    cutStaggerS: number
    separateDelayS: number
    morphStaggerS: number
  }
> = {
  slow: {
    scanS: 0.72,
    scanDelayS: 0.1,
    cutStaggerS: 0.05,
    separateDelayS: 0.38,
    morphStaggerS: 0.18,
  },
  fast: {
    scanS: 0.32,
    scanDelayS: 0.04,
    cutStaggerS: 0.025,
    separateDelayS: 0.16,
    morphStaggerS: 0.07,
  },
}

export function docSpeed(d: number): DocSpeed {
  return d === 0 ? 'slow' : 'fast'
}

/**
 * Shared-element id linking a document slice → its mini-chunk tile → (for
 * five of them) the example chunk card. Framer Motion FLIP-animates each
 * handoff, so chunks are visibly created FROM the document, never faded in
 * from nowhere.
 */
export function sliceLayoutId(docIndex: number, miniIndex: number): string {
  return `chunk-slice-${docIndex}-${miniIndex}`
}

/**
 * Which mini-chunk each example chunk card takes over from, so the five
 * final cards grow out of tiles that themselves came from the right source
 * document (Leave Policy chunks come from Leave Policy, etc.).
 */
export const CHUNK_CARD_LAYOUT_IDS: string[] = (() => {
  const used = new Map<number, number>()
  return CHUNKS.map((chunk) => {
    const d = DOCUMENTS.findIndex((doc) => doc.name === chunk.source)
    const j = used.get(d) ?? 0
    used.set(d, j + 1)
    return sliceLayoutId(d, j)
  })
})()

/** The full stage schedule, as (timestamp, stage) pairs from mount. */
export function buildSchedule(): Array<{ atMs: number; stage: Stage }> {
  const steps: Array<{ atMs: number; stage: Stage }> = []
  let t = INTRO_MS
  const subs: DocSub[] = ['focus', 'scan', 'slice', 'transform']

  DOCUMENTS.forEach((_, doc) => {
    const phaseMs = DOC_PHASE_MS[docSpeed(doc)]
    for (const sub of subs) {
      steps.push({ atMs: t, stage: { kind: 'doc', doc, sub } })
      t += phaseMs[sub]
    }
  })

  steps.push({ atMs: t, stage: { kind: 'flourish' } })
  t += FLOURISH_HOLD_MS
  steps.push({ atMs: t, stage: { kind: 'consolidate' } })
  t += CONSOLIDATE_HOLD_MS
  steps.push({ atMs: t, stage: { kind: 'done' } })

  return steps
}
