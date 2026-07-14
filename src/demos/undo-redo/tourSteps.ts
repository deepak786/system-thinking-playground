import type { TourStep } from '../../shared/tour/Tour'

/** Onboarding steps for the undo/redo demo, in walkthrough order. */
export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome! 👋',
    body: 'This demo shows what really happens when you press Ctrl+Z: two stacks of saved states working together. Here’s a quick look around before you try it.',
  },
  {
    id: 'editor',
    target: 'editor',
    title: 'The Text Editor',
    body: 'This is the document you’re editing. Whatever it shows is always the top card of the Undo Stack — the current state.',
  },
  {
    id: 'undo-stack',
    target: 'undo-stack',
    title: 'The Undo Stack',
    body: 'Every edit pushes a full copy of the text on top. Pressing Undo pops the top card off — and the card below becomes the current text.',
  },
  {
    id: 'redo-stack',
    target: 'redo-stack',
    title: 'The Redo Stack',
    body: 'Undone states land here so Redo can bring them back. But watch out: typing anything new wipes this stack — that timeline is gone.',
  },
  {
    id: 'log',
    target: 'log',
    title: 'Story Log',
    body: 'Every action is narrated here — what was typed, what undo and redo moved between the stacks, and when the Redo Stack got cleared.',
  },
  {
    id: 'controls',
    target: 'controls',
    title: 'Your Controls',
    body: 'Type a few words, then undo and redo — real keyboard shortcuts (Ctrl+Z / Ctrl+Y) work too. Watch the cards fly between the two stacks.',
  },
]
