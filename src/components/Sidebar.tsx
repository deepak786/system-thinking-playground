import { Sparkles } from 'lucide-react'
import type { DemoDefinition } from '../demos/types'
import { cn } from '../lib/cn'

type SidebarProps = {
  demos: DemoDefinition[]
  activeId: string
  onSelect: (id: string) => void
}

/** Left navigation listing all demos. Locked entries are "coming soon". */
export function Sidebar({ demos, activeId, onSelect }: SidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-72">
      <div className="flex items-center gap-2.5 px-1">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/40">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight text-slate-100">
            System Thinking
          </p>
          <p className="text-xs text-slate-500">Interactive Playground</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5">
        {demos.map((demo) => {
          const Icon = demo.icon
          const active = demo.id === activeId
          const locked = Boolean(demo.comingSoon)
          return (
            <button
              key={demo.id}
              onClick={() => !locked && onSelect(demo.id)}
              disabled={locked}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                active
                  ? 'bg-slate-800 ring-1 ring-slate-700'
                  : 'hover:bg-slate-900',
                locked && 'cursor-not-allowed opacity-50 hover:bg-transparent',
              )}
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
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-slate-100">
                    {demo.title}
                  </span>
                  {locked && (
                    <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-400 ring-1 ring-slate-700">
                      Soon
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">
                  {demo.description}
                </span>
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
