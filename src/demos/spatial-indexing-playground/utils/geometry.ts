import type { Cell, Point } from '../types'

export function distSq(a: Point, b: Point): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

export function cellOf(point: Point, dim: number): Cell {
  const col = clamp(Math.floor(point.x * dim), 0, dim - 1)
  const row = clamp(Math.floor(point.y * dim), 0, dim - 1)
  return { col, row }
}

export function cellKey(c: Cell): string {
  return `${c.col},${c.row}`
}

/** User cell + up to 8 Moore neighbors. */
export function neighborCells(center: Cell, dim: number): Cell[] {
  const out: Cell[] = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const col = center.col + dc
      const row = center.row + dr
      if (col < 0 || row < 0 || col >= dim || row >= dim) continue
      out.push({ col, row })
    }
  }
  return out
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
