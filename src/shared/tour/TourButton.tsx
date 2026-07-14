import { HelpCircle } from 'lucide-react'

type TourButtonProps = {
  onClick: () => void
}

/** Small "Tour" button demos put in their header to replay the onboarding. */
export function TourButton({ onClick }: TourButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 ring-1 ring-slate-700 transition-colors hover:bg-slate-700 hover:text-slate-100"
    >
      <HelpCircle className="h-4 w-4" />
      Tour
    </button>
  )
}
