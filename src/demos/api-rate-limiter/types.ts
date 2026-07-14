export type ClientId = 'deepak' | 'alice'

export type Outcome = 'allowed' | 'blocked'

/** One request and how the server answered it. */
export type RequestRecord = {
  id: number
  clientId: ClientId
  timestamp: number
  outcome: Outcome
}

/**
 * What the server remembers about one user — exactly the shape from the
 * video's script: how many requests, and when this counting window started.
 */
export type WindowState = {
  count: number
  windowStart: number
}

export type LogKind = 'allowed' | 'blocked' | 'window' | 'rule' | 'reset'

export type LogEntry = {
  id: string
  timestamp: number
  kind: LogKind
  message: string
}

export type LimiterState = {
  /** The rule: at most `limit` requests per `windowMs`. */
  limit: number
  windowMs: number
  /** Per-user counters. Absent until a user's first request. */
  windows: Partial<Record<ClientId, WindowState>>
  /** Recent request outcomes per user, newest last. */
  history: Record<ClientId, RequestRecord[]>
  /** Running total of blocked (429) requests per user. */
  blockedTotal: Record<ClientId, number>
  requestCounter: number
  log: LogEntry[]
}
