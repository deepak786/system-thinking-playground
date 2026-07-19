import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { GITHUB_URL, SITE_NAME } from '../../../config/site'
import { fadeUp, staggerContainer } from '../animations'
import { GithubIcon } from './BrandIcons'

/** Section 1 — title, tagline, and the two primary actions. */
export function HeroSection() {
  return (
    <motion.section
      aria-label="Introduction"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-6 px-2 py-10 text-center sm:py-16"
    >
      <motion.span
        variants={fadeUp}
        className="flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30"
      >
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        Visual representations of invisible systems
      </motion.span>

      <motion.h1
        variants={fadeUp}
        className="max-w-3xl text-balance text-3xl font-bold tracking-tight text-slate-50 sm:text-5xl"
      >
        {SITE_NAME}
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="max-w-2xl text-balance text-base font-medium text-slate-300 sm:text-lg"
      >
        Making invisible software systems visible.
      </motion.p>

      <motion.p
        variants={fadeUp}
        className="max-w-xl text-balance text-sm leading-relaxed text-slate-400 sm:text-[15px]"
      >
        Complex systems are difficult to understand because we can&rsquo;t see
        them. This project uses carefully designed visual representations to
        reveal what happens behind the scenes—from AI systems to distributed
        architectures.
      </motion.p>

      <motion.div variants={fadeUp} className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Start Exploring
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800/80 px-6 py-3 text-sm font-semibold text-slate-200 ring-1 ring-slate-700 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <GithubIcon className="h-4 w-4" />
          View Source Code
        </a>
      </motion.div>
    </motion.section>
  )
}
