import { useCallback, useEffect, useMemo, useReducer } from 'react'
import type {
  DeliveryState,
  LogEntry,
  LogKind,
  Message,
} from '../types'

/** Rotating sample messages so each "Send" feels a little different. */
const SAMPLE_TEXTS = [
  'Hey Alice! 👋',
  'Are you free tonight?',
  'Check out this article 📚',
  'Did you finish the project?',
  'Call me when you can 📞',
  'Happy birthday! 🎉',
  'Lunch tomorrow?',
  'Sending the files now.',
]

/** Delay between each queued message being delivered once Alice is online. */
const DRAIN_INTERVAL_MS = 800

/**
 * Counters live at module scope so IDs stay unique across resets.
 * Message IDs are generated in the action creator (not the reducer) so the
 * reducer stays pure and IDs remain sequential under StrictMode.
 */
let msgCounter = 0
let logCounter = 0

const initialState: DeliveryState = {
  aliceOnline: false,
  queue: [],
  delivered: [],
  read: [],
  log: [],
}

type Action =
  | { type: 'SEND'; id: string; timestamp: number }
  | { type: 'SET_ONLINE' }
  | { type: 'DELIVER_NEXT' }
  | { type: 'SET_OFFLINE' }
  | { type: 'READ' }
  | { type: 'RESET' }

function makeLog(kind: LogKind, message: string, messageId?: string): LogEntry {
  return {
    id: `log-${logCounter++}`,
    timestamp: Date.now(),
    kind,
    message,
    messageId,
  }
}

function reducer(state: DeliveryState, action: Action): DeliveryState {
  switch (action.type) {
    case 'SEND': {
      const count =
        state.queue.length + state.delivered.length + state.read.length
      const text = SAMPLE_TEXTS[count % SAMPLE_TEXTS.length]
      const base: Message = {
        id: action.id,
        text,
        timestamp: action.timestamp,
        status: 'sent',
      }

      if (state.aliceOnline) {
        // Recipient is online: message is delivered immediately.
        const delivered: Message = { ...base, status: 'delivered' }
        return {
          ...state,
          delivered: [...state.delivered, delivered],
          log: [
            ...state.log,
            makeLog('created', `${base.id} created by Deepak`, base.id),
            makeLog(
              'delivered',
              `${base.id} delivered instantly (Alice online)`,
              base.id,
            ),
          ],
        }
      }

      // Recipient is offline: park the message at the back of the queue.
      return {
        ...state,
        queue: [...state.queue, base],
        log: [
          ...state.log,
          makeLog('created', `${base.id} created by Deepak`, base.id),
          makeLog(
            'queued',
            `${base.id} joined the queue at position ${state.queue.length + 1}`,
            base.id,
          ),
        ],
      }
    }

    case 'SET_ONLINE': {
      if (state.aliceOnline) return state
      return {
        ...state,
        aliceOnline: true,
        log: [
          ...state.log,
          makeLog(
            'presence',
            state.queue.length > 0
              ? `Alice came online → delivering ${state.queue.length} waiting ${state.queue.length === 1 ? 'message' : 'messages'}, oldest first`
              : 'Alice came online',
          ),
        ],
      }
    }

    // Pops the HEAD of the queue (oldest message) — this is what makes the
    // drain first-in-first-out. Dispatched on a timer while Alice is online.
    case 'DELIVER_NEXT': {
      if (!state.aliceOnline || state.queue.length === 0) return state
      const [head, ...rest] = state.queue
      const delivered: Message = { ...head, status: 'delivered' }
      return {
        ...state,
        queue: rest,
        delivered: [...state.delivered, delivered],
        log: [
          ...state.log,
          makeLog('delivered', `${head.id} delivered (first in → first out)`, head.id),
        ],
      }
    }

    case 'SET_OFFLINE': {
      if (!state.aliceOnline) return state
      return {
        ...state,
        aliceOnline: false,
        log: [
          ...state.log,
          makeLog('presence', 'Alice went offline → new messages will queue'),
        ],
      }
    }

    case 'READ': {
      if (state.delivered.length === 0) return state
      const nowRead = state.delivered.map<Message>((m) => ({ ...m, status: 'read' }))
      const readLogs = nowRead.map((m) =>
        makeLog('read', `${m.id} read by Alice`, m.id),
      )
      return {
        ...state,
        delivered: [],
        read: [...state.read, ...nowRead],
        log: [...state.log, ...readLogs],
      }
    }

    case 'RESET':
      return {
        ...initialState,
        log: [makeLog('reset', 'Everything cleared — starting fresh')],
      }

    default:
      return state
  }
}

export type UseWhatsAppDelivery = {
  state: DeliveryState
  totals: { queued: number; delivered: number; read: number }
  sendMessage: () => void
  setAliceOnline: () => void
  setAliceOffline: () => void
  readMessages: () => void
  reset: () => void
}

/**
 * Encapsulates the full delivery simulation. Components stay presentational and
 * simply call these actions; all transition logic lives in the reducer.
 *
 * When Alice is online and the queue is non-empty, an effect drains the queue
 * one message at a time (every DRAIN_INTERVAL_MS) so viewers can watch the
 * FIFO order play out. Going offline mid-drain cancels the timer and leaves
 * the remaining messages queued.
 */
export function useWhatsAppDelivery(): UseWhatsAppDelivery {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!state.aliceOnline || state.queue.length === 0) return
    const timer = setTimeout(
      () => dispatch({ type: 'DELIVER_NEXT' }),
      DRAIN_INTERVAL_MS,
    )
    return () => clearTimeout(timer)
  }, [state.aliceOnline, state.queue.length])

  const sendMessage = useCallback(
    () => dispatch({ type: 'SEND', id: `msg-${++msgCounter}`, timestamp: Date.now() }),
    [],
  )
  const setAliceOnline = useCallback(() => dispatch({ type: 'SET_ONLINE' }), [])
  const setAliceOffline = useCallback(() => dispatch({ type: 'SET_OFFLINE' }), [])
  const readMessages = useCallback(() => dispatch({ type: 'READ' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  const totals = useMemo(
    () => ({
      queued: state.queue.length,
      delivered: state.delivered.length,
      read: state.read.length,
    }),
    [state.queue.length, state.delivered.length, state.read.length],
  )

  return {
    state,
    totals,
    sendMessage,
    setAliceOnline,
    setAliceOffline,
    readMessages,
    reset,
  }
}
