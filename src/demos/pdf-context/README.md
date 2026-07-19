# What Does ChatGPT Actually Receive?

Episode 4 of the "How AI Works" series (after "How AI Finds the Right
Information in Your PDF"). One learning objective, nothing else:
**ChatGPT does not receive your entire PDF — it only receives your
question and the selected chunks.** No prompts, tokens, context
windows, APIs, or any other terminology.

The demo plays like watching someone prepare a package before mailing
it.

## The four named steps (one continuous canvas)

1. **Selected Chunks — "Your PDF never reaches ChatGPT"** — the
   320-page Employee Handbook appears with the question, then splits
   into 12 chunks (fast recap of episode 2). Three light up — Vacation
   Policy, Leave Policy, Holiday Calendar — and the rest fade. "Only
   these 3 chunks continue."
2. **Assemble — "Everything is assembled together"** — the question
   card and the three chunks sit apart as separate pieces, glide
   (shared layoutIds) into one open parcel labelled **Context for
   ChatGPT**, and then the parcel compresses shut into a compact sealed
   package ("1 question · 3 pieces of information") with a stamp
   popping in. Formula line: Question + Relevant information → One
   context.
3. **Send — "This is what ChatGPT receives"** — the sealed parcel
   arrives, opens into a plain, readable panel ("Information sent to
   ChatGPT"): the question plus three human-readable lines. No JSON, no
   code, no markdown. A ChatGPT card appears, the parcel reseals
   ("Sealing the package…"), slides into ChatGPT ("Delivering…"), and
   ChatGPT lights up. "ChatGPT only sees this information. It never
   reads the entire PDF."
4. **Answer — "Now ChatGPT can answer"** — thinking dots first, then
   the reply streams out word by word behind a blinking cursor. The
   sentence currently being written pulses blue *together with* the
   snippet it comes from, so the origin of every fact is visible while
   it's being generated. Then the headline swaps to the cliffhanger —
   *"How does ChatGPT generate the answer?"* — and the next-demo card
   ("How ChatGPT Generates Answers") appears.

## Design notes

- Same paper canvas, blue accent, named steps, reserved zone heights,
  and calm ease-out motion as episodes 2 and 3.
- Continuity through shared `layoutId`s: the PDF shell morphs into the
  chunk wall (`pdf-shell`), the question card and selected chunks keep
  their identity into the parcel (`question-card`, `ctx-chunk-<title>`),
  and the parcel morphs into the readable panel (`package`).
- Components: `StepHeader`, `NavigationFooter`, `PDFCard`,
  `QuestionCard`, `ChunkCard`, `ContextContainer`, `InformationPanel`,
  `ChatGPTCard`, `AnswerCard`. All copy, snippets, and answer sentences
  live in `data.ts`.
- Episode 3's ending card links here (`/pdf-context`); this demo's own
  ending card is a static teaser until episode 5 exists.
