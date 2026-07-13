import { useMemo, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { demos, defaultDemoId } from './demos/registry'

export default function App() {
  const [activeId, setActiveId] = useState(defaultDemoId)

  const active = useMemo(
    () => demos.find((d) => d.id === activeId) ?? demos[0],
    [activeId],
  )

  const ActiveDemo = active.component

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-4 p-4 lg:h-screen lg:flex-row lg:gap-6 lg:p-6">
      <Sidebar demos={demos} activeId={activeId} onSelect={setActiveId} />

      <main className="min-h-0 flex-1 rounded-3xl bg-slate-900/40 p-4 ring-1 ring-slate-800 lg:p-6">
        {ActiveDemo ? (
          <ActiveDemo />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">
            This demo is coming soon.
          </div>
        )}
      </main>
    </div>
  )
}
