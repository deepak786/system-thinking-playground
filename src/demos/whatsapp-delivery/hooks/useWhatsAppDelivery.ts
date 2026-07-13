import { useCallback, useMemo, useReducer } from 'react'
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

let idCounter = 0
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${idCounter++}`

const initialState: DeliveryState = {
  aliceOnline: false,
  queue: [],
  delivered: [],
  read: [],
  log: [],
}

type Action =
  | { type: 'SEND' }
  | { type: 'SET_ONLINE' }
  | { type: 'SET_OFFLINE' }
  | { type: 'READ' }
  | { type: 'RESET' }

function makeLog(kind: LogKind, message: string, messageId?: string): LogEntry {
  return {
    id: nextId('log'),
    timestamp: Date.now(),
    kind,
    message,
    messageId,
  }
}

function reducer(state: DeliveryState, action: Action): DeliveryState {
  switch (action.type) {
    case 'SEND': {
      const text = SAMPLE_TEXTS[state.queue.length + state.delivered.length + state.read.length] ??
        SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]
      const base: Message = {
        id: nextId('msg'),
        text,
        timestamp: Date.now(),
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
            makeLog('created', 'Message created by Deepak', base.id),
            makeLog('delivered', 'Alice online → delivered instantly', base.id),
          ],
        }
      }

      // Recipient is offline: park the message in the pending queue.
      return {
        ...state,
        queue: [...state.queue, base],
        log: [
          ...state.log,
          makeLog('created', 'Message created by Deepak', base.id),
          makeLog('queued', 'Alice offline → stored in server queue', base.id),
        ],
      }
    }

    case 'SET_ONLINE': {
      if (state.aliceOnline) return state
      const flushed = state.queue.map<Message>((m) => ({ ...m, status: 'delivered' }))
      const deliveryLogs = flushed.map((m) =>
        makeLog('delivered', 'Flushed from queue → delivered', m.id),
      )
      return {
        ...state,
        aliceOnline: true,
        queue: [],
        delivered: [...state.delivered, ...flushed],
        log: [
          ...state.log,
          makeLog('presence', 'Alice came online'),
          ...deliveryLogs,
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
      const readLogs = nowRead.map((m) => makeLog('read', 'Alice read the message', m.id))
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
        log: [makeLog('reset', 'Simulation reset to initial state')],
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
 */
export function useWhatsAppDelivery(): UseWhatsAppDelivery {
  const [state, dispatch] = useReducer(reducer, initialState)

  const sendMessage = useCallback(() => dispatch({ type: 'SEND' }), [])
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
