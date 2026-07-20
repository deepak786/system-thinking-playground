import type { CoffeeShop, Distribution } from '../types'
import { SHOP_COUNT } from './constants'
import { seededRandom } from './seededRandom'

/**
 * Build a city of coffee shops for the given distribution.
 * Seeded so Generate New City can bump the seed for a fresh layout.
 */
export function generateCity(
  distribution: Distribution,
  seed: number,
  count: number = SHOP_COUNT,
): CoffeeShop[] {
  const rand = seededRandom(seed + distribution.length * 997)
  const shops: CoffeeShop[] = []

  if (distribution === 'uniform') {
    while (shops.length < count) {
      shops.push({
        id: shops.length,
        x: 0.04 + rand() * 0.92,
        y: 0.04 + rand() * 0.92,
      })
    }
    return shops
  }

  if (distribution === 'downtown') {
    const clustered = Math.floor(count * 0.7)
    while (shops.length < clustered) {
      // Soft blob around city center.
      const angle = rand() * Math.PI * 2
      const radius = Math.abs(gaussian(rand)) * 0.12
      shops.push({
        id: shops.length,
        x: clamp01(0.5 + Math.cos(angle) * radius),
        y: clamp01(0.5 + Math.sin(angle) * radius),
      })
    }
    while (shops.length < count) {
      shops.push({
        id: shops.length,
        x: 0.04 + rand() * 0.92,
        y: 0.04 + rand() * 0.92,
      })
    }
    return shops
  }

  // Random clusters: several hotspots around the map.
  const clusterCount = 6 + Math.floor(rand() * 4)
  const centers = Array.from({ length: clusterCount }, () => ({
    x: 0.15 + rand() * 0.7,
    y: 0.15 + rand() * 0.7,
  }))
  while (shops.length < count) {
    const c = centers[Math.floor(rand() * centers.length)]!
    const angle = rand() * Math.PI * 2
    const radius = Math.abs(gaussian(rand)) * 0.07
    shops.push({
      id: shops.length,
      x: clamp01(c.x + Math.cos(angle) * radius),
      y: clamp01(c.y + Math.sin(angle) * radius),
    })
  }
  return shops
}

function gaussian(rand: () => number): number {
  // Box–Muller
  const u = Math.max(1e-9, rand())
  const v = rand()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function clamp01(n: number) {
  return Math.max(0.02, Math.min(0.98, n))
}
