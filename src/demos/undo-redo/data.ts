/** The text every session starts with — the script's first `addState("Hello")`. */
export const INITIAL_TEXT = 'Hello'

/**
 * Words appended by the "Type" button, starting with the video's exact
 * Hello → Hello World → Hello World!!! sequence. The pool is consumed by a
 * monotonic counter, so after an undo the next typed word is a NEW one —
 * making it obvious the old redo path no longer matches.
 */
export const WORDS = [
  'World',
  '!!!',
  'How',
  'Are',
  'You',
  'Today',
  'My',
  'Friend',
  'Coding',
  'Is',
  'Fun',
  'Really',
]

/** Truncate long sentences for log lines and stack cards. */
export function shorten(text: string, max = 28): string {
  return text.length <= max ? text : `…${text.slice(text.length - max)}`
}
