# Why Apps Load Faster: The LRU Cache

Visualizes a Least-Recently-Used cache: a few profiles live in fast memory
and open instantly; everything else needs a slow database trip, and when the
cache is full the profile nobody has touched for the longest gets evicted.
Mirrors the Map-based `LRUCache` class from the companion YouTube video.

**What viewers learn:** Cache · Cache Hit vs Miss · LRU Eviction ·
Memory vs Disk speed

## How to use it

| Control | What happens |
|---|---|
| **Open a Profile** (A–E) | In the cache → instant open ⚡, and the profile slides to the "most recent" end (the video's `get`: delete + re-set). Not in the cache → the database card shows a slow fetch 🐢 (~1.4s), then the profile is inserted (the video's `put`), evicting the least recently used one if the cache is full. |
| **Cache size** (2 / 3 / 4) | Resizes the cache; it empties so the new size starts clean. |
| **Reset** | Back to an empty cache. |

Suggested walkthrough (the video's exact storyline, cache size 3): open
A, B, C (three slow fetches) → open **A** again (instant, slides to most
recent: `B C A`) → open **D** → watch **B** get evicted (`C A D`).

## What's on screen

- **Open a Profile** — five profile buttons; a ⚡ badge marks the ones
  currently cached (those open instantly).
- **Cache (memory)** — the star of the demo: slots ordered
  `LEAST recent → MOST recent` exactly like the video's Map diagram. Hits
  visibly slide a profile to the right end; evictions drop the leftmost.
  Header counts instant ⚡ vs slow 🐢 opens.
- **Database (disk)** — always has all five profiles; the requested one
  pulses amber during a fetch.
- **Cache Story** — plain-language log of every hit, miss, insert, and
  eviction.

## Implementation notes

- All state lives in `hooks/useLruCache.ts`: a pure reducer mirroring the
  video's class. `OPEN` on a hit is `get` (filter out + append = delete +
  re-set on a Map); `FETCHED` is `put` (evict index 0 — the Map's first key
  — when at capacity, then append). The cache array's order IS Map insertion
  order.
- The slow database is an effect: a miss sets `fetching`, and `FETCHED` is
  dispatched after `DB_FETCH_MS` (1400ms). Clicks are ignored while a fetch
  is in flight so the story stays sequential.
- Cache chips use Framer Motion `layout`/`layoutId`, so reordering on a hit
  and eviction on overflow are visible movements, not teleports.
- Components are presentational; `data.ts` holds the profiles, capacity
  presets, and fetch delay; `types.ts` the state models.
