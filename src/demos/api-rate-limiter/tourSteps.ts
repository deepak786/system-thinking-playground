import type { TourStep } from '../../shared/tour/Tour'

/** Onboarding steps for the API rate limiter demo, in walkthrough order. */
export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome! 👋',
    body: 'This demo shows how an API stops one user from flooding it with requests — and why you sometimes see “429 Too Many Requests”. Quick look around first.',
  },
  {
    id: 'clients',
    target: 'clients',
    title: 'Two Users',
    body: 'Deepak and Alice each call the same API. Every request they send shows up as a chip: green 200 means allowed, red 429 means blocked. Each user has their own limit.',
  },
  {
    id: 'server',
    target: 'server',
    title: 'The Server’s Memory',
    body: 'Per user, the server remembers just two things: how many requests they’ve made, and when their counting window started. Filled slots and the countdown bar show both.',
  },
  {
    id: 'log',
    target: 'log',
    title: 'Server Log',
    body: 'Every decision is narrated here — which requests were allowed, which got a 429, and when a user’s window reset.',
  },
  {
    id: 'rules',
    target: 'rules',
    title: 'The Rules',
    body: 'You set the policy: how many requests are allowed per window, and how long the window lasts. Now spam Send Request as one user and watch the 429s appear!',
  },
]
