import { useExhibit } from './hooks/useExhibit'
import { ExhibitHeader } from './components/ExhibitHeader'
import { StoryProgress } from './components/StoryProgress'
import { StoryPanel } from './components/StoryPanel'
import { ExhibitMap } from './components/ExhibitMap'
import { CompareMode } from './components/CompareMode'

/**
 * Museum-style guided exhibit: how to avoid checking every coffee shop.
 */
export function SpatialIndexingPlayground() {
  const {
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
  } = useExhibit()

  const compareOpen = state.mode === 'compare'

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-10 pt-2">
      <ExhibitHeader />

      <StoryProgress
        activeId={state.chapterId}
        completed={state.completed}
        walkthroughDone={state.walkthroughDone}
        compareOpen={compareOpen}
        isUnlocked={isChapterUnlocked}
        onSelect={selectChapter}
        onOpenCompare={openCompare}
      />

      {compareOpen ? (
        <CompareMode
          shops={shops}
          initialUser={state.user}
          quadPreview={quadPreview}
          hexLattice={hexLattice}
        />
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
          <ExhibitMap
            shops={shops}
            user={state.user}
            chapterId={state.chapterId}
            beat={state.beat}
            enterProgress={state.enterProgress}
            visitProgress={state.visitProgress}
            result={state.result}
            animatedCandidateIds={animatedCandidateIds}
            quadPreview={quadPreview}
            hexLattice={hexLattice}
            onUserClick={onMapClick}
            className="min-h-[360px] w-full sm:min-h-[440px] lg:min-h-[520px]"
          />

          <StoryPanel
            chapter={chapter}
            beat={state.beat}
            canGoNext={canGoNext}
            canOpenCompare={canOpenCompare}
            onNext={goNext}
            onOpenCompare={openCompare}
          />
        </div>
      )}
    </div>
  )
}
