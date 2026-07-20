/** Normalized map coordinates in [0, 1]. */
export type Point = { x: number; y: number }

export type CoffeeShop = Point & { id: number }

export type Distribution = 'uniform' | 'downtown' | 'clusters'

export type ChapterId = 'naive' | 'grid' | 'quadtree' | 'h3'

export type StrategyId = ChapterId

export type Cell = { col: number; row: number }

/** Axis-aligned rectangle in normalized coords. */
export type Rect = { x: number; y: number; w: number; h: number }

/** Quadtree node for drawing + search animation. */
export type QuadNodeVis = {
  id: string
  rect: Rect
  depth: number
  isLeaf: boolean
  /** -1 = not on search path; else order visited (0 = root first). */
  visitOrder: number
}

/** Hex cell for the educational H3-inspired overlay. */
export type HexCell = {
  q: number
  r: number
  /** 0 = user hex, 1 = first ring, … */
  ring: number
  cx: number
  cy: number
}

export type SearchResult = {
  nearestId: number
  candidateIds: number[]
  cells: Cell[]
  quadNodes: QuadNodeVis[]
  hexCells: HexCell[]
  regionsVisited: number
  complexity: string
  explanation: string
  partitionType: string
  note?: string
}

export type StrategyOptions = {
  gridDim: number
}

/**
 * Pluggable nearest-neighbor strategy.
 * UI reads from the strategy registry — never hardcodes algorithm logic.
 */
export type SearchStrategy = {
  id: StrategyId
  name: string
  description: string
  available: boolean
  partitionType: string
  complexityLabel: string
  search(
    user: Point,
    shops: CoffeeShop[],
    options: StrategyOptions,
  ): SearchResult
}

/** Story beat inside a chapter. */
export type ChapterBeat =
  | 'enter'
  | 'ready'
  | 'searching'
  | 'revealing'
  | 'conclude'

export type SearchAreaLabel = 'Very Large' | 'Medium' | 'Adaptive' | 'Compact'

export type ChapterDefinition = {
  id: ChapterId
  step: number
  shortLabel: string
  title: string
  /** What the method does — one short line. */
  idea: string
  /** Why it helps — one short line. */
  why: string
  /** Optional real-world connection. */
  realWorld?: string
  /** Shown after a search finishes. */
  takeaway: string
  searchArea: SearchAreaLabel
  searchPattern: string
}
