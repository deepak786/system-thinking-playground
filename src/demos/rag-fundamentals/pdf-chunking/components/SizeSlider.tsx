import { SIZE_LEVELS } from '../data'
import { cn } from '../../../../lib/cn'

type Props = {
  level: number
  onChange: (level: number) => void
}

/**
 * The demo's hero control — the viewer *is* the chunking algorithm.
 * Five stops from Large to Small; the grid, labels, and counts react
 * live to every drag.
 */
export function SizeSlider({ level, onChange }: Props) {
  return (
    <div className="flex w-full max-w-[420px] flex-col gap-2">
      <span className="text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-[#1d1d1f]">
        Chunk Size
      </span>
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-medium text-[#6e6e73]">Large</span>
        <div className="relative flex-1">
          <input
            type="range"
            min={0}
            max={SIZE_LEVELS.length - 1}
            step={1}
            value={level}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Chunk size"
            aria-valuetext={SIZE_LEVELS[level].label}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-black/[0.10] outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fafaf9] [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#0071e3] [&::-moz-range-thumb]:shadow-[0_3px_10px_rgba(0,113,227,0.5)] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0071e3] [&::-webkit-slider-thumb]:shadow-[0_3px_10px_rgba(0,113,227,0.5)]"
          />
          {/* Stop markers so the five positions are discoverable. */}
          <div className="pointer-events-none absolute inset-x-[10px] top-full mt-1.5 flex justify-between">
            {SIZE_LEVELS.map((lvl, i) => (
              <span
                key={lvl.label}
                className={cn(
                  'h-1 w-1 rounded-full transition-colors duration-200',
                  i === level ? 'bg-[#0071e3]' : 'bg-black/[0.15]',
                )}
              />
            ))}
          </div>
        </div>
        <span className="text-[13px] font-medium text-[#6e6e73]">Small</span>
      </div>
    </div>
  )
}
