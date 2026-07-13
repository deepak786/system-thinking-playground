import { Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { Button } from '../../../shared/Button'

type ControlBarProps = {
  auto: boolean
  done: boolean
  onStep: () => void
  onPlay: () => void
  onPause: () => void
  onReset: () => void
}

/** The bottom action bar driving the search. */
export function ControlBar({ auto, done, onStep, onPlay, onPause, onReset }: ControlBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <Button
        variant="primary"
        icon={<StepForward className="h-4 w-4" />}
        onClick={onStep}
        disabled={auto || done}
      >
        Next Step
      </Button>
      {auto ? (
        <Button variant="muted" icon={<Pause className="h-4 w-4" />} onClick={onPause}>
          Pause
        </Button>
      ) : (
        <Button
          variant="success"
          icon={<Play className="h-4 w-4" />}
          onClick={onPlay}
          disabled={done}
        >
          Auto Play
        </Button>
      )}
      <Button variant="danger" icon={<RotateCcw className="h-4 w-4" />} onClick={onReset}>
        Reset
      </Button>
    </div>
  )
}
