/**
 * Episode 5 — the finale of the "RAG Fundamentals" playlist: once
 * ChatGPT receives the question and the relevant information, it reads
 * that information and writes a natural-language answer. Same question,
 * same three chunks, same answer as episode 4, so the hand-off between
 * videos is seamless.
 */
export const QUESTION = 'How many vacation days do employees get?'

export const TOTAL_STEPS = 4

export type InfoChunk = {
  title: string
  snippet: string
}

/** The three pieces of information inside the package. */
export const INFO_CHUNKS: InfoChunk[] = [
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

export type AnswerSentence = {
  text: string
  /** Index into INFO_CHUNKS — the snippet this sentence comes from. */
  source: number
}

/** The answer, one sentence per source, streamed word by word. */
export const ANSWER_SENTENCES: AnswerSentence[] = [
  { text: 'Employees receive 20 vacation days each year.', source: 0 },
  { text: 'Up to 5 unused days can carry over to the next year.', source: 1 },
  { text: 'The company also observes 11 public holidays on top.', source: 2 },
]

export const SENTENCE_WORDS = ANSWER_SENTENCES.map((s) => s.text.split(' '))
export const TOTAL_WORDS = SENTENCE_WORDS.reduce((n, w) => n + w.length, 0)

/** The whole playlist in six stops — the final recap pipeline. */
export const PIPELINE = [
  'PDF',
  'Chunks',
  'Relevant chunks',
  'Question + chunks',
  'ChatGPT',
  'Answer',
] as const

/** The three-part plain-language definition of RAG. */
export const RAG_PARTS = [
  'Finding the right information',
  'Giving it to ChatGPT',
  'Generating an answer',
] as const

/** What the viewer achieved across the playlist — the final checklist. */
export const LEARNED = [
  'Why PDFs are split into chunks',
  'How AI finds relevant information',
  'What ChatGPT actually receives',
  'How ChatGPT generates answers',
] as const
