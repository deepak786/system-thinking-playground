# How LinkedIn Finds Your Connection Level

Visualizes how LinkedIn labels people **1st / 2nd / 3rd**: a Breadth-First
Search (BFS) starts at You and ripples outward through the friendship network
one level at a time, powered by a simple waiting line (queue).

**What viewers learn:** Network (Graph) · Breadth-First Search · Queue ·
Connection Levels / Shortest Path

## How to use it

| Control | What happens |
|---|---|
| **Next Step** | Runs one small unit of the search: either the front person leaves the line to be checked, or one of their connections is looked at (new person → gets a level and joins the back of the line; known person → skipped). |
| **Auto Play / Pause** | Steps automatically every 1.2s so the ripple is easy to narrate. Stops by itself when the line is empty. |
| **Reset** | Back to the start: only You are known. |
| **Click a person** (graph or Levels panel) | Traces the shortest chain of people from You to them, e.g. `You → Alice → Emma = 2nd connection (2 hops)`. |

Every step appends a plain-language line to the **Search Story**
(e.g. `Emma found through Alice → 2nd connection`).

First-time visitors get a 6-step **onboarding tour** that spotlights each
area (graph, checking line, levels, story log, controls). It can be replayed
anytime with the **Tour** button in the header; "seen" is remembered per demo
in localStorage.

## What's on screen

- **Network graph** — 11 people connected by friendships. Unknown people are
  gray "?" circles; the moment someone is found, their circle takes the color
  of their level and a `1st`/`2nd`/`3rd` badge appears. The friendship line
  used to find them lights up in the same color.
- **The Checking Line** — the BFS queue, shown front → back. This card is the
  actual lesson: new people join the back, the front goes next, and that
  alone guarantees close people finish before far ones.
- **Connection Levels** — You / 1st / 2nd / 3rd rows filling up; a whole level
  always completes before the next one starts.
- **Search Story** — narrated log of every check, discovery, and skip.
- **Shortest chain strip** — under the graph, shows the path for whichever
  person is selected.
- **Watch on YouTube** — header link to the companion video (shared
  `WatchOnYouTube` component; a link rather than an embed so views land on
  the channel).

## Why the graph teaches BFS honestly

- **Emma** is reachable through both Alice and Bob, and **Isha** through both
  Emma and Farah — so viewers see the "already found, skip" rule fire, which
  is what keeps every label the *shortest* distance.
- Neighbors are visited in alphabetical order so every run is identical and
  narratable.

## Implementation notes

- All state lives in `hooks/useConnectionSearch.ts`: a pure reducer over
  `{ statusById, degreeById, parentById, queue, checkingId, pendingNeighbors,
  discoveryEdges, log, … }`. One `STEP` action performs exactly one
  narratable unit of work (dequeue **or** examine a single neighbor).
- Auto-play is an effect that dispatches `STEP` every `AUTO_STEP_MS` (1200ms)
  while `auto` is on and the search isn't done. Tune that constant to change
  the narration pace.
- The shortest path is derived (memoized) by walking `parentById` from the
  selected person back to You — the classic BFS parent-pointer trick.
- The graph is plain SVG; discovery edges animate in with Framer Motion
  `pathLength`, and level colors come from one shared `LEVEL_THEMES` map in
  `data.ts` so the graph, chips, and badges always match.
- The network itself (people, positions, friendships) is hand-crafted data in
  `data.ts`; components are presentational only.
