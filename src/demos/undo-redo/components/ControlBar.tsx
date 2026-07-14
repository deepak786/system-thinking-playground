import type { ReactNode } from 'react'
import { Keyboard, RotateCcw, RotateCw, Undo2 } from 'lucide-react'
import { Button } from '../../../shared/Button'

type ControlBarProps = {
  canUndo: boolean
  canRedo: boolean
  onType: () => void
  onUndo: () => void
  onRedo: () => void
  onReset: () => void
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-300">
      {children}
    </kbd>
  )
}

/** Bottom action bar. Real Ctrl+Z / Ctrl+Y keypresses work too. */
export function ControlBar({
  canUndo,
  canRedo,
  onType,
  onUndo,
  onRedo,
  onReset,
}: ControlBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
      <Button variant="primary" icon={<Keyboard className="h-4 w-4" />} onClick={onType}>
        Type a Word
      </Button>
      <span className="flex items-center gap-2">
        <Button
          variant="info"
          icon={<Undo2 className="h-4 w-4" />}
          onClick={onUndo}
          disabled={!canUndo}
        >
          Undo
        </Button>
        <Kbd>Ctrl+Z</Kbd>
      </span>
      <span className="flex items-center gap-2">
        <Button
          variant="muted"
          icon={<RotateCw className="h-4 w-4" />}
          onClick={onRedo}
          disabled={!canRedo}
        >
          Redo
        </Button>
        <Kbd>Ctrl+Y</Kbd>
      </span>
      <Button variant="danger" icon={<RotateCcw className="h-4 w-4" />} onClick={onReset}>
        Reset
      </Button>
    </div>
  )
}
