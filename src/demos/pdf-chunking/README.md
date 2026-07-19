# How AI Splits Your PDF into Chunks

The second episode in the "How AI Works" series (after "How ChatGPT
Answers Questions About Your PDF"). This demo answers exactly one
question — **why does AI split PDFs into chunks?** — for viewers who know
nothing about AI. No implementation talk, no embeddings, no vector
databases, no RAG terminology.

Where episode one is cinematic (watch, then click Next), this one is
**hands-on**: the viewer performs the split and explores the chunk-size
trade-off themselves.

## The four named steps (one continuous canvas)

1. **Problem — "One question, one huge PDF"** — a tension build: the
   Employee Handbook appears as a real document (rows carry readable
   section headings — Vacation Policy, Working Hours, Expense Claims…,
   with Vacation Policy tinted blue from the first frame), the question
   lands, every page flashes in a quick wave, and only then does "Should
   AI read all of this?" and the **Split PDF** button appear.
2. **Split** — clicking the button plays a physical transformation:
   a scan line reads the block ("Scanning…"), cut lines appear and the
   labelled rows shear apart left/right ("Splitting…"), then the pieces
   fly apart (shared `layoutId`s) into a grid of chunk tiles carrying
   the same section names. "1 PDF became 120 chunks."
3. **Chunk Size** — the hero: a large Large ↔ Small slider directly
   under the grid, with stop markers. Dragging re-flows the grid live
   (2 slabs ↔ 12 cards ↔ 48 tiny squares). Tiles carry real section
   names (Vacation Policy, Payroll, Remote Work…) so slabs visibly mix
   topics, and at the small stops the tracked tiles show only fragments
   ("…vacation…", "…20…", "…days…"). The **Vacation Policy content stays
   highlighted at every stop** — same information, different sizes.
   Continue unlocks after the viewer has actually dragged.
4. **Search — "Most chunks are ignored"** — predict-then-reveal: the
   full grid (Vacation Policy still highlighted) plus *"Which chunks
   would you search?"* and a **Show Answer** button. The reveal
   breathes: irrelevant tiles fade out slowly and staggered (~1.5 s),
   then the 3 matches light up, then the statistic (*320 pages →
   120 chunks → only 3 searched*). Finally the headline itself swaps to
   the cliffhanger — *"How does AI know which chunks are relevant?"* —
   before the hand-off card: Next video, "How AI Finds the Right
   Information".

## Design notes

- Same paper canvas and single blue accent as episode one, but a
  different interaction model: no slide swaps — one persistent set of
  tiles morphs through every stage via shared `layoutId`s, so the
  document and its chunks are always the same object.
- Stage headers crossfade above the canvas; every zone has a reserved
  min-height so nothing jumps.
- Components: `StepHeader`, `NavigationFooter`, `PDFCard`,
  `QuestionBadge`, `ChunkCanvas`, `SizeSlider`. All copy and size levels
  live in `data.ts`.
