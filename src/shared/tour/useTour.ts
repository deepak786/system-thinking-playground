import { useCallback, useEffect, useState } from 'react'

/**
 * Controls when a demo's onboarding tour is shown: automatically on the
 * first visit (tracked per demo in localStorage), and again on demand via
 * `start` (the "Tour" button). Closing or finishing marks it as seen.
 */
export function useTour(demoId: string) {
  const storageKey = `tour-seen:${demoId}`
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(storageKey)) return
    // Small delay so the page has settled before the spotlight measures it.
    const timer = setTimeout(() => setOpen(true), 800)
    return () => clearTimeout(timer)
  }, [storageKey])

  const start = useCallback(() => setOpen(true), [])
  const close = useCallback(() => {
    localStorage.setItem(storageKey, 'yes')
    setOpen(false)
  }, [storageKey])

  return { open, start, close }
}
