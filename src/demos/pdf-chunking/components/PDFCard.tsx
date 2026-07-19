import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { PDF_NAME, PDF_PAGES } from '../data'

type Props = {
  /** When true the card glows softly — "this is the thing to search". */
  glowing?: boolean
  className?: string
}

/** The big PDF identity card: icon, name, page count. */
export function PDFCard({ glowing = false, className }: Props) {
  return (
    <motion.div
      animate={
        glowing
          ? {
              boxShadow: [
                '0 4px 18px rgba(0,0,0,0.06)',
                '0 8px 36px rgba(0,113,227,0.30)',
                '0 4px 18px rgba(0,0,0,0.06)',
              ],
            }
          : { boxShadow: '0 4px 18px rgba(0,0,0,0.06)' }
      }
      transition={
        glowing
          ? { duration: 2.2, ease: 'easeInOut', repeat: Infinity }
          : { duration: 0.5 }
      }
      className={cn(
        'flex items-center gap-4 rounded-2xl border border-black/[0.08] bg-white px-6 py-5',
        className,
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0071e3]/[0.08] ring-1 ring-inset ring-[#0071e3]/15">
        <FileText className="h-6 w-6 text-[#0071e3]" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col">
        <span className="text-[16px] font-semibold text-[#1d1d1f]">
          {PDF_NAME}
        </span>
        <span className="text-[13px] text-[#86868b]">{PDF_PAGES} pages</span>
      </div>
    </motion.div>
  )
}
