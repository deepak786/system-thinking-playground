import type { SearchStrategy, StrategyId } from '../types'
import { naiveSearch } from './naiveSearch'
import { gridSearch } from './gridSearch'
import { quadtreeSearch } from './quadtreeSearch'
import { h3Search } from './h3ConceptSearch'

export const STRATEGIES: SearchStrategy[] = [
  naiveSearch,
  gridSearch,
  quadtreeSearch,
  h3Search,
]

export function getStrategy(id: StrategyId): SearchStrategy {
  return STRATEGIES.find((s) => s.id === id) ?? naiveSearch
}
