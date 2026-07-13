import { useCallback, useEffect, useMemo, useReducer } from 'react'
import {
  degreeLabel,
  edgeKey,
  neighborsById,
  personById,
  START_ID,
} from '../data'
import type {
  LogEntry,
  LogKind,
  PersonId,
  SearchState,
  SelectedPath,
} from '../types'

/** Pause between automatic steps — slow enough to narrate each move. */
const AUTO_STEP_MS = 1200

let logCounter = 0

function makeLog(kind: LogKind, message: string): LogEntry {
  return { id: `log-${logCounter++}`, timestamp: Date.now(), kind, message }
}

function makeInitialState(): SearchState {
  return {
    statusById: { [START_ID]: 'waiting' },
    degreeById: { [START_ID]: 0 },
    parentById: {},
    queue: [START_ID],
    checkingId: null,
    pendingNeighbors: [],
    discoveryEdges: [],
    log: [
      makeLog(
        'checking',
        'You are the starting point — the search spreads out from you.',
      ),
    ],
    auto: false,
    done: false,
    selectedId: null,
    stepCount: 0,
  }
}

type Action =
  | { type: 'STEP' }
  | { type: 'SET_AUTO'; auto: boolean }
  | { type: 'SELECT'; id: PersonId | null }
  | { type: 'RESET' }

/**
 * Runs one small, narratable unit of BFS work:
 * 1. no one being checked → take the FRONT of the line (or finish the search)
 * 2. someone being checked → look at ONE of their connections
 *    (new person → give them a level and add to the BACK of the line;
 *     known person → skip)
 * When their last connection has been looked at, mark them fully checked.
 */
function step(state: SearchState): SearchState {
  if (state.done) return state

  // Nobody is being checked: pull the next person from the front of the line.
  if (state.checkingId === null) {
    if (state.queue.length === 0) {
      return {
        ...state,
        done: true,
        auto: false,
        log: [
          ...state.log,
          makeLog(
            'done',
            'The line is empty — everyone reachable now has a connection level!',
          ),
        ],
      }
    }
    const [head, ...rest] = state.queue
    const name = personById[head].name
    return {
      ...state,
      queue: rest,
      checkingId: head,
      pendingNeighbors: neighborsById[head],
      statusById: { ...state.statusById, [head]: 'checking' },
      stepCount: state.stepCount + 1,
      log: [
        ...state.log,
        makeLog(
          'checking',
          head === START_ID
            ? 'Looking at everyone You know…'
            : `Looking at everyone ${name} knows…`,
        ),
      ],
    }
  }

  // Someone is being checked: look at one of their connections.
  const current = state.checkingId
  const [neighbor, ...restNeighbors] = state.pendingNeighbors
  const currentName = personById[current].name
  const logs: LogEntry[] = []

  let next: SearchState = { ...state, pendingNeighbors: restNeighbors }

  if (neighbor !== undefined) {
    const neighborName = personById[neighbor].name
    if (state.statusById[neighbor] === undefined) {
      // First time we've ever seen this person → their level is locked in.
      const degree = state.degreeById[current] + 1
      logs.push(
        makeLog(
          'found',
          `${neighborName} found through ${currentName} → ${degreeLabel(degree)} connection`,
        ),
      )
      next = {
        ...next,
        statusById: { ...next.statusById, [neighbor]: 'waiting' },
        degreeById: { ...next.degreeById, [neighbor]: degree },
        parentById: { ...next.parentById, [neighbor]: current },
        queue: [...next.queue, neighbor],
        discoveryEdges: [...next.discoveryEdges, edgeKey(current, neighbor)],
      }
    } else {
      logs.push(
        makeLog(
          'skip',
          `${currentName} also knows ${neighborName} — already found, skip`,
        ),
      )
    }
  }

  // Last connection looked at → this person is fully checked.
  if (next.pendingNeighbors.length === 0) {
    logs.push(makeLog('done', `${currentName} — fully checked ✓`))
    next = {
      ...next,
      checkingId: null,
      statusById: { ...next.statusById, [current]: 'done' },
    }
  }

  return {
    ...next,
    stepCount: state.stepCount + 1,
    log: [...state.log, ...logs],
  }
}

function reducer(state: SearchState, action: Action): SearchState {
  switch (action.type) {
    case 'STEP':
      return step(state)
    case 'SET_AUTO':
      if (state.done && action.auto) return state
      return { ...state, auto: action.auto }
    case 'SELECT':
      return { ...state, selectedId: action.id }
    case 'RESET':
      return makeInitialState()
    default:
      return state
  }
}

export type UseConnectionSearch = {
  state: SearchState
  /** Shortest path from You to the selected person (empty when none). */
  selectedPath: SelectedPath
  stepOnce: () => void
  play: () => void
  pause: () => void
  selectPerson: (id: PersonId | null) => void
  reset: () => void
}

/**
 * All simulation state for the LinkedIn-connections demo. Components stay
 * presentational; while `auto` is on, an effect dispatches STEP on a timer so
 * viewers can watch the search ripple out level by level.
 */
export function useConnectionSearch(): UseConnectionSearch {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState)

  useEffect(() => {
    if (!state.auto || state.done) return
    const timer = setTimeout(() => dispatch({ type: 'STEP' }), AUTO_STEP_MS)
    return () => clearTimeout(timer)
  }, [state.auto, state.done, state.stepCount])

  const stepOnce = useCallback(() => dispatch({ type: 'STEP' }), [])
  const play = useCallback(() => dispatch({ type: 'SET_AUTO', auto: true }), [])
  const pause = useCallback(() => dispatch({ type: 'SET_AUTO', auto: false }), [])
  const selectPerson = useCallback(
    (id: PersonId | null) => dispatch({ type: 'SELECT', id }),
    [],
  )
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  // Walk the parent chain backwards to build the shortest path to the
  // selected person — this is the "how do I know them?" answer BFS gives us.
  const selectedPath = useMemo<SelectedPath>(() => {
    const target = state.selectedId
    if (!target || state.degreeById[target] === undefined) {
      return { ids: [], edgeKeys: new Set() }
    }
    const ids: PersonId[] = []
    let cursor: PersonId | undefined = target
    while (cursor !== undefined) {
      ids.unshift(cursor)
      cursor = state.parentById[cursor]
    }
    const edgeKeys = new Set<string>()
    for (let i = 0; i < ids.length - 1; i++) {
      edgeKeys.add(edgeKey(ids[i], ids[i + 1]))
    }
    return { ids, edgeKeys }
  }, [state.selectedId, state.degreeById, state.parentById])

  return { state, selectedPath, stepOnce, play, pause, selectPerson, reset }
}
