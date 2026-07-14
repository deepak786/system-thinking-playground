import type { TourStep } from '../../shared/tour/Tour'

/** Onboarding steps for the LRU cache demo, in walkthrough order. */
export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome! 👋',
    body: 'This demo shows why apps feel fast: a tiny cache remembers recently used data so it doesn’t hit the slow database every time. Quick look around first.',
  },
  {
    id: 'profiles',
    target: 'profiles',
    title: 'Open a Profile',
    body: 'These are the profiles you can open. A ⚡ badge means the profile is already in the cache — it will open instantly. The rest need a slow database trip.',
  },
  {
    id: 'cache',
    target: 'cache',
    title: 'The Cache',
    body: 'Fast memory with only a few slots, ordered least → most recently used. Opening a cached profile slides it to the “most recent” end; when the cache is full, the least recent one is evicted.',
  },
  {
    id: 'database',
    target: 'database',
    title: 'The Database',
    body: 'The slow but complete source of truth. Every cache miss comes here — watch the requested profile pulse while the fetch crawls along.',
  },
  {
    id: 'log',
    target: 'log',
    title: 'Story Log',
    body: 'Every hit ⚡, miss 🐢, and eviction is narrated here, so you can follow exactly why each profile loaded fast or slow.',
  },
  {
    id: 'controls',
    target: 'controls',
    title: 'Your Controls',
    body: 'Now try it: open profiles until the cache fills up, then open one more and watch the least recently used profile get evicted. Shrink the capacity to make it brutal.',
  },
]
