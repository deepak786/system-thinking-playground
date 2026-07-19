import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { SPRING } from '../animations'

type Props = {
  title: string
  /** Identity: selected chunks carry a stable layoutId across stages. */
  selected?: boolean
  /** Styling: blue emphasis (turned on when the selection is revealed). */
  highlighted?: boolean
  /** Non-selected chunks sink away once the selection is made. */
  faded?: boolean
  /** Compact variant used inside the package. */
  mini?: boolean
}

/**
 * One chunk of the PDF. Selected chunks carry a stable layoutId
 * (`ctx-chunk-<title>`) so the exact card highlighted in the split is
 * the one that lands in the context package.
 */
export function ChunkCard({
  title,
  selected = false,
  highlighted = false,
  faded = false,
  mini = false,
}: Props) {
  return (
    <motion.div
      layoutId={selected ? `ctx-chunk-${title}` : undefined}
      layout={selected}
      animate={{ opacity: faded ? 0.15 : 1 }}
      transition={{
        ...SPRING,
        opacity: faded ? { duration: 1.0, ease: 'easeInOut' } : { duration: 0.3 },
      }}
      className={cn(
        'flex items-center gap-1.5 rounded-xl border bg-white',
        mini ? 'h-9 px-2.5' : 'h-11 px-3',
        highlighted
          ? 'border-[#0071e3] bg-[#0071e3]/[0.06] shadow-[0_2px_10px_rgba(0,113,227,0.16)]'
          : 'border-black/[0.08] shadow-[0_1px_4px_rgba(0,0,0,0.04)]',
        'transition-[border-color,background-color,box-shadow] duration-300',
      )}
    >
      <FileText
        className={cn(
          'shrink-0',
          mini ? 'h-3 w-3' : 'h-3.5 w-3.5',
          highlighted ? 'text-[#0071e3]' : 'text-[#a1a1a6]',
        )}
        strokeWidth={1.75}
      />
      <span
        className={cn(
          'truncate font-medium leading-tight',
          mini ? 'text-[11px]' : 'text-[12px]',
          highlighted ? 'text-[#1d1d1f]' : 'text-[#6e6e73]',
        )}
      >
        {title}
      </span>
    </motion.div>
  )
}
