import { useConnectionSearch } from './hooks/useConnectionSearch'
import { WatchOnYouTube } from '../../shared/WatchOnYouTube'
import { LearningGoals } from './components/LearningGoals'
import { NetworkGraph } from './components/NetworkGraph'
import { QueuePanel } from './components/QueuePanel'
import { LevelsPanel } from './components/LevelsPanel'
import { PathStrip } from './components/PathStrip'
import { EventLog } from './components/EventLog'
import { ControlBar } from './components/ControlBar'

/** Companion explainer video for this demo. */
const VIDEO_URL = 'https://www.youtube.com/watch?v=I0u9bU08PUs'

/**
 * Educational visualization of how LinkedIn labels people 1st / 2nd / 3rd:
 * a breadth-first search ripples outward from You, one level at a time,
 * powered by a simple waiting line (queue). Everything is simulated in
 * local React state.
 */
export function LinkedInConnections() {
  const { state, selectedPath, stepOnce, play, pause, selectPerson, reset } =
    useConnectionSearch()

  return (
    <div className="flex min-h-full flex-col gap-4">
      <LearningGoals />

      {/* Demo header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">
            How LinkedIn Knows Someone Is a &ldquo;2nd&rdquo; Connection
          </h1>
          <p className="mt-0.5 max-w-3xl text-sm text-slate-400">
            Watch a search ripple out from You, one friendship at a time: your
            direct connections get labeled 1st, their connections 2nd, and so
            on. This level-by-level exploration is called{' '}
            <span className="font-semibold text-slate-300">
              Breadth-First Search (BFS)
            </span>
            .
          </p>
        </div>
        <WatchOnYouTube href={VIDEO_URL} />
      </div>

      {/* Main workspace: graph beside the panels on wide screens (xl+),
          stacked on top of them otherwise so the graph never gets cramped. */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_minmax(300px,360px)]">
        {/* Graph + shortest path */}
        <div className="flex flex-col gap-3 rounded-2xl bg-slate-900/40 p-4 ring-1 ring-slate-800">
          <div className="mx-auto w-full max-w-[760px]">
            <NetworkGraph
              state={state}
              selectedPath={selectedPath}
              onSelect={selectPerson}
            />
          </div>
          <PathStrip state={state} selectedPath={selectedPath} />
        </div>

        {/* Levels + story: side by side when stacked, a column when beside
            the graph. The story card is absolutely positioned inside a
            bounded wrapper so a long log scrolls instead of clipping or
            stretching the page. */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:flex xl:flex-col">
          <LevelsPanel state={state} onSelect={selectPerson} />
          <div className="relative h-[300px] md:h-auto md:min-h-[260px] xl:min-h-[260px] xl:flex-1">
            <div className="absolute inset-0">
              <EventLog log={state.log} />
            </div>
          </div>
        </div>
      </div>

      {/* The queue — the engine of BFS */}
      <QueuePanel state={state} />

      {/* Controls */}
      <div className="rounded-2xl bg-slate-900/60 p-3 ring-1 ring-slate-800">
        <ControlBar
          auto={state.auto}
          done={state.done}
          onStep={stepOnce}
          onPlay={play}
          onPause={pause}
          onReset={reset}
        />
      </div>
    </div>
  )
}
