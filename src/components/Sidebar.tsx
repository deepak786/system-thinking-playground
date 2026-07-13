import { Link, NavLink } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import type { DemoDefinition } from '../demos/types'
import { cn } from '../lib/cn'

type SidebarProps = {
  demos: DemoDefinition[]
}

/** Left navigation: brand (links home) plus one NavLink per registered demo. */
export function Sidebar({ demos }: SidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-72">
      <Link to="/" className="flex items-center gap-2.5 rounded-xl px-1 py-1 transition-colors hover:bg-slate-900">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/40">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight text-slate-100">
            System Thinking
          </p>
          <p className="text-xs text-slate-500">Interactive Playground</p>
        </div>
      </Link>

      <nav className="flex flex-col gap-1.5">
        {demos.map((demo) => {
          const Icon = demo.icon
          return (
            <NavLink
              key={demo.id}
              to={`/${demo.id}`}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                  isActive ? 'bg-slate-800 ring-1 ring-slate-700' : 'hover:bg-slate-900',
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
              <span className="min-w-0 flex-1">
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
