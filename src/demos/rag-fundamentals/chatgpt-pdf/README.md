# How ChatGPT Answers Questions About Your PDF

An educational, 6-step walkthrough of retrieval-augmented generation (RAG),
aimed at beginners who know nothing about AI and developers who want to
understand how document Q&A works under the hood.

## Status

- **Screen 1 (title slide)** — implemented. Progress indicator, hero,
  display-only company document library, a fixed read-only question (this is
  a scripted demo, not a real Q&A product), and the
  Start Demo call to action, with staggered fade-and-rise entrance animations
  (respecting `prefers-reduced-motion`).
- **Screen 2 (chunking)** — implemented. Each document runs through a
  focus → scan → slice → transform sequence: it's highlighted, scanned by a
  glowing line, visibly cut into 7 slices which hold briefly ("divided"),
  and then EVERY slice flies into the chunk grid as a tile (shared-element
  `layoutId` flights — the document itself becomes the chunks; nothing
  fades in from nowhere and nothing dissolves). The first document runs
  slow to teach; the rest repeat fast. All 35 tiles are held on screen
  while the counter climbs to "✓ 127 searchable chunks created", then five
  tiles grow into the example chunk cards and the rest fade. Timing lives
  in `chunkingTimeline.ts`. The screen then waits on a Next Step button
  (currently a stub).
- **Screen 3 (retrieval)** — implemented. The five example chunks return in
  place; the question pill glides down toward them and hops across the cards
  in a quick one-at-a-time pass (~160ms each). Verdicts land together
  afterwards as purely visual ranking — signal-strength bars and graded
  borders ("Best match" → "Match" → weaker "Match"), no numbers — while the
  rest fade to gray. After the tally ("✓ 3 relevant chunks found — the other
  124 were skipped"), the rejected cards fade away and the three selected
  chunks fly together into a compact stack labelled "These chunks will be
  sent to ChatGPT" — the bridge into the next step. No embedding or vector
  language anywhere. Next Step is a stub until Screen 4.
- **Screen 4 (prompt packaging)** — implemented. Headline: "Only the
  relevant information is sent". The three selected chunks carry over
  already grouped; the question flies down to dock on top of them; a
  container seals everything into one parcel titled "What Gets Sent to
  ChatGPT" (inner rows go quiet, the parcel carries the emphasis). After a
  long reading pause, a single caption lands — "Everything in this package
  becomes the prompt sent to ChatGPT." — and the parcel shrinks into a
  ChatGPT avatar, which lights up blue, pops, and settles with a glow on
  receipt. No answer is generated; that belongs to the next screen. No
  tokens/context-window/embedding language. Next Step is a stub until
  Screen 5.
- **Screen 5 (answer generation)** — implemented. The ChatGPT avatar
  arrives already lit (continuity with Screen 4's ending) and breathes
  while "ChatGPT reads the information…"; the package opens as a checklist
  (your question + the three chunks, ticked in one by one, then faded
  out); a chat bubble types a two-paragraph answer with human rhythm —
  synthesized from all three chunks, not copied from one. Then
  "✓ Answer generated", one line of explanation, and Next Step. All facts
  in the typed answer stay consistent with the chunk texts in `data.ts`.
  No LLM/token/context-window language. Next Step is a stub until
  Screen 6.
- **Screen 6 (conclusion)** — implemented. "Why RAG matters":
  a Without RAG / With RAG comparison whose rows land in left-right pairs;
  a six-node pipeline recap (documents → chunks → retrieval → package →
  ChatGPT → response) drawn left to right; then the takeaway sentence with
  "(RAG)" popping in a beat later. Ends with a single Start Again action
  that loops back to Screen 1. No new concepts, no jargon.
- **Onboarding tour** — not yet built. The tour (per the repo convention)
  can be added now that all six screens exist, so its steps can reference
  the real UI regions.

## Design notes

- Deliberately uses a light, paper-like canvas (`#fafaf9`) inside the dark app
  shell — the story is about documents, so the screen should feel like paper.
- One accent color (`#0071e3`), used only on the Start Demo button, the active
  progress dot, and the eyebrow, so the eye lands on the single primary action.
- The document library is scenery, not controls: no checkboxes or upload. The
  prefilled question ("How many vacation days do employees get?") is answerable
  from exactly one visible document (Leave Policy), setting up an "aha" in the
  retrieval step.

## Files

- `ChatGptPdf.tsx` — top-level demo component (light canvas + motion config)
- `Screen1.tsx` — the title-slide screen composition
- `components/` — ProgressIndicator, Hero, DocumentLibrary, QuestionPanel,
  PrimaryAction
- `data.ts` — documents, default question, total step count
- `animations.ts` — shared entrance-animation variants
