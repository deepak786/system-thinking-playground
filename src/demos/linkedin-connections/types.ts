export type PersonId = string

/** A member of the little LinkedIn-style network. */
export type Person = {
  id: PersonId
  name: string
  /** Fixed position inside the graph's SVG viewBox. */
  x: number
  y: number
}

/**
 * Where a person is in the search:
 * unknown → not discovered yet · waiting → in the checking line ·
 * checking → their connections are being looked at right now ·
 * done → fully checked, level locked in.
 */
export type PersonStatus = 'unknown' | 'waiting' | 'checking' | 'done'

export type LogKind = 'checking' | 'found' | 'skip' | 'done' | 'reset'

export type LogEntry = {
  id: string
  timestamp: number
  kind: LogKind
  message: string
}

export type SearchState = {
  statusById: Record<PersonId, PersonStatus>
  /** Degree (hops from You) — only present once a person is discovered. */
  degreeById: Record<PersonId, number>
  /** Who discovered each person; walking this chain gives the shortest path. */
  parentById: Record<PersonId, PersonId>
  /** The BFS queue: people waiting to have their connections checked. */
  queue: PersonId[]
  /** Person currently having their connections checked (front of the line). */
  checkingId: PersonId | null
  /** Connections of `checkingId` still waiting to be looked at, one per step. */
  pendingNeighbors: PersonId[]
  /** Edge keys used for a first discovery — drawn colored in the graph. */
  discoveryEdges: string[]
  log: LogEntry[]
  auto: boolean
  done: boolean
  selectedId: PersonId | null
  stepCount: number
}

/** Shortest path from You to the selected person, derived from parentById. */
export type SelectedPath = {
  ids: PersonId[]
  edgeKeys: Set<string>
}
