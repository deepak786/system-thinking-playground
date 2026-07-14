import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { profileByKey } from '../data'
import type { CacheState } from '../types'
import { Card } from '../../../shared/Card'
import { cn } from '../../../lib/cn'

type CacheCardProps = {
  state: CacheState
}

/**
 * The cache itself: capacity slots ordered least → most recently used, like
 * the video's Map. Profiles keep their layoutId, so a cache hit visibly
 * slides a card to the "most recent" end, and an eviction pushes the
 * leftmost card out.
 */
export function CacheCard({ state }: CacheCardProps) {
  const emptySlots = Math.max(0, state.capacity - state.cache.length)

  return (
    <Card accent="brand" className="px-4 py-3">
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30">
          <Zap className="h-4 w-4" />
        </span>
        <p className="text-sm font-semibold text-slate-100">Cache (memory)</p>
        <span className="ml-auto flex items-center gap-2 text-[11px] font-semibold">
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300 ring-1 ring-emerald-500/40">
            {state.hits} instant ⚡
          </span>
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-300 ring-1 ring-amber-500/40">
            {state.misses} slow 🐢
          </span>
        </span>
      </div>
      <p className="mb-3 text-xs text-slate-400">
        Tiny but instant storage for {state.capacity} profiles. When it&apos;s
        full, the one nobody has used for the longest gets thrown out.
      </p>

      <div className="flex items-center gap-2">
        <span className="w-16 shrink-0 text-center text-[10px] font-bold leading-tight text-rose-300">
          LEAST recent
          <span className="block font-medium text-slate-500">next out</span>
        </span>

        <div className="flex min-h-[64px] flex-1 items-center gap-2 rounded-xl bg-slate-950/60 px-3 py-2.5 ring-1 ring-slate-800">
          <AnimatePresence initial={false}>
            {state.cache.map((key) => {
              const profile = profileByKey[key]
              return (
                <motion.div
                  key={key}
                  layout
                  layoutId={`cache-${key}`}
                  initial={{ opacity: 0, y: -18, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 22, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                  className="flex flex-col items-center gap-1"
                >
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-slate-950',
                      profile.bg,
                    )}
                  >
                    {key}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400">
                    {profile.name}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {Array.from({ length: emptySlots }, (_, i) => (
            <div
              key={`empty-${i}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-700 text-[10px] text-slate-600"
            >
              free
            </div>
          ))}

          {state.cache.length === 0 && emptySlots === 0 ? null : (
            <span className="ml-auto hidden text-slate-600 sm:block">
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </div>

        <span className="w-16 shrink-0 text-center text-[10px] font-bold leading-tight text-emerald-300">
          MOST recent
          <span className="block font-medium text-slate-500">just used</span>
        </span>
      </div>
    </Card>
  )
}
