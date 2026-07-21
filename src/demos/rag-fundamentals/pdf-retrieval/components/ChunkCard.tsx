import { motion } from 'framer-motion'
import { FileText, MessageCircleQuestion } from 'lucide-react'
import { cn } from '../../../../lib/cn'
import { useLiteMotion, useOptionalLayoutId } from '../../../../lib/useLiteMotion'
import type { Relevance } from '../data'
import { RelevanceBadge } from './RelevanceBadge'

export type ChunkCardProps = {
  title: string
  relevance: Relevance
  /** Index in the grid — drives stagger delays for glow and fade. */
  index?: number
  /** Compact variant used inside the context box. */
  mini?: boolean
  /** One-shot soft glow (the "should AI read every chunk?" beat). */
  glowing?: boolean
  /** The question is checking this card right now. */
  active?: boolean
  /** The sweep has passed this card — show its verdict. */
  verdictShown?: boolean
  /** This card was checked a moment ago (keeps its x-stamp briefly). */
  justChecked?: boolean
  /** Irrelevant cards drop to near-invisible (the slow narrowing). */
  faded?: boolean
}

const SPRING = { type: 'spring', stiffness: 300, damping: 30 } as const

/**
 * One chunk of the PDF. The same card (shared layoutId per title) lives
 * on the wall, reacts to the passing question, and — if it survives —
 * flies into the context box at the end.
 */
export function ChunkCard({
  title,
  relevance,
  index = 0,
  mini = false,
  glowing = false,
  active = false,
  verdictShown = false,
  justChecked = false,
  faded = false,
}: ChunkCardProps) {
  const lite = useLiteMotion()
  const sharedId = useOptionalLayoutId(`card-${title}`)
  const rejected = verdictShown && relevance === 'no'
  const kept = verdictShown && relevance !== 'no'

  return (
    <motion.div
      layoutId={sharedId}
      layout={!lite}
      animate={{
        opacity: faded && relevance === 'no' ? 0.12 : rejected ? 0.55 : 1,
        scale: active ? 1.07 : 1,
        ...(glowing
          ? {
              boxShadow: [
                '0 1px 4px rgba(0,0,0,0.04)',
                '0 0 16px rgba(0,113,227,0.35)',
                '0 1px 4px rgba(0,0,0,0.04)',
              ],
            }
          : {}),
      }}
      transition={
        glowing
          ? { duration: 0.7, ease: 'easeInOut', delay: index * 0.035 }
          : faded
            ? { ...SPRING, opacity: { duration: 1.1, ease: 'easeInOut', delay: index * 0.04 } }
            : { ...SPRING, opacity: { duration: 0.3 } }
      }
      className={cn(
        'relative flex items-center gap-1.5 rounded-xl border bg-white',
        mini ? 'h-9 px-2.5' : 'h-12 px-2.5',
        active
          ? 'border-[#0071e3] shadow-[0_4px_16px_rgba(0,113,227,0.28)]'
          : kept
            ? relevance === 'yes'
              ? 'border-[#0071e3] bg-[#0071e3]/[0.06] shadow-[0_2px_10px_rgba(0,113,227,0.16)]'
              : 'border-[#0071e3]/50 bg-[#0071e3]/[0.04] shadow-[0_2px_8px_rgba(0,113,227,0.10)]'
            : 'border-black/[0.08] shadow-[0_1px_4px_rgba(0,0,0,0.04)]',
        'transition-[border-color,background-color] duration-300',
      )}
    >
      <FileText
        className={cn(
          'shrink-0',
          mini ? 'h-3 w-3' : 'h-3.5 w-3.5',
          kept || active ? 'text-[#0071e3]' : 'text-[#a1a1a6]',
        )}
        strokeWidth={1.75}
      />
      <span
        className={cn(
          'truncate font-medium leading-tight',
          mini ? 'text-[10px]' : 'text-[11px]',
          kept || active ? 'text-[#1d1d1f]' : rejected ? 'text-[#a1a1a6]' : 'text-[#3d3d3f]',
        )}
      >
        {title}
      </span>

      {/* The question, visiting. */}
      {active && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0071e3] shadow-[0_2px_8px_rgba(0,113,227,0.4)]"
        >
          <MessageCircleQuestion className="h-3 w-3 text-white" strokeWidth={2.25} />
        </motion.span>
      )}

      {/* Kept chunks wear their check permanently; a rejection x only
          flashes on the card the question just left, keeping the wall calm. */}
      {!active && verdictShown && !mini && (relevance !== 'no' || justChecked) && (
        <RelevanceBadge relevance={relevance} />
      )}
    </motion.div>
  )
}
