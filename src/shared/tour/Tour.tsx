import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type TourStep = {
  id: string
  /**
   * Value of the target's `data-tour` attribute. Omit for a step that shows
   * as a centered card (e.g. a welcome message).
   */
  target?: string
  title: string
  body: string
}

type TourProps = {
  steps: TourStep[]
  open: boolean
  onClose: () => void
}

const SPOT_PADDING = 8
const TOOLTIP_WIDTH = 330
const TOOLTIP_EST_HEIGHT = 190
const MARGIN = 16

type Rect = { top: number; left: number; width: number; height: number }

function measure(target: string | undefined): Rect | null {
  if (!target) return null
  const el = document.querySelector(`[data-tour="${target}"]`)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return {
    top: r.top - SPOT_PADDING,
    left: r.left - SPOT_PADDING,
    width: r.width + SPOT_PADDING * 2,
    height: r.height + SPOT_PADDING * 2,
  }
}

/** Pick a spot for the tooltip: below, above, or beside the spotlight. */
function tooltipPosition(rect: Rect | null): { top: number; left: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  if (!rect) {
    return {
      top: vh / 2 - TOOLTIP_EST_HEIGHT / 2,
      left: vw / 2 - TOOLTIP_WIDTH / 2,
    }
  }

  const clampLeft = (left: number) =>
    Math.min(Math.max(left, MARGIN), vw - TOOLTIP_WIDTH - MARGIN)

  // Below the target
  if (rect.top + rect.height + TOOLTIP_EST_HEIGHT + MARGIN < vh) {
    return {
      top: rect.top + rect.height + 12,
      left: clampLeft(rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2),
    }
  }
  // Above the target
  if (rect.top - TOOLTIP_EST_HEIGHT - MARGIN > 0) {
    return {
      top: rect.top - TOOLTIP_EST_HEIGHT - 12,
      left: clampLeft(rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2),
    }
  }
  // Beside the target (tall targets like a full column)
  const sideTop = Math.min(
    Math.max(rect.top + 24, MARGIN),
    vh - TOOLTIP_EST_HEIGHT - MARGIN,
  )
  if (rect.left + rect.width + TOOLTIP_WIDTH + MARGIN < vw) {
    return { top: sideTop, left: rect.left + rect.width + 12 }
  }
  if (rect.left - TOOLTIP_WIDTH - MARGIN > 0) {
    return { top: sideTop, left: rect.left - TOOLTIP_WIDTH - 12 }
  }
  // Fallback: centered
  return {
    top: vh / 2 - TOOLTIP_EST_HEIGHT / 2,
    left: vw / 2 - TOOLTIP_WIDTH / 2,
  }
}

/**
 * Spotlight onboarding tour: dims the page, highlights one element per step
 * (via its `data-tour` attribute), and explains it in a small card. Keyboard
 * friendly: ← → to navigate, Esc to close.
 */
export function Tour({ steps, open, onClose }: TourProps) {
  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)

  const step = steps[index]
  const isLast = index === steps.length - 1

  // Restart from the beginning whenever the tour is opened.
  useEffect(() => {
    if (open) setIndex(0)
  }, [open])

  // Keep the spotlight glued to its target: scroll it into view on step
  // change, then re-measure on a short interval (layout can shift while
  // demo animations run) and on resize.
  useEffect(() => {
    if (!open || !step) return
    const el = step.target
      ? document.querySelector(`[data-tour="${step.target}"]`)
      : null
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

    const update = () => setRect(measure(step.target))
    update()
    const interval = setInterval(update, 200)
    window.addEventListener('resize', update)
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', update)
    }
  }, [open, step])

  // Keyboard navigation.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setIndex((i) => (i === steps.length - 1 ? i : i + 1))
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setIndex((i) => Math.max(0, i - 1))
      }
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () =>
      window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [open, steps.length, onClose])

  const tooltip = useMemo(() => tooltipPosition(rect), [rect])

  if (!open || !step) return null

  return (
    <AnimatePresence>
      <motion.div
        key="tour"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        aria-modal="true"
        role="dialog"
      >
        {/* Dim everything except the spotlighted element. When a step has no
            target, a plain backdrop dims the whole page. */}
        {rect ? (
          <div
            className="absolute rounded-2xl ring-2 ring-white/60 transition-all duration-300"
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.82)',
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-slate-950/80" />
        )}

        {/* Step card */}
        <div
          className="absolute transition-all duration-300"
          style={{ top: tooltip.top, left: tooltip.left, width: TOOLTIP_WIDTH }}
        >
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-slate-900 p-4 shadow-glow ring-1 ring-slate-700"
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-300">
                {index + 1} of {steps.length}
              </span>
              <button
                onClick={onClose}
                aria-label="Skip tour"
                className="ml-auto rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm font-bold text-slate-100">{step.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-300">
              {step.body}
            </p>

            <div className="mt-3.5 flex items-center gap-2">
              {/* Progress dots */}
              <div className="flex items-center gap-1">
                {steps.map((s, i) => (
                  <span
                    key={s.id}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      i === index ? 'w-4 bg-brand-400' : 'w-1.5 bg-slate-700',
                    )}
                  />
                ))}
              </div>

              <div className="ml-auto flex items-center gap-2">
                {index > 0 && (
                  <button
                    onClick={() => setIndex(index - 1)}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-300 ring-1 ring-slate-700 transition-colors hover:bg-slate-800"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                )}
                <button
                  onClick={() => (isLast ? onClose() : setIndex(index + 1))}
                  className="flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition-colors hover:bg-brand-400"
                >
                  {isLast ? 'Got it!' : 'Next'}
                  {!isLast && <ArrowRight className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
