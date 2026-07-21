import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getStrategy } from '../algorithms/registry'
import { CHAPTERS } from '../narration/chapters'
import type {
  ChapterId,
  CoffeeShop,
  HexCell,
  Point,
  QuadNodeVis,
  SearchResult,
} from '../types'
import {
  GRID_DIM,
  MAX_ANIMATED_VISITS,
  REVEAL_MS,
  SEARCH_MS,
} from '../utils/constants'
import { ExhibitMap } from './ExhibitMap'

type CompareModeProps = {
  shops: CoffeeShop[]
  /** Last location chosen in the story steps. */
  initialUser: Point
  quadPreview: QuadNodeVis[]
  hexLattice: HexCell[]
}

type LaneState = {
  result: SearchResult | null
  visitProgress: number
  beat: 'ready' | 'searching' | 'revealing' | 'conclude'
}

/**
 * Four synchronized maps — same click, four partitioning ideas.
 */
export function CompareMode({
  shops,
  initialUser,
  quadPreview,
  hexLattice,
}: CompareModeProps) {
  const [user, setUser] = useState<Point>(() => ({ ...initialUser }))
  const [lanes, setLanes] = useState<Record<ChapterId, LaneState>>(() =>
    emptyLanes(),
  )
  const runIdRef = useRef(0)
  const initialUserRef = useRef(initialUser)
  initialUserRef.current = initialUser

  const runAll = useCallback(
    (point: Point) => {
      runIdRef.current += 1
      const myId = runIdRef.current
      setUser(point)

      const results = Object.fromEntries(
        CHAPTERS.map((ch) => {
          const result = getStrategy(ch.id).search(point, shops, {
            gridDim: GRID_DIM,
          })
          return [ch.id, result] as const
        }),
      ) as Record<ChapterId, SearchResult>

      setLanes(
        Object.fromEntries(
          CHAPTERS.map((ch) => [
            ch.id,
            {
              result: results[ch.id]!,
              visitProgress: 0,
              beat: 'searching' as const,
            },
          ]),
        ) as Record<ChapterId, LaneState>,
      )

      const start = performance.now()
      let lastCommit = 0
      const tick = (now: number) => {
        if (runIdRef.current !== myId) return
        const t = Math.min(1, (now - start) / SEARCH_MS)
        const eased = 1 - (1 - t) * (1 - t)
        if (t >= 1 || now - lastCommit >= 33) {
          lastCommit = now
          setLanes((prev) => {
            const next = { ...prev }
            for (const ch of CHAPTERS) {
              next[ch.id] = {
                ...next[ch.id]!,
                visitProgress: eased,
                beat: t < 1 ? 'searching' : 'revealing',
              }
            }
            return next
          })
        }
        if (t < 1) {
          requestAnimationFrame(tick)
        } else {
          window.setTimeout(() => {
            if (runIdRef.current !== myId) return
            setLanes((prev) => {
              const next = { ...prev }
              for (const ch of CHAPTERS) {
                next[ch.id] = { ...next[ch.id]!, beat: 'conclude' }
              }
              return next
            })
          }, REVEAL_MS)
        }
      }
      requestAnimationFrame(tick)
    },
    [shops],
  )

  // Replay the last story location across all four methods.
  useEffect(() => {
    runAll({ ...initialUserRef.current })
  }, [runAll])

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {CHAPTERS.map((ch) => {
          const lane = lanes[ch.id]!
          return (
            <CompareLane
              key={ch.id}
              chapterId={ch.id}
              title={ch.title}
              shops={shops}
              user={user}
              lane={lane}
              quadPreview={quadPreview}
              hexLattice={hexLattice}
              onClick={runAll}
            />
          )
        })}
      </div>

      <section className="rounded-2xl bg-slate-900/50 px-6 py-5 ring-1 ring-slate-800/80">
        <p className="text-xs font-semibold text-slate-400">Key takeaway</p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
          Spatial indexing is not about making each distance check faster. It
          is about skipping the checks you do not need at all.
        </p>
      </section>
    </div>
  )
}

function CompareLane({
  chapterId,
  title,
  shops,
  user,
  lane,
  quadPreview,
  hexLattice,
  onClick,
}: {
  chapterId: ChapterId
  title: string
  shops: CoffeeShop[]
  user: Point
  lane: LaneState
  quadPreview: QuadNodeVis[]
  hexLattice: HexCell[]
  onClick: (p: Point) => void
}) {
  const animatedCandidateIds = useMemo(() => {
    const ids = lane.result?.candidateIds ?? []
    if (ids.length <= MAX_ANIMATED_VISITS) return ids
    const out: number[] = []
    const step = ids.length / MAX_ANIMATED_VISITS
    for (let i = 0; i < MAX_ANIMATED_VISITS; i++) {
      out.push(ids[Math.floor(i * step)]!)
    }
    return out
  }, [lane.result])

  return (
    <div className="overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-slate-800/80">
      <div className="px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      </div>
      <div className="px-3 pb-3">
        <ExhibitMap
          shops={shops}
          user={user}
          chapterId={chapterId}
          beat={lane.beat}
          enterProgress={1}
          visitProgress={lane.visitProgress}
          result={lane.result}
          animatedCandidateIds={animatedCandidateIds}
          quadPreview={quadPreview}
          hexLattice={hexLattice}
          onUserClick={onClick}
          compact
          className="aspect-[4/3] w-full"
        />
      </div>
    </div>
  )
}

function emptyLanes(): Record<ChapterId, LaneState> {
  return {
    naive: { result: null, visitProgress: 0, beat: 'ready' },
    grid: { result: null, visitProgress: 0, beat: 'ready' },
    quadtree: { result: null, visitProgress: 0, beat: 'ready' },
    h3: { result: null, visitProgress: 0, beat: 'ready' },
  }
}
