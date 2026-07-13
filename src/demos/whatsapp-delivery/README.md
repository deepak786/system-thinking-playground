# How WhatsApp Delivers Messages

Visualizes how WhatsApp delivers messages when the recipient is offline:
messages wait in a server-side queue and are delivered one by one — oldest
first — the moment the recipient reconnects.

**What viewers learn:** Queue · FIFO · Message IDs · Message Delivery

## How to use it

| Button | What happens |
|---|---|
| **Send Message** | Creates a message (`msg-1`, `msg-2`, …). Alice offline → it waits in the **Pending Queue** with a single gray tick. Alice online → delivered instantly with double gray ticks. |
| **Alice Online** | The queue drains into **Delivered** one message at a time (800ms apart), oldest first — FIFO shown, not told. |
| **Alice Offline** | New messages queue again. Going offline mid-drain pauses delivery; the rest stay queued. |
| **Read Messages** | All delivered messages become **Read**; ticks animate gray → blue. |
| **Reset** | Back to the initial state. |

Every action appends a plain-language entry to the **Event Log**
(e.g. `msg-3 delivered (first in → first out)`).

## What's on screen

- **Center pipeline** — Deepak's phone → WhatsApp Server → Pending Queue →
  Alice's phone, connected by arrows that pulse when data flows through them.
- **Pending Queue card** — shows "First In ↓ First Out", a "Next out" badge on
  the head message, and a one-line explanation of what a queue is.
- **Right panels** — Delivered Messages, Read Messages, and the Event Log.

## Implementation notes

- All state lives in `hooks/useWhatsAppDelivery.ts`: a pure reducer over
  `{ aliceOnline, queue, delivered, read, log }`. A message is always in
  exactly one list, and its `status` (`sent`/`delivered`/`read`) matches it.
- The one-by-one drain is an effect: while Alice is online and the queue is
  non-empty, a timer dispatches `DELIVER_NEXT` (pops the queue head) every
  `DRAIN_INTERVAL_MS`. Tune that constant to change the narration pace.
- Message movement between panels uses Framer Motion shared-element
  transitions: cards carry `` layoutId={`${layoutScope}-${message.id}`} ``. The
  Queue/Delivered/Read panels share the `"flow"` scope; each phone screen has
  its own scope because it renders the same messages simultaneously.
- Components are presentational only; `WhatsAppDelivery.tsx` is layout, and
  `types.ts` holds the `Message`/`LogEntry` models.
