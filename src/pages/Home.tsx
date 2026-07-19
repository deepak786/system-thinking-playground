import { Seo } from '../components/Seo'
import { DemoCard, SeriesCard } from '../components/DemoCard'
import { demoRegistry } from '../demos/demoRegistry'
import { isSeries } from '../demos/types'

/**
 * Landing page from `demoRegistry`. Top-level entries share one card grid in
 * registry order — series cards link to hubs, never straight into an episode.
 */
export function Home() {
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
        {demoRegistry.map((entry) =>
          isSeries(entry) ? (
            <SeriesCard key={entry.id} series={entry} />
          ) : (
            <DemoCard key={entry.id} demo={entry} />
          ),
        )}
      </div>
    </div>
  )
}
