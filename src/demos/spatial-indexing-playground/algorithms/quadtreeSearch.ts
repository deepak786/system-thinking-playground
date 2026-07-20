import type {
  CoffeeShop,
  Point,
  QuadNodeVis,
  Rect,
  SearchResult,
  SearchStrategy,
} from '../types'
import { distSq } from '../utils/geometry'

const MAX_POINTS = 20
const MAX_DEPTH = 8

type Node = {
  id: string
  rect: Rect
  depth: number
  shops: CoffeeShop[]
  children: Node[] | null
}

/** Educational quadtree — dense regions subdivide; sparse stay large. */
export const quadtreeSearch: SearchStrategy = {
  id: 'quadtree',
  name: 'Adaptive Grid',
  description: 'Busy places get smaller boxes; quiet places stay large.',
  available: true,
  partitionType: 'Adaptive squares',
  complexityLabel: 'Nearby leaves',
  search(user: Point, shops: CoffeeShop[]): SearchResult {
    const root = buildNode('r', { x: 0, y: 0, w: 1, h: 1 }, shops, 0)
    const path: Node[] = []
    const leaf = findLeaf(root, user, path)

    const searchLeaves = collectNearbyLeaves(root, leaf)
    const visitIds = new Set<string>([
      ...path.map((n) => n.id),
      ...searchLeaves.map((n) => n.id),
    ])

    const candidateIds: number[] = []
    let nearestId = -1
    let best = Infinity
    for (const n of searchLeaves) {
      for (const shop of n.shops) {
        candidateIds.push(shop.id)
        const d = distSq(user, shop)
        if (d < best) {
          best = d
          nearestId = shop.id
        }
      }
    }
    if (nearestId < 0 && shops.length > 0) nearestId = shops[0]!.id

    let order = 0
    const orderMap = new Map<string, number>()
    for (const n of path) {
      if (!orderMap.has(n.id)) orderMap.set(n.id, order++)
    }
    for (const n of searchLeaves) {
      if (!orderMap.has(n.id)) orderMap.set(n.id, order++)
    }

    const quadNodes = flatten(root).map((n) => {
      const vis: QuadNodeVis = {
        id: n.id,
        rect: n.rect,
        depth: n.depth,
        isLeaf: n.children == null,
        visitOrder: orderMap.has(n.id) ? orderMap.get(n.id)! : -1,
      }
      return vis
    })

    return {
      nearestId,
      candidateIds,
      cells: [],
      quadNodes,
      hexCells: [],
      regionsVisited: visitIds.size,
      complexity: 'Nearby leaves',
      explanation: 'Busy places get more detail.',
      partitionType: 'Adaptive squares',
    }
  },
}

/** Build a full tree for cinematic split animation (no search). */
export function buildQuadtree(shops: CoffeeShop[]): QuadNodeVis[] {
  const root = buildNode('r', { x: 0, y: 0, w: 1, h: 1 }, shops, 0)
  return flatten(root).map((n) => ({
    id: n.id,
    rect: n.rect,
    depth: n.depth,
    isLeaf: n.children == null,
    visitOrder: -1,
  }))
}

function buildNode(
  id: string,
  rect: Rect,
  shops: CoffeeShop[],
  depth: number,
): Node {
  if (shops.length <= MAX_POINTS || depth >= MAX_DEPTH) {
    return { id, rect, depth, shops, children: null }
  }

  const hw = rect.w / 2
  const hh = rect.h / 2
  const midX = rect.x + hw
  const midY = rect.y + hh

  const buckets: CoffeeShop[][] = [[], [], [], []]
  for (const s of shops) {
    const right = s.x >= midX
    const bottom = s.y >= midY
    const idx = (bottom ? 2 : 0) + (right ? 1 : 0)
    buckets[idx]!.push(s)
  }

  const childRects: Rect[] = [
    { x: rect.x, y: rect.y, w: hw, h: hh },
    { x: midX, y: rect.y, w: hw, h: hh },
    { x: rect.x, y: midY, w: hw, h: hh },
    { x: midX, y: midY, w: hw, h: hh },
  ]

  return {
    id,
    rect,
    depth,
    shops: [],
    children: childRects.map((r, i) =>
      buildNode(`${id}${i}`, r, buckets[i]!, depth + 1),
    ),
  }
}

function findLeaf(node: Node, user: Point, path: Node[]): Node {
  path.push(node)
  if (!node.children) return node
  for (const child of node.children) {
    if (contains(child.rect, user)) return findLeaf(child, user, path)
  }
  return findLeaf(node.children[0]!, user, path)
}

function contains(r: Rect, p: Point): boolean {
  return (
    p.x >= r.x &&
    p.x < r.x + r.w + 1e-12 &&
    p.y >= r.y &&
    p.y < r.y + r.h + 1e-12
  )
}

function flatten(node: Node): Node[] {
  const out: Node[] = [node]
  if (node.children) {
    for (const c of node.children) out.push(...flatten(c))
  }
  return out
}

function allLeaves(node: Node): Node[] {
  if (!node.children) return [node]
  return node.children.flatMap(allLeaves)
}

function collectNearbyLeaves(root: Node, leaf: Node): Node[] {
  const pad = Math.max(leaf.rect.w, leaf.rect.h) * 0.55
  const box: Rect = {
    x: leaf.rect.x - pad,
    y: leaf.rect.y - pad,
    w: leaf.rect.w + pad * 2,
    h: leaf.rect.h + pad * 2,
  }
  return allLeaves(root).filter((n) => rectsOverlap(n.rect, box))
}

function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  )
}
