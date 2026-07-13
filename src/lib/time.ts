/** Format epoch millis as HH:MM:SS (24-hour), matching the event-log style. */
export function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/** Format epoch millis as HH:MM for compact message timestamps. */
export function formatShort(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
