import type { Person, PersonId } from './types'

/**
 * A hand-crafted 11-person network. Positions are tuned so the search ripples
 * left → right: You, then your direct connections, then theirs, and so on.
 * The graph includes two "already found" situations (Emma and Isha are each
 * reachable through two people) so viewers see BFS skip duplicates.
 */
export const PEOPLE: Person[] = [
  { id: 'you', name: 'You', x: 80, y: 280 },

  { id: 'alice', name: 'Alice', x: 275, y: 105 },
  { id: 'bob', name: 'Bob', x: 300, y: 285 },
  { id: 'carol', name: 'Carol', x: 265, y: 455 },

  { id: 'dave', name: 'Dave', x: 470, y: 60 },
  { id: 'emma', name: 'Emma', x: 500, y: 200 },
  { id: 'farah', name: 'Farah', x: 475, y: 345 },
  { id: 'grace', name: 'Grace', x: 490, y: 480 },

  { id: 'henry', name: 'Henry', x: 680, y: 110 },
  { id: 'isha', name: 'Isha', x: 695, y: 275 },
  { id: 'jack', name: 'Jack', x: 675, y: 450 },
]

/** Friendships — every edge goes both ways, just like real connections. */
export const EDGES: Array<[PersonId, PersonId]> = [
  ['you', 'alice'],
  ['you', 'bob'],
  ['you', 'carol'],
  ['alice', 'bob'],
  ['alice', 'dave'],
  ['alice', 'emma'],
  ['bob', 'emma'],
  ['bob', 'farah'],
  ['carol', 'grace'],
  ['dave', 'henry'],
  ['emma', 'isha'],
  ['farah', 'isha'],
  ['grace', 'jack'],
]

export const START_ID: PersonId = 'you'

export const personById: Record<PersonId, Person> = Object.fromEntries(
  PEOPLE.map((p) => [p.id, p]),
)

/** Canonical key for an undirected edge, independent of direction. */
export function edgeKey(a: PersonId, b: PersonId): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

/** Adjacency list with neighbors sorted by name so runs are deterministic. */
export const neighborsById: Record<PersonId, PersonId[]> = (() => {
  const map: Record<PersonId, PersonId[]> = {}
  for (const p of PEOPLE) map[p.id] = []
  for (const [a, b] of EDGES) {
    map[a].push(b)
    map[b].push(a)
  }
  for (const id of Object.keys(map)) {
    map[id].sort((a, b) => personById[a].name.localeCompare(personById[b].name))
  }
  return map
})()

/** Plain-language name for a degree ("You", "1st", "2nd", "3rd", "4th"…). */
export function degreeLabel(degree: number): string {
  if (degree === 0) return 'You'
  if (degree === 1) return '1st'
  if (degree === 2) return '2nd'
  if (degree === 3) return '3rd'
  return `${degree}th`
}

export type LevelTheme = {
  /** Node fill / ring in the graph. */
  node: string
  nodeRing: string
  text: string
  /** Chip / badge styling used in panels. */
  chip: string
  /** Stroke color for discovery edges (SVG). */
  stroke: string
}

/** One color per connection level, reused across graph, chips, and legend. */
export const LEVEL_THEMES: Record<number, LevelTheme> = {
  0: {
    node: 'fill-brand-500',
    nodeRing: 'stroke-brand-300',
    text: 'text-brand-300',
    chip: 'bg-brand-500/15 text-brand-300 ring-brand-500/40',
    stroke: '#3fce82',
  },
  1: {
    node: 'fill-sky-500',
    nodeRing: 'stroke-sky-300',
    text: 'text-sky-300',
    chip: 'bg-sky-500/15 text-sky-300 ring-sky-500/40',
    stroke: '#38bdf8',
  },
  2: {
    node: 'fill-violet-500',
    nodeRing: 'stroke-violet-300',
    text: 'text-violet-300',
    chip: 'bg-violet-500/15 text-violet-300 ring-violet-500/40',
    stroke: '#a78bfa',
  },
  3: {
    node: 'fill-amber-500',
    nodeRing: 'stroke-amber-300',
    text: 'text-amber-300',
    chip: 'bg-amber-500/15 text-amber-300 ring-amber-500/40',
    stroke: '#fbbf24',
  },
}

export function levelTheme(degree: number): LevelTheme {
  return LEVEL_THEMES[Math.min(degree, 3)]
}
