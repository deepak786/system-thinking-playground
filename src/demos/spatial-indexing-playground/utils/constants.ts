import type { Distribution, Point } from '../types'

export const SHOP_COUNT = 5000

/** Fixed grid / hex partition size. */
export const GRID_DIM = 10

export const DEFAULT_DISTRIBUTION: Distribution = 'downtown'

export const DEFAULT_USER: Point = { x: 0.52, y: 0.48 }

/** Max rays drawn during naive search (logical checks stay full n). */
export const MAX_ANIMATED_VISITS = 160

export const ENTER_MS = 2200
export const SEARCH_MS = 1200
export const REVEAL_MS = 800
export const QUAD_SPLIT_MS = 2800
export const HEX_GROW_MS = 2400
export const GRID_DRAW_MS = 1600

export function formatCount(n: number): string {
  return n.toLocaleString('en-US')
}
