import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Seo } from '../components/Seo'
import { DemoCard } from '../components/DemoCard'
import { demoPath } from '../demos/paths'
import type { SeriesDemo } from '../demos/types'
import { cn } from '../lib/cn'

type SeriesHubProps = {
  series: SeriesDemo
}

/**
 * Series landing page: title, blurb, and a DemoCard for each nested demo.
 * Any registry entry with a `demos` array gets this hub at `/{id}`.
 */
export function SeriesHub({ series }: SeriesHubProps) {
  const { demos: episodes } = series
  const Icon = series.icon

  return (
    <div className="flex h-full flex-col gap-6">
      <Seo
        title={series.title}
        description={series.metaDescription ?? series.description}
      />

      <div>
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          All demos
        </Link>

        <div className="flex items-start gap-3">
          <span
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 ring-1 ring-slate-700',
              series.accentClass,
            )}
          >
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
                {series.title}
              </h1>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300 ring-1 ring-slate-700">
                {episodes.length}-part series
              </span>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              {series.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {episodes.map((episode, i) => (
          <DemoCard key={episode.id} demo={episode} part={i + 1} />
        ))}
      </div>

      {episodes[0] && (
        <Link
          to={demoPath(episodes[0])}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-400 transition-colors hover:text-brand-300"
        >
          Start with Part 1
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
