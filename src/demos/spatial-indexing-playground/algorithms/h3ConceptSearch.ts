import type {
  CoffeeShop,
  HexCell,
  Point,
  SearchResult,
  SearchStrategy,
  StrategyOptions,
} from '../types'
import { distSq } from '../utils/geometry'

const HEX_SIZE: Record<number, number> = {
  6: 0.11,
  10: 0.075,
  16: 0.05,
}

/**
 * Educational hexagonal partition inspired by H3.
 * Not Uber's H3 library — no indexes, no package.
 */
export const h3Search: SearchStrategy = {
  id: 'h3',
  name: 'Hexagonal Grid',
  description: 'Organize nearby locations with hexagonal regions.',
  available: true,
  partitionType: 'Honeycomb',
  complexityLabel: 'Nearby hexes',
  search(
    user: Point,
    shops: CoffeeShop[],
    options: StrategyOptions,
  ): SearchResult {
    const size = HEX_SIZE[options.gridDim] ?? 0.075
    const center = pixelToAxial(user.x, user.y, size)
    const ring = hexRing(center.q, center.r)

    const hexCells: HexCell[] = ring.map(({ q, r, ring: ringIdx }) => {
      const { x, y } = axialToPixel(q, r, size)
      return { q, r, ring: ringIdx, cx: x, cy: y }
    })

    const keySet = new Set(ring.map((h) => `${h.q},${h.r}`))

    let nearestId = -1
    let best = Infinity
    const candidateIds: number[] = []

    for (const shop of shops) {
      const a = pixelToAxial(shop.x, shop.y, size)
      if (!keySet.has(`${a.q},${a.r}`)) continue
      candidateIds.push(shop.id)
      const d = distSq(user, shop)
      if (d < best) {
        best = d
        nearestId = shop.id
      }
    }

    if (nearestId < 0 && shops.length > 0) nearestId = shops[0]!.id

    return {
      nearestId,
      candidateIds,
      cells: [],
      quadNodes: [],
      hexCells,
      regionsVisited: hexCells.length,
      complexity: 'Nearby hexes',
      explanation: 'Different shapes create different neighborhoods.',
      partitionType: 'Honeycomb',
      note: "Inspired by Uber's H3 library — simplified for learning.",
    }
  },
}

type Axial = { q: number; r: number; ring: number }

function hexRing(q: number, r: number): Axial[] {
  const dirs = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
  ] as const
  const out: Axial[] = [{ q, r, ring: 0 }]
  for (const [dq, dr] of dirs) {
    out.push({ q: q + dq, r: r + dr, ring: 1 })
  }
  return out
}

export function axialToPixel(
  q: number,
  r: number,
  size: number,
): { x: number; y: number } {
  const x = size * ((3 / 2) * q) + size
  const y = size * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r) + size
  return { x, y }
}

export function pixelToAxial(
  x: number,
  y: number,
  size: number,
): { q: number; r: number } {
  const px = x - size
  const py = y - size
  const q = ((2 / 3) * px) / size
  const r = ((-1 / 3) * px + (Math.sqrt(3) / 3) * py) / size
  return axialRound(q, r)
}

function axialRound(q: number, r: number): { q: number; r: number } {
  const s = -q - r
  let rq = Math.round(q)
  let rr = Math.round(r)
  const rs = Math.round(s)
  const qDiff = Math.abs(rq - q)
  const rDiff = Math.abs(rr - r)
  const sDiff = Math.abs(rs - s)
  if (qDiff > rDiff && qDiff > sDiff) rq = -rr - rs
  else if (rDiff > sDiff) rr = -rq - rs
  return { q: rq, r: rr }
}

export function hexCorners(
  cx: number,
  cy: number,
  size: number,
): Point[] {
  const out: Point[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i)
    out.push({
      x: cx + size * Math.cos(angle),
      y: cy + size * Math.sin(angle),
    })
  }
  return out
}

export function hexSizeForDim(gridDim: number): number {
  return HEX_SIZE[gridDim] ?? 0.075
}

/** Full honeycomb covering the unit square — for grow-in animation. */
export function buildHexLattice(gridDim: number): HexCell[] {
  const size = hexSizeForDim(gridDim)
  const cells: HexCell[] = []
  const seen = new Set<string>()
  for (let q = -4; q <= 18; q++) {
    for (let r = -4; r <= 18; r++) {
      const { x, y } = axialToPixel(q, r, size)
      if (x < -0.08 || y < -0.08 || x > 1.08 || y > 1.08) continue
      const key = `${q},${r}`
      if (seen.has(key)) continue
      seen.add(key)
      const dist = Math.hypot(x - 0.5, y - 0.5)
      cells.push({
        q,
        r,
        ring: Math.round(dist * 14),
        cx: x,
        cy: y,
      })
    }
  }
  cells.sort((a, b) => a.ring - b.ring)
  return cells
}
