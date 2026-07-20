import { Columns2 } from 'lucide-react'
import { Button } from '../../../shared/Button'
import type { ChapterBeat, ChapterDefinition } from '../types'

type StoryPanelProps = {
  chapter: ChapterDefinition
  beat: ChapterBeat
  canGoNext: boolean
  canOpenCompare: boolean
  onNext: () => void
  onOpenCompare: () => void
}

/** Scannable Idea / Why / Key takeaway blocks. */
export function StoryPanel({
  chapter,
  beat,
  canGoNext,
  canOpenCompare,
  onNext,
  onOpenCompare,
}: StoryPanelProps) {
  const showTakeaway = beat === 'revealing' || beat === 'conclude'

  return (
    <aside className="flex h-full flex-col rounded-2xl bg-slate-900/50 px-5 py-5 ring-1 ring-slate-800/80">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Step {chapter.step} of 4
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">
        {chapter.title}
      </h2>

      <div className="mt-5 flex-1 space-y-4">
        <ExplainBlock label="Idea" text={chapter.idea} />
        <ExplainBlock label="Why?" text={chapter.why} />
        {chapter.realWorld && (
          <ExplainBlock label="Real-world example" text={chapter.realWorld} />
        )}

        {showTakeaway && (
          <ExplainBlock label="Key takeaway" text={chapter.takeaway} />
        )}
      </div>

      {(canGoNext || (canOpenCompare && chapter.step === 4)) && (
        <div className="mt-5 border-t border-slate-800/80 pt-4">
          {canGoNext && (
            <Button variant="primary" className="w-full" onClick={onNext}>
              Continue →
            </Button>
          )}
          {!canGoNext && canOpenCompare && chapter.step === 4 && (
            <Button
              variant="primary"
              className="w-full"
              icon={<Columns2 className="h-4 w-4" />}
              onClick={onOpenCompare}
            >
              Compare
            </Button>
          )}
        </div>
      )}
    </aside>
  )
}

function ExplainBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-1 text-sm leading-snug text-slate-200">{text}</p>
    </div>
  )
}
