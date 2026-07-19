import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { demoRegistry } from '../demos/demoRegistry'

/** App shell: sidebar navigation plus the routed page in the main panel. */
export function Layout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-4 p-4 lg:h-screen lg:flex-row lg:gap-6 lg:p-6">
      <Sidebar registry={demoRegistry} />

      <main className="min-h-0 flex-1 overflow-y-auto rounded-3xl bg-slate-900/40 p-4 ring-1 ring-slate-800 lg:p-6">
        <Outlet />
      </main>
    </div>
  )
}
