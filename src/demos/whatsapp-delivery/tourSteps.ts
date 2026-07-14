import type { TourStep } from '../../shared/tour/Tour'

/** Onboarding steps for the WhatsApp delivery demo, in walkthrough order. */
export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome! 👋',
    body: 'This demo shows how WhatsApp delivers messages when the receiver is offline. Here’s a 30-second look around before you start pressing buttons.',
  },
  {
    id: 'pipeline',
    target: 'pipeline',
    title: 'The Journey',
    body: 'Messages travel top to bottom: from Deepak’s phone, to WhatsApp’s server, into a waiting line, and finally to Alice’s phone.',
  },
  {
    id: 'queue',
    target: 'queue',
    title: 'The Pending Queue',
    body: 'While Alice is offline her messages wait here, in the order they were sent. The oldest one is always delivered first — first in, first out.',
  },
  {
    id: 'status',
    target: 'status',
    title: 'Alice’s Status',
    body: 'This badge shows whether Alice is online. Messages can only reach her phone while she’s online.',
  },
  {
    id: 'panels',
    target: 'panels',
    title: 'Delivered & Read',
    body: 'Messages Alice’s phone has received appear in the top list with gray ticks. Once she reads them, they move to the bottom list and the ticks turn blue.',
  },
  {
    id: 'log',
    target: 'log',
    title: 'Event Log',
    body: 'Everything that happens is narrated here, step by step — handy when several things move at once.',
  },
  {
    id: 'controls',
    target: 'controls',
    title: 'Your Controls',
    body: 'Now it’s your turn: send a few messages while Alice is offline, then bring her online and watch the queue drain, oldest first.',
  },
]
