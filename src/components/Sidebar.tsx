import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ChevronDown,
  CircleHelp,
  Home,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  X,
} from 'lucide-react'
import type { DemoDefinition, SeriesDemo } from '../demos/types'
import { isSeries } from '../demos/types'
import { demoPath, seriesPath } from '../demos/paths'
import { cn } from '../lib/cn'

type SidebarProps = {
  registry: DemoDefinition[]
}

const COLLAPSED_KEY = 'sidebar-collapsed'

const PRIMARY_LINKS = [
  { to: '/', label: 'Home', description: 'All demos', icon: Home, end: true },
  {
    to: '/about',
    label: 'About',
    description: 'Why this exists',
    icon: CircleHelp,
    end: false,
  },
] as const

function seriesContainsPath(series: SeriesDemo, pathname: string): boolean {
  if (pathname === seriesPath(series)) return true
  return series.demos.some((episode) => pathname === demoPath(episode))
}

/**
 * Desktop: collapsible left rail.
 * Mobile: compact top bar + slide-over menu for demos.
 */
export function Sidebar({ registry }: SidebarProps) {
  const location = useLocation()
  const menuTitleId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSED_KEY) === 'yes',
  )
  const [openSeries, setOpenSeries] = useState<Set<string>>(() => new Set())
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setOpenSeries((prev) => {
      let changed = false
      const next = new Set(prev)
      for (const entry of registry) {
        if (isSeries(entry) && seriesContainsPath(entry, location.pathname)) {
          if (!next.has(entry.id)) {
            next.add(entry.id)
            changed = true
          }
        }
      }
      return changed ? next : prev
    })
  }, [location.pathname, registry])

  // Close the drawer after navigation.
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Lock the scrolling <main> (not just body) while the drawer is open,
  // close on Escape, and move focus into the panel.
  useEffect(() => {
    if (!mobileOpen) return

    const main = document.getElementById('app-main')
    const prevBody = document.body.style.overflow
    const prevMain = main?.style.overflow ?? ''
    document.body.style.overflow = 'hidden'
    if (main) main.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = prevBody
      if (main) main.style.overflow = prevMain
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(COLLAPSED_KEY, next ? 'yes' : 'no')
      return next
    })
  }

  const toggleSeries = (id: string) => {
    setOpenSeries((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose
  const toggleLabel = collapsed ? 'Expand sidebar' : 'Collapse sidebar'

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex shrink-0 items-center gap-2 lg:hidden">
        <Link
          to="/"
          title="System Thinking Playground — Home"
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-1 py-1 transition-colors hover:bg-slate-900"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/40">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-slate-100">
              System Thinking
            </p>
            <p className="text-xs text-slate-500">Interactive Playground</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-300 ring-1 ring-slate-800 transition-colors hover:bg-slate-900 hover:text-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden w-full shrink-0 flex-col gap-4 transition-[width] duration-300 lg:flex',
          'lg:h-full lg:min-h-0 lg:overflow-hidden',
          collapsed ? 'lg:w-[72px]' : 'lg:w-72',
        )}
      >
        <div
          className={cn(
            'flex shrink-0 items-center gap-1.5',
            collapsed && 'lg:flex-col lg:gap-2',
          )}
        >
          <Link
            to="/"
            title="System Thinking Playground — Home"
            className={cn(
              'flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-1 py-1 transition-colors hover:bg-slate-900',
              collapsed && 'lg:flex-none lg:px-1',
            )}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/40">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className={cn('min-w-0', collapsed && 'lg:hidden')}>
              <p className="text-sm font-bold leading-tight text-slate-100">
                System Thinking
              </p>
              <p className="text-xs text-slate-500">Interactive Playground</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={toggleLabel}
            title={toggleLabel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 ring-1 ring-slate-800 transition-colors hover:bg-slate-900 hover:text-slate-300"
          >
            <ToggleIcon className="h-5 w-5" />
          </button>
        </div>

        <NavBody
          registry={registry}
          collapsed={collapsed}
          openSeries={openSeries}
          pathname={location.pathname}
          onToggleSeries={toggleSeries}
        />
      </aside>

      {/* Mobile slide-over — inert when closed so links can't be tabbed to. */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!mobileOpen}
        inert={mobileOpen ? undefined : true}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className={cn(
            'absolute inset-0 bg-slate-950/70 transition-opacity duration-200',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={menuTitleId}
          className={cn(
            'absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col gap-4 bg-slate-950 p-4 shadow-2xl ring-1 ring-slate-800 transition-transform duration-200 ease-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-1 py-1 transition-colors hover:bg-slate-900"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/40">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p
                  id={menuTitleId}
                  className="text-sm font-bold leading-tight text-slate-100"
                >
                  System Thinking
                </p>
                <p className="text-xs text-slate-500">Interactive Playground</p>
              </div>
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 ring-1 ring-slate-800 transition-colors hover:bg-slate-900 hover:text-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <NavBody
            registry={registry}
            collapsed={false}
            openSeries={openSeries}
            pathname={location.pathname}
            onToggleSeries={toggleSeries}
          />
        </div>
      </div>
    </>
  )
}

function NavBody({
  registry,
  collapsed,
  openSeries,
  pathname,
  onToggleSeries,
}: {
  registry: DemoDefinition[]
  collapsed: boolean
  openSeries: Set<string>
  pathname: string
  onToggleSeries: (id: string) => void
}) {
  return (
    <>
      <nav aria-label="Primary" className="flex shrink-0 flex-col gap-1">
        {PRIMARY_LINKS.map(({ to, label, description, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors',
                isActive
                  ? 'bg-slate-800 ring-1 ring-slate-700'
                  : 'hover:bg-slate-900',
                collapsed && 'lg:justify-center lg:px-0',
              )
            }
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-slate-300 ring-1 ring-slate-700">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className={cn('min-w-0 flex-1', collapsed && 'lg:hidden')}>
              <span className="block truncate text-sm font-semibold text-slate-100">
                {label}
              </span>
              <span className="mt-0.5 block truncate text-xs text-slate-500">
                {description}
              </span>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className={cn('shrink-0 px-1', collapsed && 'lg:hidden')}>
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
          Demos
        </p>
      </div>

      <nav
        aria-label="Demos"
        className="-mr-1 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto overscroll-contain pr-1"
      >
        {registry.map((entry) => {
          const Icon = entry.icon

          if (isSeries(entry)) {
            const episodes = entry.demos
            const expanded = openSeries.has(entry.id)

            return (
              <div key={entry.id} className="flex flex-col gap-1">
                <div
                  className={cn(
                    'group flex items-center gap-1 rounded-xl transition-colors',
                    seriesContainsPath(entry, pathname) &&
                      !episodes.some((e) => pathname === demoPath(e))
                      ? 'bg-slate-800 ring-1 ring-slate-700'
                      : '',
                  )}
                >
                  <NavLink
                    to={seriesPath(entry)}
                    end
                    title={entry.title}
                    className={({ isActive }) =>
                      cn(
                        'flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                        isActive
                          ? 'bg-slate-800 ring-1 ring-slate-700'
                          : 'hover:bg-slate-900',
                        collapsed && 'lg:justify-center lg:px-0',
                      )
                    }
                  >
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 ring-1 ring-slate-700',
                        entry.accentClass,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span
                      className={cn('min-w-0 flex-1', collapsed && 'lg:hidden')}
                    >
                      <span className="block truncate text-sm font-semibold text-slate-100">
                        {entry.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500">
                        {episodes.length}-part series
                      </span>
                    </span>
                  </NavLink>

                  <button
                    type="button"
                    onClick={() => onToggleSeries(entry.id)}
                    aria-expanded={expanded}
                    aria-label={
                      expanded
                        ? `Collapse ${entry.title}`
                        : `Expand ${entry.title}`
                    }
                    title={expanded ? 'Collapse series' : 'Expand series'}
                    className={cn(
                      'mr-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200',
                      collapsed && 'lg:hidden',
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        expanded && 'rotate-180',
                      )}
                    />
                  </button>
                </div>

                {expanded && (
                  <div
                    className={cn(
                      'ml-[29px] flex flex-col gap-0.5 border-l border-slate-800 pl-2',
                      collapsed && 'lg:hidden',
                    )}
                  >
                    {episodes.map((episode, i) => {
                      const EpisodeIcon = episode.icon
                      return (
                        <NavLink
                          key={episode.id}
                          to={demoPath(episode)}
                          title={`Part ${i + 1} — ${episode.title}`}
                          className={({ isActive }) =>
                            cn(
                              'group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors',
                              isActive
                                ? 'bg-slate-800 ring-1 ring-slate-700'
                                : 'hover:bg-slate-900',
                            )
                          }
                        >
                          <span
                            className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-800/80 ring-1 ring-slate-700',
                              episode.accentClass,
                            )}
                          >
                            <EpisodeIcon className="h-4 w-4" />
                          </span>
                          <span className="block min-w-0 flex-1 truncate text-[13px] font-medium text-slate-300">
                            {episode.title}
                          </span>
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <NavLink
              key={entry.id}
              to={demoPath(entry)}
              title={entry.title}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                  isActive
                    ? 'bg-slate-800 ring-1 ring-slate-700'
                    : 'hover:bg-slate-900',
                  collapsed && 'lg:justify-center lg:px-0',
                )
              }
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 ring-1 ring-slate-700',
                  entry.accentClass,
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className={cn('min-w-0 flex-1', collapsed && 'lg:hidden')}>
                <span className="block truncate text-sm font-semibold text-slate-100">
                  {entry.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">
                  {entry.description}
                </span>
              </span>
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}
