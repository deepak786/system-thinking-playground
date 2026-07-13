import { Eye, RotateCcw, Send, Wifi, WifiOff } from 'lucide-react'
import { Button } from '../../../shared/Button'

type ControlBarProps = {
  aliceOnline: boolean
  hasDelivered: boolean
  onSend: () => void
  onAliceOnline: () => void
  onAliceOffline: () => void
  onRead: () => void
  onReset: () => void
}

/** The bottom action bar driving the whole simulation. */
export function ControlBar({
  aliceOnline,
  hasDelivered,
  onSend,
  onAliceOnline,
  onAliceOffline,
  onRead,
  onReset,
}: ControlBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Button variant="primary" icon={<Send className="h-4 w-4" />} onClick={onSend}>
        Send Message
      </Button>
      <Button
        variant="success"
        icon={<Wifi className="h-4 w-4" />}
        onClick={onAliceOnline}
        disabled={aliceOnline}
      >
        Alice Online
      </Button>
      <Button
        variant="muted"
        icon={<WifiOff className="h-4 w-4" />}
        onClick={onAliceOffline}
        disabled={!aliceOnline}
      >
        Alice Offline
      </Button>
      <Button
        variant="info"
        icon={<Eye className="h-4 w-4" />}
        onClick={onRead}
        disabled={!hasDelivered}
      >
        Read Messages
      </Button>
      <Button variant="danger" icon={<RotateCcw className="h-4 w-4" />} onClick={onReset}>
        Reset
      </Button>
    </div>
  )
}
