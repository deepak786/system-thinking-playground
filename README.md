# System Thinking Playground

Interactive, educational visualizations of how real-world systems work — built for a YouTube channel. Each "demo" is a self-contained, animated explainer with no backend; everything is simulated in React state.

**Stack:** React · TypeScript · Vite · TailwindCSS · Framer Motion · lucide-react

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
```

## Featured demo: WhatsApp Offline Delivery

Visualizes how WhatsApp handles messages when the recipient is offline:

- **Send Message** — creates a message. If Alice is offline it lands in the server's **Pending Queue** (single gray tick / `sent`). If she's online it's **delivered** instantly (double gray tick).
- **Alice Online** — flushes the whole queue into **Delivered** (double gray ticks).
- **Read Messages** — turns delivered messages **read** (ticks animate to blue).
- **Alice Offline** — new messages queue again.
- **Reset** — back to the initial state.

Every action is recorded in a timestamped **Event Log** for teaching.

## Architecture

```
src/
  components/            # app-level shell (Sidebar, …)
  shared/                # cross-demo UI (Button, Card, Phone, StatusBadge)
  lib/                   # tiny utilities (cn, time formatting)
  demos/
    types.ts             # DemoDefinition contract
    registry.ts          # single source of truth for all demos
    whatsapp-delivery/
      WhatsAppDelivery.tsx
      types.ts
      hooks/             # useWhatsAppDelivery (reducer-based state machine)
      components/        # MessageCard, TickIcon, ServerCard, QueueCard, …
  App.tsx                # renders sidebar + active demo
```

## Adding a new demo

1. Create `src/demos/<your-demo>/` with a top-level component (keep state in a
   custom hook, UI in small presentational components).
2. Register it in `src/demos/registry.ts` — add a `DemoDefinition` with the
   component. Flip `comingSoon` off when ready.

That's it — the sidebar and router update automatically. Planned demos: LRU
Cache, LinkedIn Connections, Rate Limiter, Google Search, Uber Driver Matching.
