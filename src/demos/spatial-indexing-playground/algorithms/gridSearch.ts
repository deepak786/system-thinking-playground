import type {
  CoffeeShop,
  Point,
  SearchResult,
  SearchStrategy,
  StrategyOptions,
} from '../types'
import { cellOf, distSq, neighborCells } from '../utils/geometry'

/**
 * Fixed grid index (Geohash *concept* only).
 * Divides the map into equal squares and searches the user's cell + neighbors.
 */
export const gridSearch: SearchStrategy = {
  id: 'grid',
  name: 'Fixed Grid',
  description:
    'Divide the city into regions, then start searching nearby ones.',
  available: true,
  partitionType: 'Equal squares',
  complexityLabel: 'Nearby squares',
  search(
    user: Point,
    shops: CoffeeShop[],
    options: StrategyOptions,
  ): SearchResult {
    const dim = options.gridDim
    const cells = neighborCells(cellOf(user, dim), dim)
    const cellSet = new Set(cells.map((c) => `${c.col},${c.row}`))

    let nearestId = -1
    let best = Infinity
    const candidateIds: number[] = []

    for (const shop of shops) {
      const c = cellOf(shop, dim)
      if (!cellSet.has(`${c.col},${c.row}`)) continue
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
      cells,
      quadNodes: [],
      hexCells: [],
      regionsVisited: cells.length,
      complexity: 'Nearby squares',
      explanation: 'We only search nearby regions.',
      partitionType: 'Equal squares',
    }
  },
}
