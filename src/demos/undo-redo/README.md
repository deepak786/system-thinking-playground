# How Ctrl+Z Really Works

Visualizes the classic two-stack undo/redo system: every edit saves the whole
text onto an **Undo Stack**, Ctrl+Z pops the top onto a **Redo Stack**, and
typing anything new wipes the Redo Stack. Mirrors the `UndoRedo` class from
the companion YouTube video.

**What viewers learn:** Stack · Undo/Redo · State History · LIFO ·
Why redo disappears after a new edit

## How to use it

| Control | What happens |
|---|---|
| **Type a Word** | Appends the next word (starting with the video's `Hello → Hello World → Hello World!!!`) and pushes the new text onto the Undo Stack. If the Redo Stack had anything, it's cleared — with a log line explaining why. |
| **Undo** (or real `Ctrl/Cmd+Z`) | The top card visibly flies from the Undo Stack to the Redo Stack; the editor falls back to the previous state. Blocked (with a log line) at the very first state — same guard as the video's code. |
| **Redo** (or real `Ctrl+Y` / `Cmd+Shift+Z`) | The top card flies back from the Redo Stack. |
| **Reset** | Back to just `"Hello"`. |

Suggested walkthrough (the video's exact storyline): type twice → undo →
look at both stacks → redo → undo again → **type something new** and watch
the Redo Stack get wiped.

First-time visitors get a 6-step **onboarding tour** that spotlights each
area (editor, both stacks, story log, controls). It can be replayed anytime
with the **Tour** button in the header; "seen" is remembered per demo in
localStorage.

## What's on screen

- **Text Editor** — the current text with a blinking cursor; it is always
  the top of the Undo Stack.
- **Undo Stack / Redo Stack** — drawn top-down with a `TOP` badge, exactly
  like the stack diagrams in the video. Cards keep their identity as they
  move, so undo/redo is a visible flight between columns.
- **Story So Far** — plain-language log of every edit, undo, redo, clear,
  and blocked action.

## Implementation notes

- All state lives in `hooks/useUndoRedo.ts`: a pure reducer that is the
  video's class verbatim — `TYPE` = `addState` (push + clear redo),
  `UNDO` pops undo-top to redo (guarded at length ≤ 1), `REDO` pops back.
- The hook also binds real keyboard shortcuts (`Ctrl/Cmd+Z`,
  `Ctrl+Y`/`Cmd+Shift+Z`) on `window`, so pressing Ctrl+Z genuinely drives
  the visualization.
- Snapshots have stable ids and the stack cards use them as Framer Motion
  `layoutId`s — that's what makes a card animate across from one stack to
  the other instead of disappearing/reappearing.
- Words come from a pool consumed by a monotonic counter, so typing after an
  undo produces a *different* sentence — making "the old redo no longer
  fits" concrete.
- Components are presentational; `data.ts` holds the word pool, `types.ts`
  the `Snapshot`/`LogEntry` models.
