import { useCallback, useEffect, useReducer } from 'react'
import { INITIAL_TEXT, shorten, WORDS } from '../data'
import type { LogEntry, LogKind, Snapshot, UndoRedoState } from '../types'

let logCounter = 0
let snapCounter = 0

function makeLog(kind: LogKind, message: string): LogEntry {
  return { id: `log-${logCounter++}`, timestamp: Date.now(), kind, message }
}

function makeSnapshot(text: string): Snapshot {
  return { id: `snap-${snapCounter++}`, text }
}

function makeInitialState(): UndoRedoState {
  return {
    undoStack: [makeSnapshot(INITIAL_TEXT)],
    redoStack: [],
    editCounter: 0,
    log: [
      makeLog('typed', `Started with "${INITIAL_TEXT}" — the first saved state`),
    ],
  }
}

type Action =
  | { type: 'TYPE' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }

/**
 * The video's `UndoRedo` class as a pure reducer:
 *   addState → push onto the undo stack AND clear the redo stack
 *   undo     → pop undo-top onto the redo stack (never below 1 state)
 *   redo     → pop redo-top back onto the undo stack
 * The current text is always the top of the undo stack.
 */
function reducer(state: UndoRedoState, action: Action): UndoRedoState {
  switch (action.type) {
    case 'TYPE': {
      const current = state.undoStack[state.undoStack.length - 1]
      const word = WORDS[state.editCounter % WORDS.length]
      const next = makeSnapshot(`${current.text} ${word}`)
      const hadRedo = state.redoStack.length > 0

      const logs = [
        makeLog('typed', `Typed "${word}" → saved "${shorten(next.text)}"`),
      ]
      if (hadRedo) {
        logs.push(
          makeLog(
            'cleared',
            `Redo Stack cleared — that old future no longer fits the new text`,
          ),
        )
      }

      return {
        ...state,
        undoStack: [...state.undoStack, next],
        redoStack: [],
        editCounter: state.editCounter + 1,
        log: [...state.log, ...logs],
      }
    }

    case 'UNDO': {
      // Same guard as the script: keep at least one state.
      if (state.undoStack.length <= 1) {
        return {
          ...state,
          log: [
            ...state.log,
            makeLog('blocked', 'Nothing to undo — this is the very first state'),
          ],
        }
      }
      const top = state.undoStack[state.undoStack.length - 1]
      const previous = state.undoStack[state.undoStack.length - 2]
      return {
        ...state,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, top],
        log: [
          ...state.log,
          makeLog(
            'undo',
            `Undo → "${shorten(top.text)}" moved to the Redo Stack, back to "${shorten(previous.text)}"`,
          ),
        ],
      }
    }

    case 'REDO': {
      if (state.redoStack.length === 0) {
        return {
          ...state,
          log: [
            ...state.log,
            makeLog('blocked', 'Nothing to redo — the Redo Stack is empty'),
          ],
        }
      }
      const top = state.redoStack[state.redoStack.length - 1]
      return {
        ...state,
        undoStack: [...state.undoStack, top],
        redoStack: state.redoStack.slice(0, -1),
        log: [
          ...state.log,
          makeLog('redo', `Redo → forward to "${shorten(top.text)}"`),
        ],
      }
    }

    case 'RESET':
      return {
        ...makeInitialState(),
        log: [makeLog('reset', 'Everything cleared — starting fresh')],
      }

    default:
      return state
  }
}

export type UseUndoRedo = {
  state: UndoRedoState
  currentText: string
  canUndo: boolean
  canRedo: boolean
  typeWord: () => void
  undo: () => void
  redo: () => void
  reset: () => void
}

/**
 * All simulation state for the undo/redo demo, plus real keyboard shortcuts:
 * Ctrl/Cmd+Z undoes, Ctrl+Y or Ctrl/Cmd+Shift+Z redoes — so viewers can
 * literally press Ctrl+Z and watch the stacks move.
 */
export function useUndoRedo(): UseUndoRedo {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState)

  const typeWord = useCallback(() => dispatch({ type: 'TYPE' }), [])
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [])
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey
      if (!mod) return
      const key = event.key.toLowerCase()
      if (key === 'z' && event.shiftKey) {
        event.preventDefault()
        dispatch({ type: 'REDO' })
      } else if (key === 'z') {
        event.preventDefault()
        dispatch({ type: 'UNDO' })
      } else if (key === 'y') {
        event.preventDefault()
        dispatch({ type: 'REDO' })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return {
    state,
    currentText: state.undoStack[state.undoStack.length - 1].text,
    canUndo: state.undoStack.length > 1,
    canRedo: state.redoStack.length > 0,
    typeWord,
    undo,
    redo,
    reset,
  }
}
