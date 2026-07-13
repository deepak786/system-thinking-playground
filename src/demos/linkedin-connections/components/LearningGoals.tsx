import { CheckCircle2, GraduationCap } from 'lucide-react'

const GOALS = ['Network (Graph)', 'Breadth-First Search', 'Queue', 'Connection Levels']

/** "Today you'll learn" strip shown at the very top of the demo. */
export function LearningGoals() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-gradient-to-r from-sky-500/15 via-violet-500/10 to-amber-500/15 px-4 py-3 ring-1 ring-slate-700/60">
      <span className="flex items-center gap-2 text-sm font-bold text-slate-100">
        <GraduationCap className="h-5 w-5 text-sky-300" />
        Today you&apos;ll learn
      </span>
      <div className="flex flex-wrap gap-2">
        {GOALS.map((goal) => (
          <span
            key={goal}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-200 ring-1 ring-slate-700"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            {goal}
          </span>
        ))}
      </div>
    </div>
  )
}
