import { Coffee, FileSearch, Gauge, MessageCircle, Network, Package, PenLine, Scissors, SearchCheck, Undo2, Zap } from 'lucide-react'
import type { DemoDefinition } from './types'
import { WhatsAppDelivery } from './whatsapp-delivery/WhatsAppDelivery'
import { LinkedInConnections } from './linkedin-connections/LinkedInConnections'
import { ApiRateLimiter } from './api-rate-limiter/ApiRateLimiter'
import { UndoRedo } from './undo-redo/UndoRedo'
import { LruCache } from './lru-cache/LruCache'
import { ChatGptPdf } from './rag-fundamentals/chatgpt-pdf/ChatGptPdf'
import { PdfChunking } from './rag-fundamentals/pdf-chunking/PdfChunking'
import { PdfRetrieval } from './rag-fundamentals/pdf-retrieval/PdfRetrieval'
import { PdfContext } from './rag-fundamentals/pdf-context/PdfContext'
import { PdfGeneration } from './rag-fundamentals/pdf-generation/PdfGeneration'
import { SpatialIndexingPlayground } from './spatial-indexing-playground/SpatialIndexingPlayground'

/**
 * Single source of truth for demos and series.
 * - Top-level demo with `component` → `/{id}` route, Home card, sidebar link.
 * - Entry with `demos: [...]` → series hub at `/{id}`; nested demos are
 *   episodes at `/{id}/{demoId}` (array order = Part number).
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
    id: 'rag-fundamentals',
    title: 'RAG Fundamentals',
    description:
      'A five-part series on how ChatGPT answers questions about your PDF — from chunking to the final answer.',
    metaDescription:
      'Interactive five-part series on retrieval-augmented generation: watch how a PDF is split, searched, packaged into context, and used to write an answer.',
    icon: FileSearch,
    accentClass: 'text-blue-400',
    demos: [
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
      {
        id: 'pdf-chunking',
        title: 'How AI Splits Your PDF into Chunks',
        description: 'Why one PDF becomes many small pieces',
        difficulty: 'Beginner',
        concepts: ['Chunking', 'Documents', 'Search', 'Chunk Size'],
        metaDescription:
          'Interactive visualization of why AI splits PDFs into chunks: see a 320-page document divided into small pieces, why searching them beats searching the whole file, and what the right chunk size looks like.',
        icon: Scissors,
        accentClass: 'text-cyan-400',
        component: PdfChunking,
      },
      {
        id: 'pdf-retrieval',
        title: 'How AI Finds the Right Information in Your PDF',
        description: 'How AI picks the few chunks that matter',
        difficulty: 'Beginner',
        concepts: ['Search', 'Relevance', 'Ranking', 'Context'],
        metaDescription:
          'Interactive visualization of how AI finds the right information in a PDF: watch one question check twenty chunks, rank the closest matches, and send only the top three forward.',
        icon: SearchCheck,
        accentClass: 'text-teal-400',
        component: PdfRetrieval,
      },
      {
        id: 'pdf-context',
        title: 'What Does ChatGPT Actually Receive?',
        description: 'The package of question + relevant chunks',
        difficulty: 'Beginner',
        concepts: ['Context', 'Question', 'Selected Chunks', 'Answer'],
        metaDescription:
          'Interactive visualization of what ChatGPT actually receives: not your entire PDF, but one package containing your question and only the relevant chunks — and how the answer is generated from exactly that.',
        icon: Package,
        accentClass: 'text-indigo-400',
        component: PdfContext,
      },
      {
        id: 'pdf-generation',
        title: 'How ChatGPT Generates Answers Using Your PDF',
        description: 'Reading the context & writing the answer',
        difficulty: 'Beginner',
        concepts: ['Reading', 'Answer Generation', 'Grounding', 'RAG'],
        metaDescription:
          'Interactive visualization of how ChatGPT generates answers using your PDF: it receives the question and relevant chunks, reads them carefully, and writes a natural-language answer — the finale of the RAG Fundamentals series.',
        icon: PenLine,
        accentClass: 'text-amber-400',
        component: PdfGeneration,
      },
    ],
  },
  {
    id: 'spatial-indexing-playground',
    title: 'Spatial Indexing Playground',
    description: 'Find nearby places without searching the whole city',
    difficulty: 'Beginner',
    concepts: ['Spatial Index', 'Nearest Neighbor', 'Grid', 'Quadtree'],
    metaDescription:
      'A guided interactive exhibit on spatial indexing: watch why checking every coffee shop fails, then learn how fixed grids, adaptive quadtrees, and hexagons shrink the search.',
    icon: Coffee,
    accentClass: 'text-amber-400',
    component: SpatialIndexingPlayground,
  },
]
