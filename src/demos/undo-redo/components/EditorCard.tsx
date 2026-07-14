import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { Card } from '../../../shared/Card'

type EditorCardProps = {
  text: string
}

/**
 * The "text editor" whose content is always the TOP of the Undo Stack —
 * shown big so viewers instantly see what undo/redo did to the text.
 */
export function EditorCard({ text }: EditorCardProps) {
  return (
    <Card accent="violet" className="px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30">
          <FileText className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-slate-100">Text Editor</p>
        <span className="ml-auto text-[11px] text-slate-500">
          always shows the top of the Undo Stack
        </span>
      </div>

      <div className="rounded-xl bg-slate-950/70 px-4 py-4 ring-1 ring-slate-800">
        <motion.p
          key={text}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          className="break-words font-mono text-lg font-semibold text-slate-100"
        >
          {text}
          <motion.span
            className="ml-0.5 inline-block h-5 w-[2px] translate-y-0.5 bg-violet-300"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          />
        </motion.p>
      </div>
    </Card>
  )
}
