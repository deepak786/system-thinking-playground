/** One saved version of the text. The id stays stable as it moves between
    stacks, which lets the card visibly travel Undo ↔ Redo. */
export type Snapshot = {
  id: string
  text: string
}

export type LogKind = 'typed' | 'undo' | 'redo' | 'cleared' | 'blocked' | 'reset'

export type LogEntry = {
  id: string
  timestamp: number
  kind: LogKind
  message: string
}

export type UndoRedoState = {
  /** Every saved state, oldest first — the TOP (current text) is the LAST item. */
  undoStack: Snapshot[]
  /** States removed by Undo, waiting for Redo — the TOP is the LAST item. */
  redoStack: Snapshot[]
  /** Monotonic counter so re-typing after an undo produces a DIFFERENT word. */
  editCounter: number
  log: LogEntry[]
}
