import { MessageCircle } from 'lucide-react'
import type { DemoDefinition } from './types'
import { WhatsAppDelivery } from './whatsapp-delivery/WhatsAppDelivery'

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
]
