import { useEffect, useState } from 'react'

const LITE_QUERY = '(max-width: 768px), (prefers-reduced-motion: reduce)'

function matchesLite(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(LITE_QUERY).matches
}

/**
 * True on narrow viewports or when the OS asks for reduced motion.
 * Use to skip expensive Framer layout morphs / filters on phones.
 */
export function useLiteMotion(): boolean {
  const [lite, setLite] = useState(matchesLite)

  useEffect(() => {
    const mq = window.matchMedia(LITE_QUERY)
    const update = () => setLite(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return lite
}

/** Drop shared-element layoutIds on mobile — morphs are the main jank source. */
export function useOptionalLayoutId(id: string | undefined): string | undefined {
  const lite = useLiteMotion()
  return lite || id === undefined ? undefined : id
}
