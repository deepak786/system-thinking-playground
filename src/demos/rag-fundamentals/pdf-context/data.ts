/**
 * Episode 4 of the "How AI Works" series: what does ChatGPT actually
 * receive? One mental model — someone prepares a package containing the
 * question and only the relevant information, and that package is all
 * ChatGPT ever sees.
 */
export const PDF_NAME = 'Employee Handbook.pdf'
export const PDF_PAGES = 320
export const QUESTION = 'How many vacation days do employees get?'

export const TOTAL_STEPS = 4

export type SelectedChunk = {
  title: string
  /** The human-readable line this chunk contributes to the package. */
  snippet: string
}

/** The three chunks that made the cut in the previous episode. */
export const SELECTED_CHUNKS: SelectedChunk[] = [
  {
    title: 'Vacation Policy',
    snippet: 'Employees receive 20 vacation days per year.',
  },
  {
    title: 'Leave Policy',
    snippet: 'Up to 5 unused vacation days may carry over to the next year.',
  },
  {
    title: 'Holiday Calendar',
    snippet: 'The company additionally observes 11 public holidays.',
  },
]

export const SELECTED_SET = new Set(SELECTED_CHUNKS.map((c) => c.title))

/**
 * The twelve chunks the PDF splits into on screen 1 — a fast recap of
 * episode 2. The three selected ones are deliberately spread out.
 */
export const ALL_CHUNKS = [
  'Vacation Policy',
  'Working Hours',
  'Expense Claims',
  'Remote Work',
  'Leave Policy',
  'Payroll',
  'Sick Leave',
  'Onboarding',
  'Holiday Calendar',
  'Security',
  'Travel Rules',
  'Conduct',
]

export type AnswerSentence = {
  text: string
  /** Index into SELECTED_CHUNKS — the snippet this sentence comes from. */
  source: number
}

/**
 * The answer, one sentence per source chunk, so each sentence can pulse
 * together with the snippet it was generated from.
 */
export const ANSWER_SENTENCES: AnswerSentence[] = [
  { text: 'Employees receive 20 vacation days each year.', source: 0 },
  { text: 'Up to 5 unused days can carry over to the next year.', source: 1 },
  { text: 'The company also observes 11 public holidays on top.', source: 2 },
]

/** Words per sentence — the answer streams out word by word. */
export const SENTENCE_WORDS = ANSWER_SENTENCES.map((s) => s.text.split(' '))
export const TOTAL_WORDS = SENTENCE_WORDS.reduce((n, w) => n + w.length, 0)
