import type { TourStep } from '../../shared/tour/Tour'

/** Onboarding steps for the LinkedIn connections demo, in walkthrough order. */
export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome! 👋',
    body: 'This demo shows how LinkedIn figures out that someone is a 1st, 2nd or 3rd connection — using Breadth-First Search. Here’s a quick look around before you start.',
  },
  {
    id: 'graph',
    target: 'graph',
    title: 'Your Network',
    body: 'Every circle is a person and every line is a friendship. The search starts at You and ripples outward, coloring people as it discovers them.',
  },
  {
    id: 'queue',
    target: 'queue',
    title: 'The Checking Line',
    body: 'This queue is the engine of BFS. Newly found people join the back, and the front person gets checked next — that’s why level 1 always finishes before level 2.',
  },
  {
    id: 'levels',
    target: 'levels',
    title: 'Connection Levels',
    body: 'People land here as they’re discovered, grouped by degree. Click any name to highlight the shortest path from You to them on the graph.',
  },
  {
    id: 'log',
    target: 'log',
    title: 'Search Story',
    body: 'Every step of the search is narrated here — who got checked, who was discovered, and which level just completed.',
  },
  {
    id: 'controls',
    target: 'controls',
    title: 'Your Controls',
    body: 'Now it’s your turn: press Next Step to advance the search one check at a time, or Auto Play to watch the whole ripple. Reset starts over.',
  },
]
