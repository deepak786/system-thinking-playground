import { Link } from 'react-router-dom'
import { ArrowRight, ListVideo } from 'lucide-react'
import { Seo } from '../components/Seo'
import { demoRegistry } from '../demos/demoRegistry'
import type { DemoDefinition, Difficulty } from '../demos/types'
import { demoPath } from '../demos/paths'
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

function DemoCard({ demo, part }: DemoCardProps) {
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
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
              difficultyStyles[demo.difficulty],
            )}
          >
            {demo.difficulty}
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-100">{demo.title}</h2>
        <p className="mt-1 text-sm text-slate-400">{demo.description}</p>
      </div>

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

      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400">
        Open demo
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

/**
 * Landing page, generated from the registry. Standalone demos get one card
 * each; a series anchor and its episodes are grouped into a named section
 * with "Part N" badges, in registry order.
 */
export function Home() {
  const standalone = demoRegistry.filter((d) => !d.partOf && !d.seriesTitle)
  const seriesAnchors = demoRegistry.filter((d) => d.seriesTitle)

  return (
    <div className="flex h-full flex-col gap-6">
      <Seo description="Interactive visualizations of how real-world systems work — queues, caches, rate limiters and more. Learn by pressing buttons, no backend knowledge needed." />

      <div>
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
          System Thinking Playground
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Interactive visualizations of how real-world systems work. Pick a
          demo and learn by pressing buttons — no backend knowledge needed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {standalone.map((demo) => (
          <DemoCard key={demo.id} demo={demo} />
        ))}
      </div>

      {seriesAnchors.map((anchor) => {
        const episodes = demoRegistry.filter((d) => d.partOf === anchor.id)
        return (
          <section
            key={anchor.id}
            className="flex flex-col gap-4 rounded-3xl bg-slate-900/40 p-5 ring-1 ring-slate-800 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
                <ListVideo className="h-5 w-5" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-100">
                    {anchor.seriesTitle}
                  </h2>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300 ring-1 ring-slate-700">
                    {episodes.length + 1}-part series
                  </span>
                </div>
                {anchor.seriesDescription && (
                  <p className="mt-0.5 max-w-2xl text-sm text-slate-400">
                    {anchor.seriesDescription}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <DemoCard demo={anchor} part={1} />
              {episodes.map((episode, i) => (
                <DemoCard key={episode.id} demo={episode} part={i + 2} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
