# How AI Finds the Right Information in Your PDF

Episode 3 of the "How AI Works" series (after "How AI Splits Your PDF
into Chunks"). This demo answers exactly one question — **after
splitting, how does AI decide which chunks to use?** — for viewers with
zero AI knowledge. No embeddings, no vector databases, no similarity
math, no tooling names.

The viewer should leave thinking: *"AI doesn't read every chunk. It
first identifies the relevant ones — and then keeps only the best."*
The funnel is 20 chunks → 8 possible matches → top 3 selected.

## The four named steps (one continuous canvas)

1. **Problem — "Many chunks. One question."** — a wall of 20 chunk
   cards with realistic handbook titles, the question pill, a soft glow
   wave across every card, then the tension line: *"Should AI read every
   chunk?"*
2. **Search — "Find the relevant chunks"** — the question glides to the
   top of the wall (shared layoutId) and *evaluates* every chunk: quick
   dismissals (~200 ms, "Expense Policy — ✕ Skip") and visibly longer
   dwells on hits ("Vacation Policy — ✓ Match", "Payroll — ✓ Possible
   match"). The sweep is a coarse filter: it ends with **8 possible
   matches** lit (2 strong, 6 possible) and 12 misses sunk to
   near-invisible. "20 chunks narrowed down to 8 possible matches."
3. **Rank — "Only the best matches remain"** — the refinement step: the
   8 candidates appear in shuffled order (still wearing their candidate
   glow from the wall), empty confidence bars fill, the list sorts
   itself (layout animation), the five weak matches fade, and "Top
   Matches" stamps the surviving three. The percentage is shown but
   never explained — only that AI doesn't stop at the first match.
4. **Context — "Only these chunks move forward"** — the full wall
   returns for a recap with the ranked top 3 still lit, everything else
   fades out slowly, and the three survivors physically fly (shared
   layoutIds) into a labelled parcel: **Context for ChatGPT**. Caption:
   "Instead of sending the entire PDF, only the most relevant chunks
   continue." Then the headline swaps to the cliffhanger — *"What does
   ChatGPT actually receive?"* — and the next-demo card appears.

## Design notes

- Same paper canvas, single blue accent, and interaction model as
  episode 2: one evolving canvas, named steps (Problem → Search → Rank →
  Context), reserved zone heights so nothing jumps, calm ease-out
  motion (no bounce).
- Chunk cards carry stable `layoutId`s (`card-<title>`), so the same
  card that gets checked on the wall is the one that lands in the
  context box.
- Components: `StepHeader`, `NavigationFooter`, `QuestionBubble`,
  `ChunkCard`, `ChunkGrid`, `RelevanceBadge`, `RankingList`,
  `ContextContainer`. All titles, verdicts, and scores live in
  `data.ts`.
