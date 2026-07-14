export type ProfileKey = 'A' | 'B' | 'C' | 'D' | 'E'

export type LogKind = 'hit' | 'miss' | 'insert' | 'evict' | 'rule' | 'reset'

export type LogEntry = {
  id: string
  timestamp: number
  kind: LogKind
  message: string
}

export type CacheState = {
  /** How many profiles fit in the cache. */
  capacity: number
  /**
   * The cache, in Map insertion order like the video: index 0 is the LEAST
   * recently used (next to be evicted), the last index the MOST recent.
   */
  cache: ProfileKey[]
  /** Profile currently being fetched from the slow database, if any. */
  fetching: ProfileKey | null
  hits: number
  misses: number
  requestCounter: number
  log: LogEntry[]
}
