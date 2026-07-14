import { useLruCache } from './hooks/useLruCache'
import { TOUR_STEPS } from './tourSteps'
import { Tour } from '../../shared/tour/Tour'
import { TourButton } from '../../shared/tour/TourButton'
import { useTour } from '../../shared/tour/useTour'
import { LearningGoals } from './components/LearningGoals'
import { ProfileBar } from './components/ProfileBar'
import { CacheCard } from './components/CacheCard'
import { DatabaseCard } from './components/DatabaseCard'
import { EventLog } from './components/EventLog'
import { ControlBar } from './components/ControlBar'
import { WatchOnYouTube } from '../../shared/WatchOnYouTube'

/** Companion explainer video for this demo. */
const VIDEO_URL = 'https://www.youtube.com/watch?v=qY-SfLh7et8'

/**
 * Educational visualization of an LRU cache: opening a cached profile is
 * instant and makes it "most recent"; a missing one takes a slow database
 * trip, and when the cache is full the least recently used profile is
 * evicted. Mirrors the Map-based LRUCache class from the video.
 */
export function LruCache() {
  const { state, openProfile, setCapacity, reset } = useLruCache()
  const tour = useTour('lru-cache')

  return (
    <div className="flex min-h-full flex-col gap-4">
      <Tour steps={TOUR_STEPS} open={tour.open} onClose={tour.close} />
      <LearningGoals />

      {/* Demo header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">
            Why Apps Load Faster: The LRU Cache
          </h1>
          <p className="mt-0.5 max-w-3xl text-sm text-slate-400">
            A cache keeps a few profiles in fast memory. Opening a cached one
            is instant ⚡; anything else needs a slow database trip 🐢. When
            the cache is full, the{' '}
            <span className="font-semibold text-slate-300">
              Least Recently Used
            </span>{' '}
            profile gets evicted.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <WatchOnYouTube href={VIDEO_URL} />
          <TourButton onClick={tour.start} />
        </div>
      </div>

      {/* Main workspace */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_minmax(300px,360px)]">
        <div className="flex flex-col gap-4">
          <ProfileBar state={state} onOpen={openProfile} />
          <CacheCard state={state} />
          <DatabaseCard state={state} />
        </div>

        {/* Story log: bounded so a long log scrolls inside the card */}
        <div data-tour="log" className="relative h-[300px] xl:h-auto xl:min-h-[260px]">
          <div className="absolute inset-0">
            <EventLog log={state.log} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        data-tour="controls"
        className="rounded-2xl bg-slate-900/60 p-3 ring-1 ring-slate-800"
      >
        <ControlBar
          capacity={state.capacity}
          disabled={state.fetching !== null}
          onCapacity={setCapacity}
          onReset={reset}
        />
      </div>
    </div>
  )
}
