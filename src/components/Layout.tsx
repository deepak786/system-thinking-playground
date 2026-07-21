import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { demoRegistry } from '../demos/demoRegistry'

/** App shell: sidebar navigation plus the routed page in the main panel. */
export function Layout() {
  return (
    <div className="mx-auto flex h-dvh max-h-dvh w-full max-w-[1440px] flex-col gap-3 overflow-hidden p-3 sm:gap-4 sm:p-4 lg:flex-row lg:gap-6 lg:p-6">
      <Sidebar registry={demoRegistry} />

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-3xl bg-slate-900/40 p-3 ring-1 ring-slate-800 sm:p-4 lg:p-6 [-webkit-overflow-scrolling:touch]">
        <Outlet />
      </main>
    </div>
  )
}
