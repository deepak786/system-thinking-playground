import { useCallback, useEffect, useReducer } from 'react'
import { DB_FETCH_MS, DEFAULT_CAPACITY, profileByKey } from '../data'
import type { CacheState, LogEntry, LogKind, ProfileKey } from '../types'

let logCounter = 0

function makeLog(kind: LogKind, message: string): LogEntry {
  return { id: `log-${logCounter++}`, timestamp: Date.now(), kind, message }
}

function makeInitialState(): CacheState {
  return {
    capacity: DEFAULT_CAPACITY,
    cache: [],
    fetching: null,
    hits: 0,
    misses: 0,
    requestCounter: 0,
    log: [
      makeLog(
        'rule',
        `Cache holds ${DEFAULT_CAPACITY} profiles — least recently used gets evicted`,
      ),
    ],
  }
}

type Action =
  | { type: 'OPEN'; key: ProfileKey }
  | { type: 'FETCHED'; key: ProfileKey }
  | { type: 'SET_CAPACITY'; capacity: number }
  | { type: 'RESET' }

/**
 * The video's Map-based LRUCache as a pure reducer.
 *
 * OPEN = `get`: hit → delete + re-append (most recently used); miss → start
 * a slow database fetch. FETCHED = `put`: if full, evict index 0 (the Map's
 * first key = least recently used), then append.
 */
function reducer(state: CacheState, action: Action): CacheState {
  switch (action.type) {
    case 'OPEN': {
      if (state.fetching) return state
      const name = profileByKey[action.key].name
      const id = state.requestCounter + 1

      if (state.cache.includes(action.key)) {
        // Cache hit: make it the most recently used (delete + set at end).
        return {
          ...state,
          cache: [...state.cache.filter((k) => k !== action.key), action.key],
          hits: state.hits + 1,
          requestCounter: id,
          log: [
            ...state.log,
            makeLog(
              'hit',
              `${name} opened instantly from the cache ⚡ — now the most recent`,
            ),
          ],
        }
      }

      // Cache miss: the profile must come from the slow database.
      return {
        ...state,
        fetching: action.key,
        misses: state.misses + 1,
        requestCounter: id,
        log: [
          ...state.log,
          makeLog('miss', `${name} is NOT in the cache — asking the slow database 🐢`),
        ],
      }
    }

    case 'FETCHED': {
      if (state.fetching !== action.key) return state
      const name = profileByKey[action.key].name
      let cache = state.cache
      const logs: LogEntry[] = []

      // Cache full → evict the least recently used (front of the line).
      if (cache.length >= state.capacity) {
        const evicted = cache[0]
        cache = cache.slice(1)
        logs.push(
          makeLog(
            'evict',
            `Cache full → ${profileByKey[evicted].name} evicted (least recently used)`,
          ),
        )
      }

      logs.push(makeLog('insert', `${name} saved to the cache as most recent`))

      return {
        ...state,
        cache: [...cache, action.key],
        fetching: null,
        log: [...state.log, ...logs],
      }
    }

    case 'SET_CAPACITY': {
      if (action.capacity === state.capacity || state.fetching) return state
      return {
        ...state,
        capacity: action.capacity,
        cache: [],
        hits: 0,
        misses: 0,
        log: [
          ...state.log,
          makeLog(
            'rule',
            `Cache resized to ${action.capacity} profiles — emptied to start clean`,
          ),
        ],
      }
    }

    case 'RESET':
      return {
        ...makeInitialState(),
        log: [makeLog('reset', 'Everything cleared — starting fresh')],
      }

    default:
      return state
  }
}

export type UseLruCache = {
  state: CacheState
  openProfile: (key: ProfileKey) => void
  setCapacity: (capacity: number) => void
  reset: () => void
}

/**
 * All simulation state for the LRU cache demo. A cache miss sets `fetching`;
 * an effect delivers the profile after DB_FETCH_MS so viewers feel how slow
 * the database trip is compared to an instant cache hit.
 */
export function useLruCache(): UseLruCache {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState)

  useEffect(() => {
    if (!state.fetching) return
    const key = state.fetching
    const timer = setTimeout(
      () => dispatch({ type: 'FETCHED', key }),
      DB_FETCH_MS,
    )
    return () => clearTimeout(timer)
  }, [state.fetching])

  const openProfile = useCallback(
    (key: ProfileKey) => dispatch({ type: 'OPEN', key }),
    [],
  )
  const setCapacity = useCallback(
    (capacity: number) => dispatch({ type: 'SET_CAPACITY', capacity }),
    [],
  )
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return { state, openProfile, setCapacity, reset }
}
