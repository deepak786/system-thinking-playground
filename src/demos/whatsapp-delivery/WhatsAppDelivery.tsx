import { CheckCheck, Eye } from 'lucide-react'
import { useWhatsAppDelivery } from './hooks/useWhatsAppDelivery'
import { TOUR_STEPS } from './tourSteps'
import { LearningGoals } from './components/LearningGoals'
import { FlowColumn } from './components/FlowColumn'
import { MessageListPanel } from './components/MessageListPanel'
import { EventLog } from './components/EventLog'
import { ControlBar } from './components/ControlBar'
import { StatusBadge } from '../../shared/StatusBadge'
import { Tour } from '../../shared/tour/Tour'
import { TourButton } from '../../shared/tour/TourButton'
import { useTour } from '../../shared/tour/useTour'

/**
 * Educational visualization of how WhatsApp delivers messages when the
 * recipient is offline: messages queue on the server, flush on reconnect,
 * and finally turn "read". Everything is simulated in local React state.
 */
export function WhatsAppDelivery() {
  const {
    state,
    totals,
    sendMessage,
    setAliceOnline,
    setAliceOffline,
    readMessages,
    reset,
  } = useWhatsAppDelivery()
  const tour = useTour('whatsapp-delivery')

  return (
    <div className="flex h-full flex-col gap-4">
      <Tour steps={TOUR_STEPS} open={tour.open} onClose={tour.close} />
      <LearningGoals />

      {/* Demo header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">
            How WhatsApp Delivers Messages
          </h1>
          <p className="mt-0.5 max-w-2xl text-sm text-slate-400">
            Watch how a message travels from Deepak to the server, waits in a
            queue while Alice is offline, and gets delivered the moment she
            reconnects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span data-tour="status">
            <StatusBadge online={state.aliceOnline} label="Alice:" />
          </span>
          <TourButton onClick={tour.start} />
        </div>
      </div>

      {/* Main workspace */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(330px,420px)_1fr_minmax(260px,330px)]">
        {/* Pipeline */}
        <div
          data-tour="pipeline"
          className="flex justify-center overflow-y-auto no-scrollbar rounded-2xl bg-slate-900/40 p-4 ring-1 ring-slate-800"
        >
          <FlowColumn state={state} />
        </div>

        {/* Delivered + Read */}
        <div data-tour="panels" className="flex min-h-0 flex-col gap-4">
          <MessageListPanel
            title="Delivered Messages"
            icon={<CheckCheck className="h-4 w-4" />}
            accent="brand"
            messages={state.delivered}
            emptyLabel="No delivered messages yet"
          />
          <MessageListPanel
            title="Read Messages"
            icon={<Eye className="h-4 w-4" />}
            accent="sky"
            messages={state.read}
            emptyLabel="Nothing read yet"
          />
        </div>

        {/* Event log */}
        <div data-tour="log" className="flex min-h-0 flex-col">
          <EventLog log={state.log} />
        </div>
      </div>

      {/* Controls */}
      <div
        data-tour="controls"
        className="rounded-2xl bg-slate-900/60 p-3 ring-1 ring-slate-800"
      >
        <ControlBar
          aliceOnline={state.aliceOnline}
          hasDelivered={totals.delivered > 0}
          onSend={sendMessage}
          onAliceOnline={setAliceOnline}
          onAliceOffline={setAliceOffline}
          onRead={readMessages}
          onReset={reset}
        />
      </div>
    </div>
  )
}
