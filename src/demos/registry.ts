import {
  MessageCircle,
} from 'lucide-react'
import type { DemoDefinition } from './types'
import { WhatsAppDelivery } from './whatsapp-delivery/WhatsAppDelivery'

/**
 * The single source of truth for every demo in the playground. The sidebar and
 * router are generated from this list, so new demos only need an entry here.
 */
export const demos: DemoDefinition[] = [
  {
    id: 'whatsapp-delivery',
    title: 'WhatsApp Delivery',
    description: 'Offline message queue & delivery ticks',
    icon: MessageCircle,
    accentClass: 'text-brand-400',
    component: WhatsAppDelivery,
  }
]

export const defaultDemoId = demos[0].id
