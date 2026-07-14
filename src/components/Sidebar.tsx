import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, Sparkles } from 'lucide-react'
import type { DemoDefinition } from '../demos/types'
import { cn } from '../lib/cn'

type SidebarProps = {
  demos: DemoDefinition[]
}

const COLLAPSED_KEY = 'sidebar-collapsed'

/**
 * Left navigation: brand (links home) plus one NavLink per registered demo.
 * On desktop it can be collapsed to an icon-only rail; the choice is
 * remembered in localStorage. On mobile the sidebar stacks above the page,
 * so the toggle is hidden there.
 */
export function Sidebar({ demos }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSED_KEY) === 'yes',
  )

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(COLLAPSED_KEY, next ? 'yes' : 'no')
      return next
    })
  }

  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose
  const toggleLabel = collapsed ? 'Expand sidebar' : 'Collapse sidebar'

  return (
    <aside
      className={cn(
        'flex w-full shrink-0 flex-col gap-4 transition-[width] duration-300',
        collapsed ? 'lg:w-[72px]' : 'lg:w-72',
      )}
    >
      <div className={cn('flex items-center gap-1.5', collapsed && 'lg:flex-col lg:gap-2')}>
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
          onClick={toggle}
          aria-label={toggleLabel}
          title={toggleLabel}
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 ring-1 ring-slate-800 transition-colors hover:bg-slate-900 hover:text-slate-300 lg:flex"
        >
          <ToggleIcon className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-1.5">
        {demos.map((demo) => {
          const Icon = demo.icon
          return (
            <NavLink
              key={demo.id}
              to={`/${demo.id}`}
              title={demo.title}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                  isActive ? 'bg-slate-800 ring-1 ring-slate-700' : 'hover:bg-slate-900',
                  collapsed && 'lg:justify-center lg:px-0',
                )
              }
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 ring-1 ring-slate-700',
                  demo.accentClass,
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className={cn('min-w-0 flex-1', collapsed && 'lg:hidden')}>
                <span className="block truncate text-sm font-semibold text-slate-100">
                  {demo.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">
                  {demo.description}
                </span>
              </span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
