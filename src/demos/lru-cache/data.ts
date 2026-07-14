import type { ProfileKey } from './types'

export type ProfileMeta = {
  key: ProfileKey
  name: string
  /** Tailwind classes so each profile is visually distinct everywhere. */
  bg: string
  text: string
  ring: string
}

/**
 * The five profiles users can open — the video's "User A" … values, plus two
 * extra so the cache (size 3) always has more data than it can hold.
 */
export const PROFILES: ProfileMeta[] = [
  { key: 'A', name: 'User A', bg: 'bg-sky-500', text: 'text-sky-300', ring: 'ring-sky-500/40' },
  { key: 'B', name: 'User B', bg: 'bg-violet-500', text: 'text-violet-300', ring: 'ring-violet-500/40' },
  { key: 'C', name: 'User C', bg: 'bg-emerald-500', text: 'text-emerald-300', ring: 'ring-emerald-500/40' },
  { key: 'D', name: 'User D', bg: 'bg-amber-500', text: 'text-amber-300', ring: 'ring-amber-500/40' },
  { key: 'E', name: 'User E', bg: 'bg-rose-500', text: 'text-rose-300', ring: 'ring-rose-500/40' },
]

export const profileByKey = Object.fromEntries(
  PROFILES.map((p) => [p.key, p]),
) as Record<ProfileKey, ProfileMeta>

export const CAPACITY_OPTIONS = [2, 3, 4]
export const DEFAULT_CAPACITY = 3

/** How long the pretend database takes — slow enough to feel the difference. */
export const DB_FETCH_MS = 1400
