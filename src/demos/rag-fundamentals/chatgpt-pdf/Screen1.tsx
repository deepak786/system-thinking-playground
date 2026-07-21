import { motion } from 'framer-motion'
import { useEntranceVariants } from './animations'
import { DEFAULT_QUESTION } from './data'
import { ProgressIndicator } from './components/ProgressIndicator'
import { Hero } from './components/Hero'
import { DocumentLibrary } from './components/DocumentLibrary'
import { QuestionPanel } from './components/QuestionPanel'
import { PrimaryAction } from './components/PrimaryAction'

type Props = {
  /** Called with the demo question when the demo starts. */
  onStart?: (question: string) => void
}

/**
 * Screen 1: the keynote title slide with a single door. One centered
 * editorial column reading top to bottom — progress, promise (hero),
 * scenery (documents), the user's line (question), and one colored button.
 * Elements enter with a staggered fade-and-rise in reading order.
 */
export function Screen1({ onStart }: Props) {
  const { container } = useEntranceVariants()

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex w-full max-w-[680px] flex-col px-2"
    >
      {/* Section gaps are viewport-relative (clamped) so the whole screen
          fits a 13" laptop without scrolling yet breathes on tall displays. */}
      <ProgressIndicator current={1} title="Introduction" />

      <div className="mt-[clamp(20px,3.5vh,40px)]">
        <Hero />
      </div>

      <div className="mt-[clamp(20px,3.5vh,40px)]">
        <DocumentLibrary />
      </div>

      <div className="mt-[clamp(20px,3vh,32px)]">
        <QuestionPanel value={DEFAULT_QUESTION} />
      </div>

      <div className="mt-[clamp(16px,2.5vh,28px)]">
        <PrimaryAction onStart={() => onStart?.(DEFAULT_QUESTION)} />
      </div>
    </motion.div>
  )
}
