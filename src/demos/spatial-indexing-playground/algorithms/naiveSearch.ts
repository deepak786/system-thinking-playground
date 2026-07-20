import type { CoffeeShop, Point, SearchResult, SearchStrategy } from '../types'
import { distSq } from '../utils/geometry'

function emptyExtras(): Pick<
  SearchResult,
  'cells' | 'quadNodes' | 'hexCells' | 'regionsVisited'
> {
  return { cells: [], quadNodes: [], hexCells: [], regionsVisited: 0 }
}

/** Brute-force: examine every coffee shop. */
export const naiveSearch: SearchStrategy = {
  id: 'naive',
  name: 'Search Everything',
  description: 'Look at every coffee shop in the city.',
  available: true,
  partitionType: 'No partition',
  complexityLabel: 'Whole city',
  search(user: Point, shops: CoffeeShop[]): SearchResult {
    let nearestId = 0
    let best = Infinity
    const candidateIds: number[] = []

    for (const shop of shops) {
      candidateIds.push(shop.id)
      const d = distSq(user, shop)
      if (d < best) {
        best = d
        nearestId = shop.id
      }
    }

    return {
      nearestId,
      candidateIds,
      ...emptyExtras(),
      complexity: 'Whole city',
      explanation: 'We have no shortcuts.',
      partitionType: 'No partition',
    }
  },
}
