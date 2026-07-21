import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { getStrategy } from '../algorithms/registry'
import { buildQuadtree } from '../algorithms/quadtreeSearch'
import { buildHexLattice } from '../algorithms/h3ConceptSearch'
import { CHAPTER_ORDER, getChapter } from '../narration/chapters'
import type {
  ChapterBeat,
  ChapterId,
  HexCell,
  Point,
  QuadNodeVis,
  SearchResult,
} from '../types'
import {
  DEFAULT_DISTRIBUTION,
  DEFAULT_USER,
  ENTER_MS,
  GRID_DIM,
  GRID_DRAW_MS,
  HEX_GROW_MS,
  MAX_ANIMATED_VISITS,
  QUAD_SPLIT_MS,
  REVEAL_MS,
  SEARCH_MS,
} from '../utils/constants'
import { generateCity } from '../utils/generateCity'

export type ExhibitMode = 'story' | 'compare'

type ExhibitState = {
  chapterId: ChapterId
  beat: ChapterBeat
  enterProgress: number
  user: Point
  result: SearchResult | null
  visitProgress: number
  completed: ChapterId[]
  walkthroughDone: boolean
  mode: ExhibitMode
  citySeed: number
}

function enterDuration(chapterId: ChapterId): number {
  if (chapterId === 'quadtree') return QUAD_SPLIT_MS
  if (chapterId === 'h3') return HEX_GROW_MS
  if (chapterId === 'grid') return GRID_DRAW_MS
  return ENTER_MS
}

/** ~30fps React updates — enough for animation, far cheaper on mobile. */
const PROGRESS_COMMIT_MS = 33

function animateEnter(
  runIdRef: { current: number },
  myId: number,
  chapterId: ChapterId,
  setState: Dispatch<SetStateAction<ExhibitState>>,
) {
  const duration = enterDuration(chapterId)
  const start = performance.now()
  let lastCommit = 0
  const tick = (now: number) => {
    if (runIdRef.current !== myId) return
    const t = Math.min(1, (now - start) / duration)
    const eased = 1 - (1 - t) * (1 - t)
    if (t >= 1 || now - lastCommit >= PROGRESS_COMMIT_MS) {
      lastCommit = now
      setState((s) => ({ ...s, enterProgress: eased }))
    }
    if (t < 1) {
      requestAnimationFrame(tick)
    } else {
      setState((s) =>
        s.beat === 'enter'
          ? { ...s, beat: 'ready', enterProgress: 1 }
          : s,
      )
    }
  }
  requestAnimationFrame(tick)
}

function animateSearch(
  runIdRef: { current: number },
  myId: number,
  setState: Dispatch<SetStateAction<ExhibitState>>,
) {
  const start = performance.now()
  let lastCommit = 0
  const tick = (now: number) => {
    if (runIdRef.current !== myId) return
    const t = Math.min(1, (now - start) / SEARCH_MS)
    const eased = 1 - (1 - t) * (1 - t)
    if (t >= 1 || now - lastCommit >= PROGRESS_COMMIT_MS) {
      lastCommit = now
      setState((s) => ({ ...s, visitProgress: eased }))
    }
    if (t < 1) {
      requestAnimationFrame(tick)
    } else {
      setState((s) => ({ ...s, beat: 'revealing', visitProgress: 1 }))
      window.setTimeout(() => {
        if (runIdRef.current !== myId) return
        setState((s) => {
          if (s.beat !== 'revealing') return s
          const completed = s.completed.includes(s.chapterId)
            ? s.completed
            : [...s.completed, s.chapterId]
          const walkthroughDone =
            s.walkthroughDone ||
            CHAPTER_ORDER.every((id) => completed.includes(id))
          return {
            ...s,
            beat: 'conclude',
            completed,
            walkthroughDone,
          }
        })
      }, REVEAL_MS)
    }
  }
  requestAnimationFrame(tick)
}

/**
 * Story state machine for the Spatial Indexing museum exhibit.
 */
export function useExhibit() {
  const [state, setState] = useState<ExhibitState>(() => ({
    chapterId: 'naive',
    beat: 'enter',
    enterProgress: 0,
    user: { ...DEFAULT_USER },
    result: null,
    visitProgress: 0,
    completed: [],
    walkthroughDone: false,
    mode: 'story',
    citySeed: 42_001,
  }))

  const shops = useMemo(
    () => generateCity(DEFAULT_DISTRIBUTION, state.citySeed),
    [state.citySeed],
  )

  const quadPreview: QuadNodeVis[] = useMemo(
    () => buildQuadtree(shops),
    [shops],
  )

  const hexLattice: HexCell[] = useMemo(
    () => buildHexLattice(GRID_DIM),
    [],
  )

  const runIdRef = useRef(0)
  const chapterRef = useRef(state.chapterId)
  chapterRef.current = state.chapterId
  const shopsRef = useRef(shops)
  shopsRef.current = shops

  const chapter = getChapter(state.chapterId)

  const startChapter = useCallback((chapterId: ChapterId) => {
    runIdRef.current += 1
    const myId = runIdRef.current
    setState((s) => ({
      ...s,
      chapterId,
      beat: 'enter',
      enterProgress: 0,
      result: null,
      visitProgress: 0,
      mode: 'story',
    }))
    animateEnter(runIdRef, myId, chapterId, setState)
  }, [])

  useEffect(() => {
    runIdRef.current += 1
    const myId = runIdRef.current
    animateEnter(runIdRef, myId, 'naive', setState)
  }, [])

  const runSearch = useCallback((user: Point, chapterId: ChapterId) => {
    const strat = getStrategy(chapterId)
    const result = strat.search(user, shopsRef.current, { gridDim: GRID_DIM })
    runIdRef.current += 1
    const myId = runIdRef.current
    setState((s) => ({
      ...s,
      user,
      chapterId,
      beat: 'searching',
      visitProgress: 0,
      result,
    }))
    animateSearch(runIdRef, myId, setState)
  }, [])

  const onMapClick = useCallback(
    (user: Point) => {
      if (state.mode === 'compare') return
      if (state.beat !== 'ready' && state.beat !== 'conclude') return
      runSearch(user, chapterRef.current)
    },
    [runSearch, state.beat, state.mode],
  )

  const goNext = useCallback(() => {
    const idx = CHAPTER_ORDER.indexOf(chapterRef.current)
    if (idx < 0 || idx >= CHAPTER_ORDER.length - 1) return
    startChapter(CHAPTER_ORDER[idx + 1]!)
  }, [startChapter])

  const selectChapter = useCallback(
    (chapterId: ChapterId) => {
      const unlocked =
        state.walkthroughDone ||
        state.completed.includes(chapterId) ||
        chapterId === state.chapterId ||
        (() => {
          const idx = CHAPTER_ORDER.indexOf(chapterId)
          if (idx <= 0) return true
          return state.completed.includes(CHAPTER_ORDER[idx - 1]!)
        })()
      if (!unlocked) return

      // Returning to a finished chapter: show partition immediately, no intro replay.
      if (
        state.completed.includes(chapterId) ||
        (state.walkthroughDone && chapterId !== state.chapterId)
      ) {
        runIdRef.current += 1
        setState((s) => ({
          ...s,
          chapterId,
          beat: 'ready',
          enterProgress: 1,
          result: null,
          visitProgress: 0,
          mode: 'story',
        }))
        return
      }

      startChapter(chapterId)
    },
    [startChapter, state.completed, state.chapterId, state.walkthroughDone],
  )

  const openCompare = useCallback(() => {
    if (!state.walkthroughDone) return
    runIdRef.current += 1
    setState((s) => ({
      ...s,
      mode: 'compare',
      beat: 'ready',
      result: null,
      visitProgress: 0,
      enterProgress: 1,
    }))
  }, [state.walkthroughDone])

  const closeCompare = useCallback(() => {
    runIdRef.current += 1
    setState((s) => ({
      ...s,
      mode: 'story',
      beat: 'ready',
      enterProgress: 1,
      result: null,
      visitProgress: 0,
    }))
  }, [])

  const animatedCandidateIds = useMemo(() => {
    const ids = state.result?.candidateIds ?? []
    if (ids.length <= MAX_ANIMATED_VISITS) return ids
    const out: number[] = []
    const step = ids.length / MAX_ANIMATED_VISITS
    for (let i = 0; i < MAX_ANIMATED_VISITS; i++) {
      out.push(ids[Math.floor(i * step)]!)
    }
    if (state.result && !out.includes(state.result.nearestId)) {
      out[out.length - 1] = state.result.nearestId
    }
    return out
  }, [state.result])

  const canGoNext =
    state.beat === 'conclude' &&
    CHAPTER_ORDER.indexOf(state.chapterId) < CHAPTER_ORDER.length - 1

  const canOpenCompare =
    state.walkthroughDone &&
    (state.beat === 'conclude' || state.beat === 'ready') &&
    state.mode === 'story'

  const isChapterUnlocked = useCallback(
    (id: ChapterId) => {
      if (state.walkthroughDone) return true
      if (id === state.chapterId) return true
      if (state.completed.includes(id)) return true
      const idx = CHAPTER_ORDER.indexOf(id)
      if (idx <= 0) return true
      return state.completed.includes(CHAPTER_ORDER[idx - 1]!)
    },
    [state.walkthroughDone, state.chapterId, state.completed],
  )

  return {
    state,
    shops,
    chapter,
    quadPreview,
    hexLattice,
    animatedCandidateIds,
    canGoNext,
    canOpenCompare,
    isChapterUnlocked,
    onMapClick,
    goNext,
    selectChapter,
    openCompare,
    closeCompare,
  }
}
