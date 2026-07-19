# How ChatGPT Generates Answers Using Your PDF

Episode 5 — the finale of the "RAG Fundamentals" playlist (after "What
Does ChatGPT Actually Receive?"). One learning objective: **once ChatGPT
receives the question and the relevant information, it reads that
information and writes a natural-language answer.** No transformers,
tokens, attention, probability, or any other internals.

The closing mental model: ChatGPT never searches the PDF itself —
someone else finds the relevant information first; ChatGPT reads only
that and writes a clear answer.

## The four named steps (one continuous canvas)

1. **Receive — "ChatGPT receives the context"** — the exact package
   from episode 4 (question + three readable lines) arrives, a ChatGPT
   card appears, and the package visibly slides into it. "ChatGPT now
   has everything it needs."
2. **Read — "ChatGPT reads the information"** — the package opens: the
   question stays pinned at the top and the three information cards are
   read one at a time. Reading is literal — a soft sheen sweeps across
   each card like an eye moving down a page, then a "✓ Read" stamp and
   a quiet glow remain. No thinking, no brains, no magic. "ChatGPT
   understands the relationship between your question and the
   information provided."
3. **Generate — "The answer begins to take shape"** — two columns: the
   read information on the left, the answer streaming word by word
   behind a blinking cursor on the right. While each sentence is being
   written, it pulses blue together with the source card it comes from.
   "ChatGPT combines the relevant information into one clear answer."
4. **Summary — "The complete journey"** — the whole playlist as one
   pipeline appearing stop by stop: PDF → Chunks → Relevant chunks →
   Question + chunks → ChatGPT → Answer. Pause — then a bracket frame
   draws around the entire pipeline with a label pill on top:
   **Retrieval-Augmented Generation (RAG)**. The viewer understands the
   process first; the name is attached afterwards. Below the frame the
   plain-language formula appears: is simply Finding the right
   information + Giving it to ChatGPT + Generating an answer. Next, an
   achievement checklist ticks off one line per video ("In this playlist
   you learned: ✓ Why PDFs are split into chunks / ✓ How AI finds
   relevant information / ✓ What ChatGPT actually receives / ✓ How
   ChatGPT generates answers"). Then the
   celebratory close: "🎉 You now understand how AI answers questions
   about your PDF." / "You've learned the complete Retrieval-Augmented
   Generation (RAG) workflow." CTAs: **Replay playlist** (links to
   episode 1) and a **Next series: Embeddings Fundamentals** teaser.

## Design notes

- Same paper canvas, blue accent, named steps, reserved zone heights,
  and calm ease-out motion as episodes 2–4. Package content, question,
  and answer sentences are identical to episode 4 for continuity.
- Components: `StepHeader`, `NavigationFooter`, `QuestionCard`,
  `ContextPackage`, `ChatGPTCard`, `InfoCard` (idle / reading / read
  states), `GeneratedAnswer`, `PipelineSummary`. All copy lives in
  `data.ts`.
- Episode 4's ending card links here (`/pdf-generation`).
