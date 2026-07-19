import { motion } from 'framer-motion'
import { cn } from '../../../lib/cn'
import { ANSWER_SENTENCES, SENTENCE_WORDS } from '../data'
import { EASE_OUT } from '../animations'

type Props = {
  /** ChatGPT hasn't started writing yet. */
  thinking: boolean
  /** How many words have been generated so far (across all sentences). */
  wordCount: number
  /** Sentence currently being written (pulses with its source snippet). */
  pulseIndex?: number
  /** Generation finished — the cursor blinks once more, then rests. */
  typingDone: boolean
}

/**
 * ChatGPT's reply, generated word by word behind a blinking cursor.
 * Each in-progress sentence pulses together with the snippet it comes
 * from, so the viewer watches the answer being built from the package.
 */
export function AnswerCard({
  thinking,
  wordCount,
  pulseIndex = -1,
  typingDone,
}: Props) {
  let remaining = wordCount
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="w-full max-w-[440px] rounded-2xl border border-black/[0.08] bg-white px-5 py-4 text-left shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
    >
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#86868b]">
        Answer
      </span>

      {thinking ? (
        <span className="flex h-5 items-center gap-1" aria-label="Thinking">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.18,
              }}
              className="h-1.5 w-1.5 rounded-full bg-[#86868b]"
            />
          ))}
        </span>
      ) : (
        <p className="min-h-5 text-[13px] leading-relaxed text-[#1d1d1f]">
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
          {!typingDone && wordCount > 0 && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="ml-0.5 inline-block h-[14px] w-[2px] translate-y-[2px] rounded-full bg-[#0071e3]"
            />
          )}
        </p>
      )}
    </motion.div>
  )
}
