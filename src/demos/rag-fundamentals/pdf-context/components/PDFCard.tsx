import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { useOptionalLayoutId } from '../../../../lib/useLiteMotion'
import { PDF_NAME, PDF_PAGES } from '../data'
import { SPRING } from '../animations'

/**
 * The whole document — deliberately imposing, because the entire point
 * of the episode is that this never reaches ChatGPT.
 */
export function PDFCard() {
  const sharedId = useOptionalLayoutId('pdf-shell')
  return (
    <motion.div
      layoutId={sharedId}
      transition={SPRING}
      className="flex flex-col items-center gap-3 rounded-2xl border border-black/[0.08] bg-white px-12 py-7 shadow-[0_8px_28px_rgba(0,0,0,0.07)]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0071e3]/[0.08]">
        <FileText className="h-6 w-6 text-[#0071e3]" strokeWidth={1.5} />
      </span>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[15px] font-semibold text-[#1d1d1f]">{PDF_NAME}</span>
        <span className="text-[13px] text-[#86868b]">{PDF_PAGES} pages</span>
      </div>
    </motion.div>
  )
}
