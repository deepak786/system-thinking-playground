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

## Architecture

```
src/
  components/            # app-level shell (Sidebar, …)
  shared/                # cross-demo UI (Button, Card, Phone, StatusBadge)
  lib/                   # tiny utilities (cn, time formatting)
  demos/
    types.ts             # DemoDefinition contract
    registry.ts          # single source of truth for all demos
    <demo-name>/
      README.md          # per-demo docs (usage + implementation notes)
      <Demo>.tsx         # top-level component (layout only)
      types.ts           # demo-specific models
      hooks/             # demo state (custom hook, usually a reducer)
      components/        # small presentational pieces
  App.tsx                # renders sidebar + active demo
```

## Adding a new demo

1. Create `src/demos/<your-demo>/` following the structure above (state in a
   custom hook, UI in small presentational components).
2. Write a short `README.md` in the demo folder: what it teaches, the
   controls, and any implementation notes.
3. Register it in `src/demos/registry.ts` — add a `DemoDefinition` with the
   component.
4. Link the README in the Demos table above.

The sidebar and router update automatically from the registry.
