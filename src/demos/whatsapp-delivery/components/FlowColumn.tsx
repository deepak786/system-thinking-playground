import { useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { DeliveryState } from '../types'
import { Phone } from '../../../shared/Phone'
import { ServerCard } from './ServerCard'
import { QueueCard } from './QueueCard'
import { FlowArrow } from './FlowArrow'
import { MessageCard } from './MessageCard'

type FlowColumnProps = {
  state: DeliveryState
}

/**
 * The central vertical pipeline:
 * Deepak → Server → Pending Queue → Alice.
 */
export function FlowColumn({ state }: FlowColumnProps) {
  const { aliceOnline, queue, delivered, read } = state

  // Everything Deepak has ever sent, oldest first.
  const senderMessages = useMemo(
    () => [...read, ...delivered, ...queue].sort((a, b) => a.timestamp - b.timestamp),
    [read, delivered, queue],
  )

  // What actually reached Alice's device.
  const recipientMessages = useMemo(
    () => [...delivered, ...read].sort((a, b) => a.timestamp - b.timestamp),
    [delivered, read],
  )

  return (
    <div className="flex flex-col items-center gap-1">
      <Phone name="Deepak" online avatarColor="bg-brand-500" avatar="🧑‍💻">
        <div className="flex flex-col gap-1.5">
          <AnimatePresence mode="popLayout" initial={false}>
            {senderMessages.length === 0 ? (
              <p className="py-6 text-center text-[11px] text-slate-500">
                No messages sent yet
              </p>
            ) : (
              senderMessages
                .slice(-4)
                .map((m) => (
                  <MessageCard key={m.id} message={m} compact layoutScope="deepak-phone" />
                ))
            )}
          </AnimatePresence>
        </div>
      </Phone>

      <FlowArrow label="send" active={false} />

      <ServerCard queued={queue.length} active={queue.length > 0} />

      <FlowArrow label="store" active={queue.length > 0} />

      <QueueCard queue={queue} />

      <FlowArrow label="deliver" active={aliceOnline && recipientMessages.length > 0} />

      <Phone name="Alice" online={aliceOnline} avatarColor="bg-sky-500" avatar="👩">
        <div className="flex flex-col gap-1.5">
          <AnimatePresence mode="popLayout" initial={false}>
            {recipientMessages.length === 0 ? (
              <p className="py-6 text-center text-[11px] text-slate-500">
                {aliceOnline ? 'Waiting for messages…' : 'Offline — nothing delivered'}
              </p>
            ) : (
              recipientMessages
                .slice(-4)
                .map((m) => (
                  <MessageCard key={m.id} message={m} compact layoutScope="alice-phone" />
                ))
            )}
          </AnimatePresence>
        </div>
      </Phone>
    </div>
  )
}
