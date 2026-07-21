import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { useEntranceVariants } from '../animations'
import { DOCUMENTS } from '../data'
import { cn } from '../../../../lib/cn'

/**
 * The fictional company library — scenery, not controls. Display-only on this
 * screen: no checkboxes, no upload. The quiet hint line plants the seed that
 * pays off in later steps when one document gets highlighted.
 */
export function DocumentLibrary() {
  const { rise, cards, lite } = useEntranceVariants()

  return (
    <motion.section variants={rise} aria-label="Company documents">
      <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#86868b]">
        Company Documents
      </p>
      <p className="mt-1 text-sm text-[#86868b]">
        These are the files ChatGPT will search.
      </p>

      {/* Sub-grid trick: cards span 2 tracks of a 4/6-track grid so the
          orphan rows (2 cards on desktop, 1 on tablet) sit centered instead
          of ragged-left under a full row. */}
      <motion.ul
        variants={cards}
        className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4 lg:grid-cols-6"
      >
        {DOCUMENTS.map((doc, i) => (
          <motion.li
            key={doc.name}
            variants={rise}
            // Hover lift is desktop-only — continuous whileHover during
            // scroll/tap on phones is what made the intro feel sticky.
            whileHover={lite ? undefined : { y: -2, transition: { duration: 0.2 } }}
            whileTap={lite ? { scale: 0.98 } : undefined}
            className={cn(
              'flex min-h-[80px] items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[box-shadow,border-color] duration-200 hover:border-black/[0.1] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] sm:col-span-2',
              i === 3 && 'lg:col-start-2',
              i === 4 && 'sm:col-start-2 lg:col-start-auto',
            )}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f5f5f4] ring-1 ring-inset ring-black/[0.04]">
              <FileText className="h-[18px] w-[18px] text-[#6e6e73]" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="block text-balance text-[15px] font-medium leading-tight text-[#1d1d1f]">
                {doc.name}
              </span>
              <span className="mt-0.5 block text-[13px] tabular-nums text-[#86868b]">
                PDF · {doc.pages} pages
              </span>
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  )
}
