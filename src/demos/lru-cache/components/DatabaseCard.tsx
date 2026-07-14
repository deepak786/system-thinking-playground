import { motion } from 'framer-motion'
import { Database, Turtle } from 'lucide-react'
import { PROFILES } from '../data'
import type { CacheState } from '../types'
import { Card } from '../../../shared/Card'
import { cn } from '../../../lib/cn'

type DatabaseCardProps = {
  state: CacheState
}

/**
 * The slow database: it always has every profile, but every trip takes ages.
 * While a fetch is in flight the requested profile pulses amber.
 */
export function DatabaseCard({ state }: DatabaseCardProps) {
  return (
    <Card data-tour="database" className="px-4 py-3">
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30">
          <Database className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-slate-100">Database (disk)</p>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <Turtle className="h-3.5 w-3.5" />
          has everything, but every trip is slow
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {PROFILES.map((profile) => {
          const isFetching = state.fetching === profile.key
          return (
            <div
              key={profile.key}
              className={cn(
                'flex items-center gap-2 rounded-lg bg-slate-950/60 px-2.5 py-1.5 ring-1',
                isFetching ? 'ring-amber-400/70' : 'ring-slate-800',
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-slate-950',
                  profile.bg,
                  !isFetching && 'opacity-60',
                )}
              >
                {profile.key}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                {profile.name}
              </span>
            </div>
          )
        })}

        {state.fetching && (
          <motion.span
            key={state.fetching}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="ml-1 rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-semibold text-amber-300 ring-1 ring-amber-500/40"
          >
            fetching User {state.fetching}… 🐢
          </motion.span>
        )}
      </div>
    </Card>
  )
}
