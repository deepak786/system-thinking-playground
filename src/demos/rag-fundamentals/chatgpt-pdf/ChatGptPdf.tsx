import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RagMotion } from '../shared/RagMotion'
import { EASE_OUT } from './animations'
import { DEFAULT_QUESTION } from './data'
import { Screen1 } from './Screen1'
import { Screen2 } from './Screen2'
import { Screen3 } from './Screen3'
import { Screen4 } from './Screen4'
import { Screen5 } from './Screen5'
import { Screen6 } from './Screen6'

/**
 * Educational walkthrough of how ChatGPT answers questions about a PDF
 * (retrieval-augmented generation), told over 6 guided steps.
 *
 * Unlike the other demos, this one uses a light, paper-like canvas — the
 * story is about documents, so the screen should feel like paper.
 *
 * Implemented so far: Screens 1–6 (title slide, chunking, retrieval,
 * prompt packaging, answer generation, and the conclusion). Screen 6 ends
 * with Start Again, which loops back to Screen 1.
 */
export function ChatGptPdf() {
  const [screen, setScreen] = useState<1 | 2 | 3 | 4 | 5 | 6>(1)
  const [question, setQuestion] = useState(DEFAULT_QUESTION)

  return (
    <RagMotion>
      {/* Bleed over the dark panel padding so the light canvas fills it.
          Content is vertically centered so the composition sits at the
          optical center of tall viewports instead of hugging the top. */}
      {/* Mobile: top-align so tall screens scroll cleanly. Desktop: optical center. */}
      <div className="-m-4 flex min-h-full flex-col justify-start rounded-3xl bg-[#fafaf9] px-5 py-[clamp(16px,2.5vh,28px)] sm:px-8 lg:-m-6 lg:justify-center">
        <AnimatePresence mode="wait">
          {screen === 1 ? (
            <motion.div
              key="screen-1"
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeIn' }}
            >
              <Screen1
                onStart={(q) => {
                  setQuestion(q.trim() || DEFAULT_QUESTION)
                  setScreen(2)
                }}
              />
            </motion.div>
          ) : screen === 2 ? (
            <motion.div
              key="screen-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <Screen2 question={question} onNext={() => setScreen(3)} />
            </motion.div>
          ) : screen === 3 ? (
            <motion.div
              key="screen-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <Screen3 question={question} onNext={() => setScreen(4)} />
            </motion.div>
          ) : screen === 4 ? (
            <motion.div
              key="screen-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <Screen4 question={question} onNext={() => setScreen(5)} />
            </motion.div>
          ) : screen === 5 ? (
            <motion.div
              key="screen-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <Screen5 question={question} onNext={() => setScreen(6)} />
            </motion.div>
          ) : (
            <motion.div
              key="screen-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <Screen6 onRestart={() => setScreen(1)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RagMotion>
  )
}
