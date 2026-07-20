# Spatial Indexing Playground

**Route:** `/spatial-indexing-playground`

A museum-style guided exhibit answering one question:

> How can we avoid checking every coffee shop when searching nearby?

## Chapters

1. **Search Everything** — check every shop  
2. **Fixed Grid** — equal regions, start nearby (Geohash concept)  
3. **Adaptive Grid** — denser areas get smaller regions (Quadtree)  
4. **Hexagonal Grid** — hexagon partition (H3-inspired, simplified)

After all four chapters, **Compare** unlocks four synchronized maps.

## Layout

- `narration/` — chapter copy  
- `algorithms/` — search strategies  
- `hooks/useExhibit.ts` — story state machine  
- `components/` — header, progress, map, panels, compare  
- `utils/` — city generation, geometry, constants  
