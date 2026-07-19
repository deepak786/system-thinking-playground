import { MessageCircleQuestion } from 'lucide-react'
import { QUESTION } from '../data'

/** The one question the whole demo revolves around, as a quiet pill. */
export function QuestionBadge() {
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-black/[0.08] bg-white py-2 pl-3 pr-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <MessageCircleQuestion
        className="h-4 w-4 shrink-0 text-[#0071e3]"
        strokeWidth={1.75}
      />
      <span className="truncate text-[13px] font-medium text-[#1d1d1f]">
        &ldquo;{QUESTION}&rdquo;
      </span>
    </div>
  )
}
