import { MousePointerClick, Zap } from 'lucide-react'
import { PROFILES } from '../data'
import type { CacheState, ProfileKey } from '../types'
import { Card } from '../../../shared/Card'
import { cn } from '../../../lib/cn'

type ProfileBarProps = {
  state: CacheState
  onOpen: (key: ProfileKey) => void
}

/**
 * The five profiles a user can open. A ⚡ badge marks the ones currently in
 * the cache — those will open instantly instead of hitting the database.
 */
export function ProfileBar({ state, onOpen }: ProfileBarProps) {
  return (
    <Card data-tour="profiles" className="px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30">
          <MousePointerClick className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-slate-100">Open a Profile</p>
        <span className="ml-auto text-[11px] text-slate-500">
          ⚡ = already in the cache, opens instantly
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {PROFILES.map((profile) => {
          const cached = state.cache.includes(profile.key)
          const isFetching = state.fetching === profile.key
          return (
            <button
              key={profile.key}
              onClick={() => onOpen(profile.key)}
              disabled={state.fetching !== null}
              className={cn(
                'relative flex flex-col items-center gap-1.5 rounded-xl bg-slate-950/60 px-4 py-2.5 ring-1 ring-slate-800',
                'transition-all duration-150 hover:ring-slate-600 active:scale-[0.96]',
                'disabled:cursor-not-allowed disabled:opacity-50',
                isFetching && 'opacity-100 ring-amber-500/60',
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-slate-950',
                  profile.bg,
                )}
              >
                {profile.key}
              </span>
              <span className="text-[11px] font-semibold text-slate-300">
                {profile.name}
              </span>
              {cached && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 ring-2 ring-slate-950">
                  <Zap className="h-3 w-3" strokeWidth={3} />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
