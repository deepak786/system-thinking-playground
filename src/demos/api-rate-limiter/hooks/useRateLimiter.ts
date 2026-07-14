import { useCallback, useEffect, useReducer, useState } from 'react'
import { clientById, DEFAULT_LIMIT, DEFAULT_WINDOW_MS, windowLabel } from '../data'
import type {
  ClientId,
  LimiterState,
  LogEntry,
  LogKind,
  RequestRecord,
} from '../types'

/** How many past requests we keep visible per user. */
const HISTORY_SIZE = 8

let logCounter = 0

function makeLog(kind: LogKind, message: string): LogEntry {
  return { id: `log-${logCounter++}`, timestamp: Date.now(), kind, message }
}

function makeInitialState(): LimiterState {
  return {
    limit: DEFAULT_LIMIT,
    windowMs: DEFAULT_WINDOW_MS,
    windows: {},
    history: { deepak: [], alice: [] },
    blockedTotal: { deepak: 0, alice: 0 },
    requestCounter: 0,
    log: [
      makeLog(
        'rule',
        `Rule: max ${DEFAULT_LIMIT} requests per ${windowLabel(DEFAULT_WINDOW_MS)} — per user`,
      ),
    ],
  }
}

type Action =
  | { type: 'REQUEST'; clientId: ClientId; now: number }
  | { type: 'SET_LIMIT'; limit: number }
  | { type: 'SET_WINDOW'; windowMs: number }
  | { type: 'RESET' }

/**
 * The exact fixed-window algorithm from the video's `RateLimiter` class,
 * as a pure reducer step:
 *   1. first request from a user → start their window at count 1
 *   2. window older than windowMs → forget it, start fresh at count 1
 *   3. count at the limit → reject with 429
 *   4. otherwise → count++ and allow
 */
function handleRequest(
  state: LimiterState,
  clientId: ClientId,
  now: number,
): LimiterState {
  const name = clientById[clientId].name
  const id = state.requestCounter + 1
  const logs: LogEntry[] = []
  const existing = state.windows[clientId]

  let window = existing
  if (!existing) {
    window = { count: 0, windowStart: now }
  } else if (now - existing.windowStart > state.windowMs) {
    logs.push(makeLog('window', `${name}'s window ended — count starts fresh`))
    window = { count: 0, windowStart: now }
  }

  const blocked = window!.count >= state.limit
  const record: RequestRecord = {
    id,
    clientId,
    timestamp: now,
    outcome: blocked ? 'blocked' : 'allowed',
  }

  if (blocked) {
    logs.push(
      makeLog(
        'blocked',
        `Request #${id} from ${name} → 429 Too Many Requests (${state.limit} of ${state.limit} used)`,
      ),
    )
  } else {
    window = { ...window!, count: window!.count + 1 }
    logs.push(
      makeLog(
        'allowed',
        `Request #${id} from ${name} → allowed (${window.count} of ${state.limit} used)`,
      ),
    )
  }

  return {
    ...state,
    requestCounter: id,
    windows: { ...state.windows, [clientId]: window },
    history: {
      ...state.history,
      [clientId]: [...state.history[clientId], record].slice(-HISTORY_SIZE),
    },
    blockedTotal: blocked
      ? { ...state.blockedTotal, [clientId]: state.blockedTotal[clientId] + 1 }
      : state.blockedTotal,
    log: [...state.log, ...logs],
  }
}

function reducer(state: LimiterState, action: Action): LimiterState {
  switch (action.type) {
    case 'REQUEST':
      return handleRequest(state, action.clientId, action.now)

    // Changing the rule clears all counters so the new rule starts clean.
    case 'SET_LIMIT': {
      if (action.limit === state.limit) return state
      return {
        ...state,
        limit: action.limit,
        windows: {},
        log: [
          ...state.log,
          makeLog(
            'rule',
            `New rule: max ${action.limit} requests per ${windowLabel(state.windowMs)} — counters cleared`,
          ),
        ],
      }
    }
    case 'SET_WINDOW': {
      if (action.windowMs === state.windowMs) return state
      return {
        ...state,
        windowMs: action.windowMs,
        windows: {},
        log: [
          ...state.log,
          makeLog(
            'rule',
            `New rule: max ${state.limit} requests per ${windowLabel(action.windowMs)} — counters cleared`,
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

export type UseRateLimiter = {
  state: LimiterState
  /** Ticking clock so window countdowns animate. */
  now: number
  sendRequest: (clientId: ClientId) => void
  setLimit: (limit: number) => void
  setWindowMs: (windowMs: number) => void
  reset: () => void
}

/**
 * All simulation state for the rate-limiter demo. The reducer mirrors the
 * video script's `allowRequest` exactly; a 200ms clock tick drives the
 * window countdown bars (windows themselves only reset lazily, on the next
 * request — same as the script).
 */
export function useRateLimiter(): UseRateLimiter {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState)
  const [now, setNow] = useState(() => Date.now())

  const hasActiveWindow = Object.keys(state.windows).length > 0

  useEffect(() => {
    if (!hasActiveWindow) return
    const timer = setInterval(() => setNow(Date.now()), 200)
    return () => clearInterval(timer)
  }, [hasActiveWindow])

  const sendRequest = useCallback(
    (clientId: ClientId) =>
      dispatch({ type: 'REQUEST', clientId, now: Date.now() }),
    [],
  )
  const setLimit = useCallback(
    (limit: number) => dispatch({ type: 'SET_LIMIT', limit }),
    [],
  )
  const setWindowMs = useCallback(
    (windowMs: number) => dispatch({ type: 'SET_WINDOW', windowMs }),
    [],
  )
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return { state, now, sendRequest, setLimit, setWindowMs, reset }
}
