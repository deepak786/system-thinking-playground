import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { DemoDefinition, Difficulty, SeriesDemo } from '../demos/types'
import { demoPath, seriesPath } from '../demos/paths'
import { cn } from '../lib/cn'

const difficultyStyles: Record<Difficulty, string> = {
  Beginner: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  Intermediate: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  Advanced: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
}

type DemoCardProps = {
  demo: DemoDefinition
  /** 1-based series position; shown as a "Part N" badge when set. */
  part?: number
}

/** Shared card used on Home (standalone demos) and on series hub pages. */
export function DemoCard({ demo, part }: DemoCardProps) {
  const Icon = demo.icon
  return (
    <Link
      to={demoPath(demo)}
      className="group flex flex-col gap-3 rounded-2xl bg-slate-900/70 p-5 ring-1 ring-slate-700/60 shadow-soft transition-all hover:-translate-y-0.5 hover:ring-slate-500/70"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 ring-1 ring-slate-700',
            demo.accentClass,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex items-center gap-1.5">
          {part !== undefined && (
            <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
              Part {part}
            </span>
          )}
          {demo.difficulty && (
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
                difficultyStyles[demo.difficulty],
              )}
            >
              {demo.difficulty}
            </span>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-100">{demo.title}</h2>
        <p className="mt-1 text-sm text-slate-400">{demo.description}</p>
      </div>

      {demo.concepts && demo.concepts.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {demo.concepts.map((concept) => (
            <span
              key={concept}
              className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 ring-1 ring-slate-700"
            >
              {concept}
            </span>
          ))}
        </div>
      )}

      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400">
        Open demo
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

/** Same grid footprint as DemoCard; links to the series hub instead of a demo. */
export function SeriesCard({ series }: { series: SeriesDemo }) {
  const Icon = series.icon
  const episodeCount = series.demos.length

  return (
    <Link
      to={seriesPath(series)}
      className="group flex flex-col gap-3 rounded-2xl bg-slate-900/70 p-5 ring-1 ring-slate-700/60 shadow-soft transition-all hover:-translate-y-0.5 hover:ring-slate-500/70"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 ring-1 ring-slate-700',
            series.accentClass,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
          {episodeCount}-part series
        </span>
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-100">{series.title}</h2>
        <p className="mt-1 text-sm text-slate-400">{series.description}</p>
      </div>

      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400">
        View series
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
