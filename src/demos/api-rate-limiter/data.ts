import type { ClientId } from './types'

export type ClientMeta = {
  id: ClientId
  name: string
  /** Tailwind classes so each user is visually distinct everywhere. */
  accentText: string
  accentChip: string
  accentDot: string
}

/**
 * Two separate users, because the limiter counts PER USER (the script's
 * `Map` keyed by userId): one user hitting their limit never affects the
 * other.
 */
export const CLIENTS: ClientMeta[] = [
  {
    id: 'deepak',
    name: 'Deepak',
    accentText: 'text-sky-300',
    accentChip: 'bg-sky-500/15 text-sky-300 ring-sky-500/40',
    accentDot: 'bg-sky-400',
  },
  {
    id: 'alice',
    name: 'Alice',
    accentText: 'text-violet-300',
    accentChip: 'bg-violet-500/15 text-violet-300 ring-violet-500/40',
    accentDot: 'bg-violet-400',
  },
]

export const clientById = Object.fromEntries(
  CLIENTS.map((c) => [c.id, c]),
) as Record<ClientId, ClientMeta>

/** Rule presets. Small windows so viewers see a full cycle quickly. */
export const LIMIT_OPTIONS = [3, 5, 8]
export const WINDOW_OPTIONS = [
  { ms: 10_000, label: '10 sec' },
  { ms: 30_000, label: '30 sec' },
  { ms: 60_000, label: '1 min' },
]

export const DEFAULT_LIMIT = 3
export const DEFAULT_WINDOW_MS = 10_000

/** "10 seconds" / "1 minute" for log lines and explanations. */
export function windowLabel(ms: number): string {
  return ms >= 60_000 ? `${ms / 60_000} minute${ms > 60_000 ? 's' : ''}` : `${ms / 1000} seconds`
}
