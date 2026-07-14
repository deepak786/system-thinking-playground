import { motion } from 'framer-motion'
import { Server, Timer } from 'lucide-react'
import { CLIENTS, windowLabel } from '../data'
import type { LimiterState } from '../types'
import { Card } from '../../../shared/Card'
import { cn } from '../../../lib/cn'

type ServerCardProps = {
  state: LimiterState
  now: number
}

/**
 * The API server's memory: one counter card per user showing used request
 * slots and how long until that user's window ends. Windows only reset when
 * the user's NEXT request arrives — exactly like the video's code — so an
 * ended window shows "next request starts fresh" instead of clearing itself.
 */
export function ServerCard({ state, now }: ServerCardProps) {
  return (
    <Card data-tour="server" accent="brand" className="px-4 py-3">
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
          <Server className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-slate-100">API Server</p>
        <span className="ml-auto rounded-full bg-slate-950/60 px-2.5 py-1 text-[11px] font-bold text-slate-300 ring-1 ring-slate-700">
          max {state.limit} per {windowLabel(state.windowMs)}
        </span>
      </div>
      <p className="mb-3 text-xs text-slate-400">
        For each user the server remembers just two things: how many requests
        they&apos;ve made, and when their counting window started.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CLIENTS.map((client) => {
          const window = state.windows[client.id]
          const elapsed = window ? now - window.windowStart : 0
          const expired = window !== undefined && elapsed > state.windowMs
          const remaining = window
            ? Math.max(0, (state.windowMs - elapsed) / 1000)
            : 0
          const atLimit = window !== undefined && window.count >= state.limit

          return (
            <div
              key={client.id}
              className="rounded-xl bg-slate-950/60 p-3 ring-1 ring-slate-800"
            >
              <div className="flex items-center gap-2">
                <span className={cn('h-2 w-2 rounded-full', client.accentDot)} />
                <p className="text-xs font-semibold text-slate-200">
                  {client.name}&apos;s counter
                </p>
                {atLimit && !expired && (
                  <span className="ml-auto rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-300 ring-1 ring-rose-500/40">
                    limit reached
                  </span>
                )}
              </div>

              {/* Request slots */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {Array.from({ length: state.limit }, (_, i) => {
                  const used = window !== undefined && !expired && i < window.count
                  return (
                    <motion.span
                      key={i}
                      className={cn(
                        'h-5 w-5 rounded-full ring-1',
                        used
                          ? cn(client.accentDot, 'ring-white/30')
                          : 'bg-slate-800 ring-slate-700',
                      )}
                      animate={{ scale: used ? 1 : 0.85 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    />
                  )
                })}
                <span className="ml-1 self-center text-[11px] font-medium text-slate-400">
                  {window && !expired ? window.count : 0} / {state.limit} used
                </span>
              </div>

              {/* Window countdown */}
              <div className="mt-2.5">
                {window === undefined ? (
                  <p className="text-[11px] text-slate-600">
                    No window yet — first request starts the clock
                  </p>
                ) : expired ? (
                  <p className="text-[11px] font-medium text-amber-300">
                    Window over — next request starts a fresh count
                  </p>
                ) : (
                  <div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={cn('h-full rounded-full', client.accentDot)}
                        style={{
                          width: `${Math.max(0, 100 - (elapsed / state.windowMs) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                      <Timer className="h-3 w-3" />
                      window ends in {remaining.toFixed(1)}s
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
