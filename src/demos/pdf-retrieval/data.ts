/**
 * Episode 3 of the "How AI Works" series: after a PDF becomes chunks,
 * how does AI decide which chunks to use? One question, twenty chunks,
 * three winners — no jargon.
 */
export const QUESTION = 'How many vacation days do employees get?'

export const TOTAL_STEPS = 4

export type Relevance = 'no' | 'maybe' | 'yes'

export type Chunk = {
  title: string
  relevance: Relevance
}

/**
 * The twenty chunks on the board, in grid (and scan) order. The search is
 * a coarse filter: it keeps 8 possible matches (2 strong, 6 possible),
 * spread out so the sweep builds tension instead of striking gold
 * immediately. The Rank step then refines those 8 down to the top 3.
 */
export const CHUNKS: Chunk[] = [
  { title: 'Remote Work', relevance: 'no' },
  { title: 'Expense Policy', relevance: 'no' },
  { title: 'Company History', relevance: 'no' },
  { title: 'Security Rules', relevance: 'no' },
  { title: 'Vacation Policy', relevance: 'yes' },
  { title: 'Payroll', relevance: 'maybe' },
  { title: 'Benefits', relevance: 'maybe' },
  { title: 'Code of Conduct', relevance: 'no' },
  { title: 'IT Support', relevance: 'no' },
  { title: 'Travel Policy', relevance: 'maybe' },
  { title: 'Leave Policy', relevance: 'yes' },
  { title: 'Performance Review', relevance: 'no' },
  { title: 'Recruitment', relevance: 'no' },
  { title: 'Working Hours', relevance: 'maybe' },
  { title: 'Dress Code', relevance: 'no' },
  { title: 'Training', relevance: 'no' },
  { title: 'Holiday Calendar', relevance: 'maybe' },
  { title: 'Health Insurance', relevance: 'maybe' },
  { title: 'Laptop Policy', relevance: 'no' },
  { title: 'Meeting Guidelines', relevance: 'no' },
]

/** The 8 chunks the search keeps as candidates, in grid order. */
export const CANDIDATE_TITLES = CHUNKS.filter((c) => c.relevance !== 'no').map(
  (c) => c.title,
)

/** The 3 chunks the Rank step selects — lit from Search all the way to
 * the context box, so the viewer can follow the same information. */
export const TOP_TITLES = ['Vacation Policy', 'Leave Policy', 'Holiday Calendar']
export const TOP_SET = new Set(TOP_TITLES)

/** The stamp the question leaves on each chunk it checks. */
export const RELEVANCE_LABEL: Record<Relevance, string> = {
  no: 'Skip',
  maybe: 'Possible match',
  yes: 'Match',
}

export type Candidate = {
  title: string
  /** Relevance score shown as a percentage — never explained, only ranked. */
  score: number
  /** Does this candidate survive the cut? */
  kept: boolean
}

/**
 * The 8 candidates the search kept, deliberately unsorted so the list can
 * visibly sort itself on the Rank screen before cutting to the top 3.
 */
export const CANDIDATES: Candidate[] = [
  { title: 'Payroll', score: 28, kept: false },
  { title: 'Vacation Policy', score: 98, kept: true },
  { title: 'Working Hours', score: 22, kept: false },
  { title: 'Holiday Calendar', score: 74, kept: true },
  { title: 'Travel Policy', score: 15, kept: false },
  { title: 'Leave Policy', score: 92, kept: true },
  { title: 'Health Insurance', score: 11, kept: false },
  { title: 'Benefits', score: 41, kept: false },
]

export const SORTED_CANDIDATES: Candidate[] = [...CANDIDATES].sort(
  (a, b) => b.score - a.score,
)
