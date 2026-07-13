import { MessageCircle, Network } from 'lucide-react'
import type { DemoDefinition } from './types'
import { WhatsAppDelivery } from './whatsapp-delivery/WhatsAppDelivery'
import { LinkedInConnections } from './linkedin-connections/LinkedInConnections'

/**
 * The single source of truth for every demo in the playground.
 * Routes (`/<id>`), the sidebar, and the Home page cards are all generated
 * from this list — registering a demo here is the only wiring step.
 */
export const demoRegistry: DemoDefinition[] = [
  {
    id: 'whatsapp-delivery',
    title: 'How WhatsApp Delivers Messages',
    description: 'Offline message queue & delivery ticks',
    difficulty: 'Beginner',
    concepts: ['Queue', 'FIFO', 'Message IDs', 'Message Delivery'],
    metaDescription:
      'Interactive visualization of how WhatsApp delivers messages when the recipient is offline: watch messages wait in a queue and get delivered one by one, oldest first.',
    icon: MessageCircle,
    accentClass: 'text-brand-400',
    component: WhatsAppDelivery,
  },
  {
    id: 'linkedin-connections',
    title: 'How LinkedIn Finds Your Connection Level',
    description: 'Breadth-first search ripples out level by level',
    difficulty: 'Beginner',
    concepts: ['Graph', 'BFS', 'Queue', 'Shortest Path'],
    metaDescription:
      'Interactive visualization of how LinkedIn labels people 1st, 2nd, or 3rd: a breadth-first search (BFS) explores your network one level at a time using a simple queue.',
    icon: Network,
    accentClass: 'text-sky-400',
    component: LinkedInConnections,
  },
]
