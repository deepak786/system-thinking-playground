import { FileSearch, Gauge, MessageCircle, Network, Undo2, Zap } from 'lucide-react'
import type { DemoDefinition } from './types'
import { WhatsAppDelivery } from './whatsapp-delivery/WhatsAppDelivery'
import { LinkedInConnections } from './linkedin-connections/LinkedInConnections'
import { ApiRateLimiter } from './api-rate-limiter/ApiRateLimiter'
import { UndoRedo } from './undo-redo/UndoRedo'
import { LruCache } from './lru-cache/LruCache'
import { ChatGptPdf } from './chatgpt-pdf/ChatGptPdf'

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
  {
    id: 'api-rate-limiter',
    title: 'How APIs Prevent Abuse',
    description: 'Rate limits, time windows & 429 errors',
    difficulty: 'Beginner',
    concepts: ['Rate Limiting', 'Time Windows', '429 Errors', 'Per-User Counters'],
    metaDescription:
      'Interactive visualization of API rate limiting: the server counts each user\u2019s requests inside a time window and answers 429 Too Many Requests once the limit is hit.',
    icon: Gauge,
    accentClass: 'text-rose-400',
    component: ApiRateLimiter,
  },
  {
    id: 'undo-redo',
    title: 'How Ctrl+Z Really Works',
    description: 'Undo & redo with two stacks',
    difficulty: 'Beginner',
    concepts: ['Stack', 'Undo/Redo', 'State History', 'LIFO'],
    metaDescription:
      'Interactive visualization of undo/redo: every edit is saved on an undo stack, Ctrl+Z moves the top state to the redo stack, and new edits clear the redo stack.',
    icon: Undo2,
    accentClass: 'text-violet-400',
    component: UndoRedo,
  },
  {
    id: 'lru-cache',
    title: 'Why Apps Load Faster: The LRU Cache',
    description: 'Cache hits, misses & LRU eviction',
    difficulty: 'Beginner',
    concepts: ['Cache', 'Hit vs Miss', 'LRU Eviction', 'Memory vs Disk'],
    metaDescription:
      'Interactive visualization of an LRU cache: cached profiles open instantly, misses take a slow database trip, and the least recently used item is evicted when the cache is full.',
    icon: Zap,
    accentClass: 'text-emerald-400',
    component: LruCache,
  },
  {
    id: 'chatgpt-pdf',
    title: 'How ChatGPT Answers Questions About Your PDF',
    description: 'Behind the scenes of document Q&A',
    difficulty: 'Beginner',
    concepts: ['RAG', 'Chunking', 'Search', 'Context'],
    metaDescription:
      'Interactive walkthrough of how ChatGPT answers questions about a document: see how a PDF is split, searched, and used to write the answer, one guided step at a time.',
    icon: FileSearch,
    accentClass: 'text-blue-400',
    component: ChatGptPdf,
  },
]
