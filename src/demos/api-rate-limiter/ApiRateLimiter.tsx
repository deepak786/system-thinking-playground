import { useRateLimiter } from './hooks/useRateLimiter'
import { CLIENTS } from './data'
import { TOUR_STEPS } from './tourSteps'
import { Tour } from '../../shared/tour/Tour'
import { TourButton } from '../../shared/tour/TourButton'
import { useTour } from '../../shared/tour/useTour'
import { LearningGoals } from './components/LearningGoals'
import { ClientCard } from './components/ClientCard'
import { ServerCard } from './components/ServerCard'
import { EventLog } from './components/EventLog'
import { RuleBar } from './components/RuleBar'
import { WatchOnYouTube } from '../../shared/WatchOnYouTube'

/** Companion explainer video for this demo. */
const VIDEO_URL = 'https://www.youtube.com/watch?v=erGIBW5lI-s'

/**
 * Educational visualization of API rate limiting with a fixed time window:
 * each user gets a counter and a window; over the limit inside the window →
 * 429 Too Many Requests. Mirrors the RateLimiter class from the video.
 */
export function ApiRateLimiter() {
  const { state, now, sendRequest, setLimit, setWindowMs, reset } =
    useRateLimiter()
  const tour = useTour('api-rate-limiter')

  return (
    <div className="flex min-h-full flex-col gap-4">
      <Tour steps={TOUR_STEPS} open={tour.open} onClose={tour.close} />
      <LearningGoals />

      {/* Demo header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">
            How APIs Prevent Abuse
          </h1>
          <p className="mt-0.5 max-w-3xl text-sm text-slate-400">
            The server counts each user&apos;s requests inside a time window.
            Go over the limit and it answers{' '}
            <span className="font-semibold text-rose-300">
              429 Too Many Requests
            </span>{' '}
            until the window ends. This is called{' '}
            <span className="font-semibold text-slate-300">rate limiting</span>.
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
          {/* The two users */}
          <div data-tour="clients" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CLIENTS.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                history={state.history[client.id]}
                blockedTotal={state.blockedTotal[client.id]}
                onSend={() => sendRequest(client.id)}
              />
            ))}
          </div>

          {/* The server's memory */}
          <ServerCard state={state} now={now} />
        </div>

        {/* Server log: bounded so a long log scrolls inside the card */}
        <div data-tour="log" className="relative h-[300px] xl:h-auto xl:min-h-[260px]">
          <div className="absolute inset-0">
            <EventLog log={state.log} />
          </div>
        </div>
      </div>

      {/* Rule controls */}
      <div
        data-tour="rules"
        className="rounded-2xl bg-slate-900/60 p-3 ring-1 ring-slate-800"
      >
        <RuleBar
          limit={state.limit}
          windowMs={state.windowMs}
          onLimit={setLimit}
          onWindow={setWindowMs}
          onReset={reset}
        />
      </div>
    </div>
  )
}
