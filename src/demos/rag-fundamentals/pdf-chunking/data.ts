/**
 * One fictional document, deliberately oversized so "search every page"
 * feels absurd, and one small question whose answer lives on a single page.
 */
export const PDF_NAME = 'Employee Handbook'
export const PDF_PAGES = 320
export const QUESTION = 'How many vacation days do employees get?'

export const TOTAL_STEPS = 5

/** How many stacked rows the un-split PDF block is drawn with. */
export const INTRO_ROWS = 8

/**
 * The document's twelve sections — the labels on the Just Right grid.
 * Order matters: index 0 is the tracked "Vacation Policy" section, and
 * RELEVANT_TILE_INDEXES / TRACKED_TILES below index into this list.
 */
export const CHUNK_TITLES = [
  'Vacation Policy',
  'Working Hours',
  'Expense Claims',
  'Remote Work',
  'Public Holidays',
  'Payroll',
  'Sick Leave',
  'Onboarding',
  'Security',
  'Carryover Days',
  'Travel Rules',
  'Conduct',
]

/** The section the demo follows across every chunk size. */
export const TRACKED_TITLE = CHUNK_TITLES[0]

export type Verdict = 'bad' | 'ok' | 'good'

export type SizeLevel = {
  label: string
  verdict: Verdict
  caption: string
  /** Approximate chunk count the 320 pages would produce at this size. */
  chunks: string
  /** How many tiles the visualization draws. */
  tiles: number
  /** Static Tailwind classes (kept literal so the compiler sees them). */
  colsClass: string
  tileClass: string
}

/**
 * The chunk-size slider's five stops, biggest to smallest. The middle one
 * is the sweet spot; the visualization, caption, and count all shift as
 * the viewer drags.
 */
export const SIZE_LEVELS: SizeLevel[] = [
  {
    label: 'Too Large',
    verdict: 'bad',
    caption: 'One chunk holds six unrelated sections at once.',
    chunks: '8',
    tiles: 2,
    colsClass: 'grid-cols-1',
    tileClass: 'h-20',
  },
  {
    label: 'Large',
    verdict: 'ok',
    caption: 'Better, but each chunk still mixes two topics.',
    chunks: '40',
    tiles: 6,
    colsClass: 'grid-cols-2',
    tileClass: 'h-12',
  },
  {
    label: 'Just Right',
    verdict: 'good',
    caption: 'One focused section per chunk — enough context, no clutter.',
    chunks: '120',
    tiles: 12,
    colsClass: 'grid-cols-4',
    tileClass: 'h-9',
  },
  {
    label: 'Small',
    verdict: 'ok',
    caption: 'Sections start getting cut apart mid-thought.',
    chunks: '900',
    tiles: 24,
    colsClass: 'grid-cols-6',
    tileClass: 'h-6',
  },
  {
    label: 'Too Small',
    verdict: 'bad',
    caption: 'Single sentences — the Vacation Policy is now scattered fragments.',
    chunks: '6,400',
    tiles: 48,
    colsClass: 'grid-cols-8',
    tileClass: 'h-4',
  },
]

/** The slider stop that counts as the sweet spot. */
export const JUST_RIGHT_LEVEL = 2

/**
 * Which tiles hold the Vacation Policy content at each slider stop —
 * the same information, differently sized: buried in a slab, one focused
 * card, or scattered fragments.
 */
export const TRACKED_TILES: ReadonlyArray<ReadonlySet<number>> = [
  new Set([0]),
  new Set([0]),
  new Set([0]),
  new Set([0, 1]),
  new Set([0, 1, 2, 3]),
]

/** Which tiles are actually relevant to the question (Just Right grid). */
export const RELEVANT_TILE_INDEXES = new Set([0, 4, 9])

/**
 * What the tracked tiles say at the two smallest stops — the Vacation
 * Policy reduced to fragments. Without reading any caption, the viewer
 * sees that these pieces are too small to mean anything.
 */
export const FRAGMENTS_SMALL = ['\u2026vacation\u2026', '\u2026days\u2026']
export const FRAGMENTS_TINY = ['\u202620\u2026', '\u2026days\u2026', '\u2026per\u2026', '\u2026year\u2026']

/** Fixed demo chunk size used in the overlap-step metrics. */
export const DEMO_CHUNK_SIZE_CHARS = 500

/** Default overlap on the dedicated overlap step (0–50%). */
export const DEFAULT_OVERLAP = 20

/**
 * Continuous handbook prose used by the overlap visualization. Word order
 * is what the two neighboring chunks share (or don't) as the slider moves.
 */
export const OVERLAP_TEXT =
  'Employees receive 20 vacation days each year. Unused vacation may carry over to the next year. Manager approval is required for longer leave.'

export const OVERLAP_WORDS = OVERLAP_TEXT.split(/\s+/)

export type StorageLevel = 'Low' | 'Medium' | 'High'
export type ContextLevel = 'Weak' | 'Fair' | 'Good' | 'Excellent'

export type OverlapMetrics = {
  chunkSize: number
  overlap: number
  estimatedChunks: number
  storage: StorageLevel
  context: ContextLevel
}

/**
 * Educational (approximate) metrics for the overlap step. Higher overlap
 * means more duplicate text stored → more chunks and better context.
 */
export function metricsForOverlap(overlap: number): OverlapMetrics {
  const clamped = Math.max(0, Math.min(50, overlap))
  // At 0% ≈ 12 chunks; at 20% ≈ 18; at 50% ≈ 27.
  const estimatedChunks = Math.round(12 + (clamped / 50) * 15)

  const storage: StorageLevel =
    clamped <= 10 ? 'Low' : clamped <= 30 ? 'Medium' : 'High'

  const context: ContextLevel =
    clamped === 0
      ? 'Weak'
      : clamped <= 15
        ? 'Fair'
        : clamped <= 35
          ? 'Good'
          : 'Excellent'

  return {
    chunkSize: DEMO_CHUNK_SIZE_CHARS,
    overlap: clamped,
    estimatedChunks,
    storage,
    context,
  }
}

/**
 * Split the sample prose into chunk-1-only / shared / chunk-2-only based
 * on overlap %. Shared words are empty at 0% and grow as the slider rises.
 */
export function splitForOverlap(overlap: number): {
  prefix: string[]
  shared: string[]
  suffix: string[]
} {
  const words = OVERLAP_WORDS
  const mid = Math.floor(words.length / 2)
  // Cap shared words so both unique sides still read as complete thoughts.
  const maxShared = Math.floor(words.length * 0.45)
  const sharedCount = Math.round((Math.max(0, Math.min(50, overlap)) / 50) * maxShared)

  if (sharedCount === 0) {
    return {
      prefix: words.slice(0, mid),
      shared: [],
      suffix: words.slice(mid),
    }
  }

  const sharedStart = Math.max(0, mid - Math.floor(sharedCount / 2))
  const sharedEnd = Math.min(words.length, sharedStart + sharedCount)

  return {
    prefix: words.slice(0, sharedStart),
    shared: words.slice(sharedStart, sharedEnd),
    suffix: words.slice(sharedEnd),
  }
}
