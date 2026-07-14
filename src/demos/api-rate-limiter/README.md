# How APIs Prevent Abuse

Visualizes fixed-window rate limiting: the API server counts each user's
requests inside a time window, and once the limit is hit it answers
**429 Too Many Requests** until the window ends. Mirrors the `RateLimiter`
class from the companion YouTube video.

**What viewers learn:** Rate Limiting · Time Windows · 429 Too Many Requests ·
Per-User Counters

## How to use it

| Control | What happens |
|---|---|
| **Send Request** (per user) | The server checks that user's counter. Under the limit → allowed (green ✓, a slot fills). At the limit → blocked (red **429**). |
| **Max requests** (3 / 5 / 8) | Changes the limit. Counters clear so the new rule starts clean. |
| **Per window of** (10s / 30s / 1 min) | Changes the window length — the "custom time" knob. |
| **Reset** | Back to the initial state. |

Suggested walkthrough: spam **Send Request** as Deepak until you get 429s,
then send one as Alice — hers is allowed, because counters are **per user**.
Then wait for Deepak's window bar to run out and send again: fresh count.

First-time visitors get a 5-step **onboarding tour** that spotlights each
area (users, server memory, log, rules). It can be replayed anytime with the
**Tour** button in the header; "seen" is remembered per demo in localStorage.

## What's on screen

- **Two user cards** — Deepak and Alice, each with a send button and their
  recent answers styled as HTTP responses (green `200` = allowed, red `429` =
  blocked, request number underneath), plus a running "blocked" tally.
- **API Server card** — the whole lesson: per user, the used request slots
  and a countdown bar for their window. When a window ends the slots don't
  clear immediately — the card says *"next request starts a fresh count"*,
  because that's how the code actually works.
- **Server Log** — plain-language story of every request, window restart,
  and rule change.

## Implementation notes

- All state lives in `hooks/useRateLimiter.ts`: a pure reducer whose
  `handleRequest` is the video script's `allowRequest` verbatim:
  first request starts a window at count 1 → window older than `windowMs`
  restarts it → count at the limit rejects → otherwise count++.
- Windows reset **lazily** (on the next request after expiry), exactly like
  the script — there is no timer that clears them. The only clock is a 200ms
  tick that animates the countdown bars, and it only runs while at least one
  window exists.
- Changing the limit or window clears all counters (with a log line) so the
  displayed state never contradicts the new rule.
- Per-user history is capped at the last 8 requests to keep the cards tidy.
- Components are presentational; `data.ts` holds the two users and the rule
  presets; `types.ts` holds the `WindowState`/`RequestRecord`/`LogEntry`
  models.
