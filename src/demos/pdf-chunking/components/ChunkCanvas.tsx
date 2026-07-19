import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../../lib/cn'
import {
  CHUNK_TITLES,
  FRAGMENTS_SMALL,
  FRAGMENTS_TINY,
  INTRO_ROWS,
  JUST_RIGHT_LEVEL,
  RELEVANT_TILE_INDEXES,
  SIZE_LEVELS,
  TRACKED_TILES,
  TRACKED_TITLE,
} from '../data'

export type CanvasStage =
  /** One solid block. */
  | 'intro'
  /** A scan line reads the block top to bottom. */
  | 'scan'
  /** Cut lines appear; the block visibly separates into slices. */
  | 'slice'
  /** The chunk grid, re-flowing with the size level. */
  | 'chunks'
  /** The Just Right grid; the answer reveal dims all but three tiles. */
  | 'relevant'

type Props = {
  stage: CanvasStage
  /** Index into SIZE_LEVELS; drives the grid while stage is 'chunks'. */
  level: number
  /** On the final stage: has the viewer clicked Show Answer yet? */
  answerRevealed?: boolean
  /** Intro only: run a brief highlight wave over the pages. */
  introFlash?: boolean
}

const SPRING = { type: 'spring', stiffness: 300, damping: 30 } as const

/** What a tile says at each level — real sections, not anonymous blocks. */
function TileContent({
  levelIdx,
  index,
  inverted,
  tracked,
}: {
  levelIdx: number
  index: number
  inverted: boolean
  tracked: boolean
}) {
  // Slabs: six section names crammed together — visibly mixed topics.
  if (levelIdx === 0) {
    return (
      <span className="flex flex-wrap content-center items-center justify-center gap-x-2.5 gap-y-1 px-4">
        {CHUNK_TITLES.slice(index * 6, index * 6 + 6).map((t) => (
          <span
            key={t}
            className={cn(
              'text-[10px] leading-tight',
              t === TRACKED_TITLE ? 'font-semibold text-[#0071e3]' : 'text-[#a1a1a6]',
            )}
          >
            {t}
          </span>
        ))}
      </span>
    )
  }
  // Pairs: still two topics per chunk.
  if (levelIdx === 1) {
    const [a, b] = [CHUNK_TITLES[index * 2], CHUNK_TITLES[index * 2 + 1]]
    return (
      <span className="flex items-center gap-1.5 px-2 text-[10px] leading-tight">
        <span className={cn(a === TRACKED_TITLE ? 'font-semibold text-[#0071e3]' : 'text-[#86868b]')}>
          {a}
        </span>
        <span className="text-[#d2d2d7]">&middot;</span>
        <span className="text-[#86868b]">{b}</span>
      </span>
    )
  }
  // One focused section per chunk.
  if (levelIdx === JUST_RIGHT_LEVEL) {
    return (
      <span
        className={cn(
          'px-1 text-center text-[10px] font-medium leading-[1.15]',
          inverted ? 'text-white' : tracked ? 'text-[#0071e3]' : 'text-[#6e6e73]',
        )}
      >
        {CHUNK_TITLES[index]}
      </span>
    )
  }
  // The small stops: the tracked section reduced to meaningless fragments;
  // every other tile is too small to carry a label at all.
  if (tracked) {
    const fragments = levelIdx === 3 ? FRAGMENTS_SMALL : FRAGMENTS_TINY
    return (
      <span className="truncate px-0.5 text-[8px] italic leading-none text-[#0071e3]/80">
        {fragments[index % fragments.length]}
      </span>
    )
  }
  return null
}

/**
 * The heart of the demo: one persistent set of tiles rendered as a solid
 * PDF block, a scanned page, a sliced page, a re-flowing chunk grid, or
 * the final search grid. Shared layoutIds make the PDF literally break
 * apart into chunks (and reassemble on replay).
 */
export function ChunkCanvas({
  stage,
  level,
  answerRevealed = false,
  introFlash = false,
}: Props) {
  const isBlock = stage === 'intro' || stage === 'scan' || stage === 'slice'

  if (isBlock) {
    return (
      <div className="relative">
        <div
          className={cn(
            'relative flex w-[190px] flex-col overflow-hidden rounded-xl border border-black/[0.08] bg-white p-1.5 shadow-[0_4px_18px_rgba(0,0,0,0.06)] transition-[gap] duration-500',
            stage === 'slice' ? 'gap-[6px]' : 'gap-[2px]',
          )}
        >
          {Array.from({ length: INTRO_ROWS }, (_, i) => {
            // Row 0 is the Vacation Policy — the section the whole demo
            // tracks, tinted blue from the very first frame.
            const isTracked = i === 0
            const restingBg = isTracked
              ? 'rgba(0,113,227,0.10)'
              : 'rgba(0,0,0,0.05)'
            return (
              <motion.div
                key={`tile-${i}`}
                layoutId={`tile-${i}`}
                animate={{
                  // The cut: pieces visibly shear apart, not just drift.
                  x: stage === 'slice' ? (i % 2 === 0 ? -5 : 5) : 0,
                  ...(introFlash
                    ? {
                        backgroundColor: [
                          restingBg,
                          'rgba(0,113,227,0.45)',
                          restingBg,
                        ],
                      }
                    : {}),
                }}
                transition={
                  introFlash
                    ? { duration: 0.55, ease: 'easeOut', delay: i * 0.09 }
                    : SPRING
                }
                className={cn(
                  'flex h-[20px] items-center rounded-[3px] px-2 transition-[background-color,box-shadow] duration-400',
                  stage === 'slice'
                    ? isTracked
                      ? 'bg-[#0071e3]/[0.07] shadow-[0_1px_6px_rgba(0,113,227,0.25)] ring-1 ring-[#0071e3]/60'
                      : 'bg-white shadow-[0_1px_6px_rgba(0,113,227,0.18)] ring-1 ring-[#0071e3]/25'
                    : isTracked
                      ? 'bg-[#0071e3]/[0.10]'
                      : 'bg-black/[0.05]',
                )}
              >
                <span
                  className={cn(
                    'truncate text-[9px] leading-none',
                    isTracked
                      ? 'font-semibold text-[#0071e3]'
                      : 'font-medium text-[#86868b]',
                  )}
                >
                  {CHUNK_TITLES[i]}
                </span>
              </motion.div>
            )
          })}

          {/* Scan pass: a glowing line sweeps down, a soft wash follows. */}
          {stage === 'scan' && (
            <>
              <motion.div
                initial={{ height: '0%' }}
                animate={{ height: '100%' }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-x-0 top-0 bg-[#0071e3]/[0.07]"
              />
              <motion.div
                initial={{ top: '0%' }}
                animate={{ top: '99%' }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-x-0 h-[2px] bg-[#0071e3] shadow-[0_0_12px_rgba(0,113,227,0.7)]"
              />
            </>
          )}
        </div>
      </div>
    )
  }

  const levelIdx = stage === 'relevant' ? JUST_RIGHT_LEVEL : level
  const lvl = SIZE_LEVELS[levelIdx]

  return (
    <motion.ul
      layout
      className={cn('grid w-full max-w-[400px] gap-2', lvl.colsClass)}
    >
      <AnimatePresence initial={false}>
        {Array.from({ length: lvl.tiles }, (_, i) => {
          // The Vacation Policy stays highlighted on the search screen too
          // (until the reveal turns it solid) so the viewer never loses it.
          const tracked =
            (stage === 'chunks' && TRACKED_TILES[levelIdx].has(i)) ||
            (stage === 'relevant' && !answerRevealed && i === 0)
          const isRelevant =
            stage === 'relevant' && answerRevealed && RELEVANT_TILE_INDEXES.has(i)
          const isDimmed =
            stage === 'relevant' && answerRevealed && !RELEVANT_TILE_INDEXES.has(i)
          // The reveal breathes: the irrelevant tiles fade out slowly and
          // slightly staggered; only then do the three matches light up.
          const revealing = stage === 'relevant' && answerRevealed
          return (
            <motion.li
              key={`tile-${i}`}
              layoutId={`tile-${i}`}
              layout
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: isDimmed ? 0.22 : 1,
                scale: isRelevant ? 1.06 : 1,
              }}
              exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.18 } }}
              transition={
                revealing
                  ? {
                      ...SPRING,
                      opacity: {
                        duration: 1.3,
                        ease: 'easeInOut',
                        delay: 0.1 + i * 0.05,
                      },
                      scale: { ...SPRING, delay: 1.3 },
                    }
                  : SPRING
              }
              className={cn(
                'flex items-center justify-center overflow-hidden rounded-md border transition-[background-color,border-color,box-shadow]',
                revealing ? 'duration-700 delay-[1200ms]' : 'duration-300',
                lvl.tileClass,
                isRelevant
                  ? 'border-[#0071e3] bg-[#0071e3] shadow-[0_4px_14px_rgba(0,113,227,0.35)]'
                  : tracked
                    ? 'border-[#0071e3] bg-[#0071e3]/[0.07] shadow-[0_2px_8px_rgba(0,113,227,0.18)]'
                    : 'border-[#0071e3]/25 bg-white shadow-[0_2px_6px_rgba(0,113,227,0.08)]',
              )}
            >
              <TileContent
                levelIdx={levelIdx}
                index={i}
                inverted={isRelevant}
                tracked={tracked}
              />
            </motion.li>
          )
        })}
      </AnimatePresence>
    </motion.ul>
  )
}
