import { cn } from '../../../../lib/cn'

type Props = {
  /** Overlap percentage, 0–50. */
  value: number
  onChange: (value: number) => void
}

/**
 * Hero control for the overlap step — Large↔Small twin of SizeSlider, but
 * continuous from 0% to 50% so the shared-text highlight grows smoothly.
 */
export function OverlapSlider({ value, onChange }: Props) {
  return (
    <div className="flex w-full max-w-[420px] flex-col gap-2">
      <span className="text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-[#1d1d1f]">
        Chunk Overlap
      </span>
      <div className="flex items-center gap-3">
        <span className="w-8 text-right text-[13px] font-medium text-[#6e6e73]">0%</span>
        <div className="relative flex-1">
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Chunk overlap"
            aria-valuetext={`${value} percent`}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-black/[0.10] outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fafaf9] [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#0071e3] [&::-moz-range-thumb]:shadow-[0_3px_10px_rgba(0,113,227,0.5)] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0071e3] [&::-webkit-slider-thumb]:shadow-[0_3px_10px_rgba(0,113,227,0.5)]"
          />
          {/* Mid marker at the educational default of 20%. */}
          <div className="pointer-events-none absolute inset-x-[10px] top-full mt-1.5 flex justify-between">
            {[0, 10, 20, 30, 40, 50].map((mark) => (
              <span
                key={mark}
                className={cn(
                  'h-1 w-1 rounded-full transition-colors duration-200',
                  mark === value ? 'bg-[#0071e3]' : 'bg-black/[0.15]',
                )}
              />
            ))}
          </div>
        </div>
        <span className="w-8 text-[13px] font-medium text-[#6e6e73]">50%</span>
      </div>
      <p className="mt-2 text-center text-[13px] text-[#86868b]">
        Overlap:{' '}
        <span className="font-semibold text-[#0071e3]">{value}%</span>
      </p>
      <p className="text-center text-[12px] leading-snug text-[#a1a1a6]">
        Chunk Overlap determines how much text is shared between consecutive
        chunks.
      </p>
    </div>
  )
}
