import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type MouseEvent,
} from 'react'
import {
  hexCorners,
  hexSizeForDim,
} from '../algorithms/h3ConceptSearch'
import type {
  ChapterBeat,
  ChapterId,
  CoffeeShop,
  HexCell,
  Point,
  QuadNodeVis,
  SearchResult,
} from '../types'
import { GRID_DIM } from '../utils/constants'
import { cellKey } from '../utils/geometry'
import { cn } from '../../../lib/cn'
import {
  createCanvasSizeCache,
  syncCanvasSize,
} from '../../../lib/canvas2d'

type ExhibitMapProps = {
  shops: CoffeeShop[]
  user: Point
  chapterId: ChapterId
  beat: ChapterBeat
  enterProgress: number
  visitProgress: number
  result: SearchResult | null
  animatedCandidateIds: number[]
  quadPreview: QuadNodeVis[]
  hexLattice: HexCell[]
  onUserClick: (p: Point) => void
  compact?: boolean
  className?: string
  interactive?: boolean
}

/**
 * Large cinematic city map — shops, partitions, search rays.
 * Tuned for mobile: avoid canvas reallocations, cheap shop dots, capped DPR.
 */
export function ExhibitMap({
  shops,
  user,
  chapterId,
  beat,
  enterProgress,
  visitProgress,
  result,
  animatedCandidateIds,
  quadPreview,
  hexLattice,
  onUserClick,
  compact = false,
  className,
  interactive = true,
}: ExhibitMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const sizeCache = useRef(createCanvasSizeCache())

  const shopById = useMemo(() => {
    const m = new Map<number, CoffeeShop>()
    for (const s of shops) m.set(s.id, s)
    return m
  }, [shops])

  const quadLeaves = useMemo(
    () => quadPreview.filter((n) => n.isLeaf),
    [quadPreview],
  )

  /** Fewer dots on small screens — search still uses the full dataset. */
  const drawShops = useMemo(() => {
    if (typeof window === 'undefined') return shops
    const narrow = window.matchMedia('(max-width: 768px)').matches
    if (!narrow || shops.length <= 2200) return shops
    const step = Math.ceil(shops.length / 2200)
    return shops.filter((_, i) => i % step === 0)
  }, [shops])

  const visitedCount = Math.floor(visitProgress * animatedCandidateIds.length)
  const candidateSet = useMemo(
    () => new Set(result?.candidateIds ?? []),
    [result],
  )
  const cellSet = useMemo(() => {
    const set = new Set<string>()
    for (const c of result?.cells ?? []) set.add(cellKey(c))
    return set
  }, [result])

  const activeId =
    beat === 'searching' && visitedCount > 0
      ? animatedCandidateIds[
          Math.min(visitedCount - 1, animatedCandidateIds.length - 1)
        ]
      : null
  const activePos = activeId != null ? (shopById.get(activeId) ?? null) : null
  const nearest =
    result && (beat === 'revealing' || beat === 'conclude')
      ? (shopById.get(result.nearestId) ?? null)
      : null

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const sized = syncCanvasSize(canvas, wrap, sizeCache.current, {
      alpha: false,
    })
    if (!sized) return
    const { ctx, w, h } = sized

    ctx.fillStyle = '#f0eeea'
    ctx.fillRect(0, 0, w, h)

    const searching =
      beat === 'searching' || beat === 'revealing' || beat === 'conclude'
    const fadeOthers = searching && chapterId !== 'naive'

    drawPartition(
      ctx,
      w,
      h,
      chapterId,
      enterProgress,
      beat,
      result,
      cellSet,
      quadLeaves,
      hexLattice,
    )

    // Cheap dots (rects) — arcs are too expensive at ~5k points on mobile GPUs.
    const shopR = compact ? 1.1 : 1.35
    const diam = shopR * 2
    for (const shop of drawShops) {
      const isCand = !result || candidateSet.has(shop.id)
      const isNearest = nearest?.id === shop.id
      let alpha = 0.55
      if (fadeOthers && !isCand) alpha = 0.12
      else if (searching && isCand) alpha = 0.9
      if (beat === 'enter' && chapterId === 'naive') {
        alpha = 0.25 + enterProgress * 0.55
      }
      ctx.fillStyle = isNearest
        ? `rgba(16, 185, 129, ${alpha})`
        : `rgba(120, 72, 40, ${alpha})`
      ctx.fillRect(shop.x * w - shopR, shop.y * h - shopR, diam, diam)
    }

    if (beat === 'searching' && visitedCount > 0) {
      ctx.lineWidth = compact ? 0.6 : 0.85
      const count = Math.min(visitedCount, animatedCandidateIds.length)
      const rayStart = Math.max(0, count - 24)
      for (let i = rayStart; i < count; i++) {
        const id = animatedCandidateIds[i]!
        const shop = shopById.get(id)
        if (!shop) continue
        const age = (count - i) / 24
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.16 * (1 - age)})`
        ctx.beginPath()
        ctx.moveTo(user.x * w, user.y * h)
        ctx.lineTo(shop.x * w, shop.y * h)
        ctx.stroke()
      }
    }
  }, [
    drawShops,
    user,
    chapterId,
    beat,
    enterProgress,
    result,
    animatedCandidateIds,
    quadLeaves,
    hexLattice,
    candidateSet,
    cellSet,
    shopById,
    visitedCount,
    nearest,
    compact,
  ])

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const ro = new ResizeObserver(() => draw())
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [draw])

  const loading = beat === 'enter'
  const canClick = interactive && !loading

  const handleClick = (e: MouseEvent) => {
    if (!canClick) return
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    onUserClick({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <div
      ref={wrapRef}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-[#f4f2ed] shadow-[0_1px_0_rgba(15,23,42,0.04),0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5',
        canClick ? 'cursor-crosshair' : loading ? 'cursor-wait' : 'cursor-default',
        className,
      )}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

      {/* User marker — CSS only, no spring re-layout every frame */}
      <div
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${user.x * 100}%`, top: `${user.y * 100}%` }}
      >
        <div
          className={cn(
            'rounded-full bg-blue-500 shadow-md ring-2 ring-white',
            compact ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5',
          )}
        />
        {!compact && (
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/15" />
        )}
      </div>

      {activePos && beat === 'searching' && (
        <div
          key={activeId}
          className="pointer-events-none absolute z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 opacity-80"
          style={{
            left: `${activePos.x * 100}%`,
            top: `${activePos.y * 100}%`,
          }}
        />
      )}

      {nearest && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${nearest.x * 100}%`,
            top: `${nearest.y * 100}%`,
          }}
        >
          <div
            className={cn(
              'rounded-full bg-emerald-500 shadow-md ring-2 ring-white',
              compact ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5',
            )}
          />
        </div>
      )}

      {!compact && !loading && (
        <>
          <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-wrap gap-2 sm:left-4 sm:top-4">
            <LegendDot color="bg-blue-500" label="You" />
            <LegendDot color="bg-amber-800" label="Coffee shop" />
            <LegendDot color="bg-emerald-500" label="Nearest" />
          </div>
          {(beat === 'ready' || beat === 'conclude') && (
            <p className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-900/5 sm:bottom-4 sm:right-4">
              Tap anywhere to search
            </p>
          )}
        </>
      )}

      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#f4f2ed]/70">
          <p className="rounded-full bg-slate-900/90 px-4 py-2 text-sm font-medium text-slate-100 shadow-sm">
            Loading
          </p>
        </div>
      )}
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-900/5">
      <span className={cn('h-1.5 w-1.5 rounded-full', color)} />
      {label}
    </span>
  )
}

function drawPartition(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  chapterId: ChapterId,
  enterProgress: number,
  beat: ChapterBeat,
  result: SearchResult | null,
  cellSet: Set<string>,
  quadLeaves: QuadNodeVis[],
  hexLattice: HexCell[],
) {
  if (chapterId === 'naive') return

  if (chapterId === 'grid') {
    const dim = GRID_DIM
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)'
    ctx.lineWidth = 1
    for (let i = 0; i <= dim; i++) {
      const appear = Math.min(1, Math.max(0, enterProgress * (dim + 1) - i))
      if (appear <= 0) continue
      const t = i / dim
      ctx.globalAlpha = 0.35 + appear * 0.65
      ctx.beginPath()
      ctx.moveTo(t * w, 0)
      ctx.lineTo(t * w, h * appear)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, t * h)
      ctx.lineTo(w * appear, t * h)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    if (result && cellSet.size > 0 && beat !== 'enter') {
      for (const c of result.cells) {
        ctx.fillStyle = 'rgba(37, 99, 235, 0.14)'
        ctx.fillRect((c.col / dim) * w, (c.row / dim) * h, w / dim, h / dim)
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.45)'
        ctx.lineWidth = 1.5
        ctx.strokeRect(
          (c.col / dim) * w,
          (c.row / dim) * h,
          w / dim,
          h / dim,
        )
      }
    }
    return
  }

  if (chapterId === 'quadtree') {
    const maxDepth = Math.max(1, ...quadLeaves.map((n) => n.depth), 1)
    const revealDepth = enterProgress * (maxDepth + 0.35)
    const showSearch = result && beat !== 'enter'

    for (const n of quadLeaves) {
      if (n.depth > revealDepth) continue
      const fade = Math.min(1, revealDepth - n.depth + 0.2)
      ctx.strokeStyle = `rgba(15, 23, 42, ${0.1 * fade})`
      ctx.lineWidth = 1
      ctx.strokeRect(n.rect.x * w, n.rect.y * h, n.rect.w * w, n.rect.h * h)
    }

    if (showSearch && result) {
      for (const n of result.quadNodes) {
        if (!n.isLeaf || n.visitOrder < 0) continue
        ctx.fillStyle = 'rgba(37, 99, 235, 0.12)'
        ctx.fillRect(n.rect.x * w, n.rect.y * h, n.rect.w * w, n.rect.h * h)
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.5)'
        ctx.lineWidth = 1.5
        ctx.strokeRect(n.rect.x * w, n.rect.y * h, n.rect.w * w, n.rect.h * h)
      }
    }
    return
  }

  if (chapterId === 'h3') {
    const size = hexSizeForDim(GRID_DIM)
    const maxRing = hexLattice.length
      ? hexLattice[hexLattice.length - 1]!.ring
      : 1
    const revealRing = enterProgress * (maxRing + 0.5)

    for (const cell of hexLattice) {
      if (cell.ring > revealRing) continue
      const fade = Math.min(1, revealRing - cell.ring + 0.3)
      const corners = hexCorners(cell.cx, cell.cy, size)
      ctx.beginPath()
      for (let i = 0; i < corners.length; i++) {
        const p = corners[i]!
        const x = p.x * w
        const y = p.y * h
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = `rgba(15, 23, 42, ${0.12 * fade})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    if (result && beat !== 'enter') {
      for (const cell of result.hexCells) {
        const corners = hexCorners(cell.cx, cell.cy, size)
        ctx.beginPath()
        for (let i = 0; i < corners.length; i++) {
          const p = corners[i]!
          const x = p.x * w
          const y = p.y * h
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fillStyle =
          cell.ring === 0
            ? 'rgba(37, 99, 235, 0.2)'
            : 'rgba(37, 99, 235, 0.1)'
        ctx.fill()
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.55)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }
  }
}
