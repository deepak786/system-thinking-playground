# System Thinking Playground

Interactive, educational visualizations of how real-world systems work — built for a YouTube channel. Each "demo" is a self-contained, animated explainer with no backend; everything is simulated in React state.

**Stack:** React · TypeScript · Vite · TailwindCSS · Framer Motion · lucide-react

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
```

## Demos

Each demo lives in its own folder under `src/demos/` with its own README
covering what it teaches, how to use it, and implementation notes.

| Demo | Teaches | Docs |
|---|---|---|
| How WhatsApp Delivers Messages | Queue · FIFO · Message IDs · Message Delivery | [README](src/demos/whatsapp-delivery/README.md) |
| How LinkedIn Finds Your Connection Level | Graph · BFS · Queue · Shortest Path | [README](src/demos/linkedin-connections/README.md) |
| How APIs Prevent Abuse | Rate Limiting · Time Windows · 429 Errors | [README](src/demos/api-rate-limiter/README.md) |
| How Ctrl+Z Really Works | Stack · Undo/Redo · State History · LIFO | [README](src/demos/undo-redo/README.md) |
| Why Apps Load Faster: The LRU Cache | Cache · Hit vs Miss · LRU Eviction | [README](src/demos/lru-cache/README.md) |

## Architecture

```
src/
  components/            # app shell (Layout with sidebar + routed outlet)
  pages/                 # Home page (demo cards)
  shared/                # cross-demo UI (Button, Card, Phone, StatusBadge, WatchOnYouTube)
  lib/                   # tiny utilities (cn, time formatting)
  demos/
    types.ts             # DemoDefinition contract
    demoRegistry.ts      # single source of truth for all demos
    <demo-name>/
      README.md          # per-demo docs (usage + implementation notes)
      <Demo>.tsx         # top-level component (layout only)
      types.ts           # demo-specific models
      hooks/             # demo state (custom hook, usually a reducer)
      components/        # small presentational pieces
  App.tsx                # React Router routes, generated from the registry
```

Routing: `/` is the Home page; each demo is served at `/<id>`
(e.g. `/whatsapp-delivery`). Routes, the sidebar, and the Home cards are all
generated from `demoRegistry.ts` — nothing is hardcoded.

## Adding a new demo

1. Create `src/demos/<your-demo>/` following the structure above (state in a
   custom hook, UI in small presentational components).
2. Write a short `README.md` in the demo folder: what it teaches, the
   controls, and any implementation notes.
3. Add one entry to `src/demos/demoRegistry.ts` (id, title, description,
   difficulty, concepts, icon, component). The `id` becomes the URL.
4. Link the README in the Demos table above.

The route, sidebar entry, and Home card all appear automatically.
