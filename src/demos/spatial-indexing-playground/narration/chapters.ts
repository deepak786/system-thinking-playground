import type { ChapterDefinition, ChapterId } from '../types'

/** Short, scannable chapter copy — Idea / Why / Real-world. */
export const CHAPTERS: ChapterDefinition[] = [
  {
    id: 'naive',
    step: 1,
    shortLabel: 'Search Everything',
    title: 'Search Everything',
    idea: 'Check every coffee shop and remember the closest one so far.',
    why: 'We do not know where nearby coffee shops are.',
    takeaway: 'It always works, but gets expensive as the city grows.',
    searchArea: 'Very Large',
    searchPattern: 'Whole city',
  },
  {
    id: 'grid',
    step: 2,
    shortLabel: 'Fixed Grid',
    title: 'Fixed Grid',
    idea: 'Search nearby grid cells instead of the whole city.',
    why: 'Equal regions let us start with a smaller search area.',
    realWorld: 'Geohash uses this idea to organize locations.',
    takeaway: 'A smaller search area means fewer distance checks.',
    searchArea: 'Medium',
    searchPattern: 'Start nearby',
  },
  {
    id: 'quadtree',
    step: 3,
    shortLabel: 'Adaptive Grid',
    title: 'Adaptive Grid',
    idea: 'Only busy areas are split into smaller cells.',
    why: 'Some parts of the city have many more shops than others.',
    realWorld: 'A quadtree splits dense regions as needed.',
    takeaway: 'The grid follows the data instead of treating every area the same.',
    searchArea: 'Adaptive',
    searchPattern: 'Density-aware',
  },
  {
    id: 'h3',
    step: 4,
    shortLabel: 'Hexagonal Grid',
    title: 'Hexagonal Grid',
    idea: 'Divide space into hexagons instead of squares.',
    why: 'Squares are not the only way to divide a map.',
    realWorld:
      "H3 is Uber's hexagonal spatial index. This demo shows the basic idea.",
    takeaway: 'Hexagons are another clear way to group nearby places.',
    searchArea: 'Compact',
    searchPattern: 'Hex neighbors',
  },
]

export function getChapter(id: ChapterId): ChapterDefinition {
  return CHAPTERS.find((c) => c.id === id) ?? CHAPTERS[0]!
}

export const CHAPTER_ORDER: ChapterId[] = ['naive', 'grid', 'quadtree', 'h3']
