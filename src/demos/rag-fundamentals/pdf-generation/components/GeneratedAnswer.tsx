import { motion } from 'framer-motion'
import { cn } from '../../../../lib/cn'
import { ANSWER_SENTENCES, SENTENCE_WORDS } from '../data'
import { EASE_OUT } from '../animations'

type Props = {
  /** How many words have been generated so far (across all sentences). */
  wordCount: number
  /** Sentence currently being written (pulses with its source card). */
  pulseIndex?: number
  /** Generation finished — the cursor rests. */
  typingDone: boolean
}

/**
 * The answer taking shape, word by word behind a blinking cursor. The
 * in-progress sentence is tinted so it visibly pairs with the source
 * card glowing on the left.
 */
export function GeneratedAnswer({ wordCount, pulseIndex = -1, typingDone }: Props) {
  let remaining = wordCount
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="flex w-full max-w-[440px] flex-col rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-left shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
    >
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#86868b]">
        Generated answer
      </span>
      <p className="min-h-[60px] text-[13px] leading-relaxed text-[#1d1d1f]">
        {SENTENCE_WORDS.map((words, i) => {
          const shown = Math.max(0, Math.min(remaining, words.length))
          remaining -= shown
          if (shown === 0) return null
          return (
            <span
              key={ANSWER_SENTENCES[i].text}
              className={cn(
                'rounded transition-colors duration-400',
                i === pulseIndex && 'bg-[#0071e3]/[0.10] text-[#0071e3]',
              )}
            >
              {words.slice(0, shown).join(' ')}{' '}
            </span>
          )
        })}
        {!typingDone && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="ml-0.5 inline-block h-[14px] w-[2px] translate-y-[2px] rounded-full bg-[#0071e3]"
          />
        )}
      </p>
    </motion.div>
  )
}
