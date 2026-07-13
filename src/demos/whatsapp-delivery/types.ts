/** Lifecycle of a message in the delivery pipeline. */
export type MessageStatus = 'sent' | 'delivered' | 'read'

export type Message = {
  id: string
  text: string
  /** Epoch millis when the message was created. */
  timestamp: number
  status: MessageStatus
}

/** A single entry in the educational event log. */
export type LogKind =
  | 'created'
  | 'queued'
  | 'delivered'
  | 'read'
  | 'presence'
  | 'reset'

export type LogEntry = {
  id: string
  /** Epoch millis when the event happened. */
  timestamp: number
  kind: LogKind
  message: string
  /** Optional reference to the message this event relates to. */
  messageId?: string
}

export type DeliveryState = {
  aliceOnline: boolean
  /** Messages waiting for Alice to come online. */
  queue: Message[]
  /** Messages that reached Alice's device. */
  delivered: Message[]
  /** Messages Alice has opened. */
  read: Message[]
  log: LogEntry[]
}
