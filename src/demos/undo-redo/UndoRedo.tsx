import { useUndoRedo } from './hooks/useUndoRedo'
import { LearningGoals } from './components/LearningGoals'
import { EditorCard } from './components/EditorCard'
import { StackColumn } from './components/StackColumn'
import { EventLog } from './components/EventLog'
import { ControlBar } from './components/ControlBar'
import { WatchOnYouTube } from '../../shared/WatchOnYouTube'

/** Companion explainer video for this demo. */
const VIDEO_URL = 'https://www.youtube.com/watch?v=y4LWg8uVkqI'

/**
 * Educational visualization of how Ctrl+Z really works: every edit is a
 * saved state on the Undo Stack, undo moves the top to the Redo Stack, and
 * typing anything new wipes the Redo Stack. Mirrors the UndoRedo class from
 * the video.
 */
export function UndoRedo() {
  const { state, currentText, canUndo, canRedo, typeWord, undo, redo, reset } =
    useUndoRedo()

  return (
    <div className="flex min-h-full flex-col gap-4">
      <LearningGoals />

      {/* Demo header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">
            How Ctrl+Z Really Works
          </h1>
          <p className="mt-0.5 max-w-3xl text-sm text-slate-400">
            Every edit saves a copy of the text onto the{' '}
            <span className="font-semibold text-sky-300">Undo Stack</span>.
            Ctrl+Z moves the top copy to the{' '}
            <span className="font-semibold text-amber-300">Redo Stack</span> —
            and typing something new throws the Redo Stack away.
          </p>
        </div>
        <WatchOnYouTube href={VIDEO_URL} />
      </div>

      {/* Main workspace */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_minmax(300px,360px)]">
        <div className="flex flex-col gap-4">
          <EditorCard text={currentText} />

          {/* The two stacks, side by side so cards visibly fly between them */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StackColumn
              kind="undo"
              stack={state.undoStack}
              emptyLabel="Empty"
            />
            <StackColumn
              kind="redo"
              stack={state.redoStack}
              emptyLabel="Empty — press Undo and the removed state lands here"
            />
          </div>
        </div>

        {/* Story log: bounded so a long log scrolls inside the card */}
        <div className="relative h-[300px] xl:h-auto xl:min-h-[260px]">
          <div className="absolute inset-0">
            <EventLog log={state.log} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-2xl bg-slate-900/60 p-3 ring-1 ring-slate-800">
        <ControlBar
          canUndo={canUndo}
          canRedo={canRedo}
          onType={typeWord}
          onUndo={undo}
          onRedo={redo}
          onReset={reset}
        />
      </div>
    </div>
  )
}
