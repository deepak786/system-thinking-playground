export type DemoDocument = {
  name: string
  pages: number
  /** How many chunks this document "produces" on the chunking screen. */
  chunkCount: number
}

/**
 * The fictional company library the demo searches. Display-only on Screen 1 —
 * it exists to set the scene ("there's a company, it has files").
 */
export const DOCUMENTS: DemoDocument[] = [
  { name: 'Employee Handbook', pages: 24, chunkCount: 34 },
  { name: 'Leave Policy', pages: 6, chunkCount: 18 },
  { name: 'Travel Policy', pages: 9, chunkCount: 26 },
  { name: 'Engineering Guidelines', pages: 18, chunkCount: 31 },
  { name: 'Company FAQ', pages: 4, chunkCount: 18 },
]

/**
 * Prefilled so a first-time visitor can start with zero typing. Deliberately
 * answerable from exactly one visible document (Leave Policy) so users can
 * predict the retrieval result before it happens.
 */
export const DEFAULT_QUESTION = 'How many vacation days do employees get?'

export const TOTAL_STEPS = 6

export type DocumentChunk = {
  /** Position in the full chunk list — hints that far more than 5 exist. */
  id: number
  /** Name of the source document (matches DOCUMENTS entries). */
  source: string
  title: string
  text: string
  /**
   * How well this chunk matches the demo question (0–100), used on the
   * retrieval screen. Kept as plain "match" language — no embedding talk.
   */
  matchScore: number
}

/** Total chunks "created" across all 5 documents (only 5 are shown). */
export const TOTAL_CHUNK_COUNT = DOCUMENTS.reduce(
  (sum, doc) => sum + doc.chunkCount,
  0,
)

/**
 * The five representative chunks shown on the chunking screen. Two are
 * vacation-related (from Leave Policy) — a quiet setup for the retrieval
 * step, where they'll be the ones that match the prefilled question.
 */
export const CHUNKS: DocumentChunk[] = [
  {
    id: 23,
    source: 'Leave Policy',
    title: 'Vacation Days',
    text: 'Full-time employees receive 18 paid vacation days per year, earned at 1.5 days per month of service.',
    matchScore: 92,
  },
  {
    id: 24,
    source: 'Leave Policy',
    title: 'Carrying Days Over',
    text: 'Up to 5 unused vacation days may be carried into the next year with manager approval.',
    matchScore: 74,
  },
  {
    id: 7,
    source: 'Employee Handbook',
    title: 'Working Hours',
    text: 'Standard hours are 9:00 AM to 6:00 PM, Monday to Friday, with flexible start times between 8 and 10.',
    matchScore: 18,
  },
  {
    id: 61,
    source: 'Travel Policy',
    title: 'Expense Reimbursement',
    text: 'Travel expenses are reimbursed within 14 days once receipts are submitted through the expense portal.',
    matchScore: 9,
  },
  {
    id: 112,
    source: 'Company FAQ',
    title: 'Public Holidays',
    text: 'The company observes 11 public holidays each year; regional offices may swap in local holidays.',
    matchScore: 58,
  },
]

/** Chunks scoring at least this are "relevant" on the retrieval screen. */
export const RELEVANT_MIN_SCORE = 50

export const RELEVANT_CHUNK_COUNT = CHUNKS.filter(
  (c) => c.matchScore >= RELEVANT_MIN_SCORE,
).length

/** The chunks retrieval selects, best match first — what gets sent onward. */
export const SELECTED_CHUNKS: DocumentChunk[] = CHUNKS.filter(
  (c) => c.matchScore >= RELEVANT_MIN_SCORE,
).sort((a, b) => b.matchScore - a.matchScore)

/**
 * The answer ChatGPT "types" on the generation screen. Deliberately a
 * multi-sentence synthesis of all three selected chunks (not a verbatim
 * copy of any one of them) — quietly demonstrating that ChatGPT generates
 * a coherent response rather than retrieving text. Every fact here must
 * stay consistent with the chunk texts above.
 */
export const DEMO_ANSWER =
  'Full-time employees receive 18 paid vacation days per year, earned at 1.5 days per month of service.\n\nUp to 5 unused days can be carried into the next year with manager approval, and the company also observes 11 public holidays.\n\nBased on the company policies you shared, that\u2019s the current vacation policy.'
