import { motion } from 'framer-motion'
import { Bug, ExternalLink } from 'lucide-react'
import {
  GITHUB_ISSUES_URL,
  GITHUB_REPO_NAME,
  GITHUB_URL,
  SITE_NAME,
} from '../../../config/site'
import { fadeUp } from '../animations'
import { GithubIcon } from './BrandIcons'

/** Section 5 — repository card + "found a bug?" contribution prompt. */
export function GithubCard() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.6fr_1fr]">
      <motion.a
        variants={fadeUp}
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
        className="group flex flex-col gap-4 rounded-2xl bg-slate-900/70 p-6 ring-1 ring-slate-700/60 shadow-soft transition-all hover:-translate-y-0.5 hover:ring-slate-500/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 text-slate-100 ring-1 ring-slate-700">
            <GithubIcon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.06em] text-slate-500">
              Repository
            </p>
            <h3 className="mt-0.5 truncate text-base font-semibold text-slate-100">
              {GITHUB_REPO_NAME}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Source for every interactive demo in {SITE_NAME}. Fork it, learn
              from it, or ship an improvement.
            </p>
          </div>
        </div>

        <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors group-hover:bg-brand-400">
          View Repository
          <ExternalLink className="h-4 w-4" aria-hidden />
        </span>
      </motion.a>

      <motion.a
        variants={fadeUp}
        href={GITHUB_ISSUES_URL}
        target="_blank"
        rel="noreferrer"
        className="group flex flex-col gap-3 rounded-2xl bg-slate-900/70 p-6 ring-1 ring-slate-700/60 shadow-soft transition-all hover:-translate-y-0.5 hover:ring-slate-500/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30">
          <Bug className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-base font-semibold text-slate-100">Found a bug?</h3>
          <p className="mt-1 text-sm text-slate-400">
            Open an issue or submit a pull request. Contributions of every size
            help make these lessons clearer.
          </p>
        </div>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400">
          Open an issue
          <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </motion.a>
    </div>
  )
}
