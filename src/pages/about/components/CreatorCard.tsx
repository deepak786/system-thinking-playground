import { motion } from 'framer-motion'
import { AUTHOR_BIO, AUTHOR_NAME } from '../../../config/site'
import { fadeUp } from '../animations'
import { SocialLinks } from './SocialLinks'

/**
 * Section 6 — creator blurb with avatar placeholder and social links.
 * Identity and URLs come from `config/site`.
 */
export function CreatorCard() {
  const initial = AUTHOR_NAME.charAt(0).toUpperCase()

  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-8 rounded-2xl bg-slate-900/70 p-6 ring-1 ring-slate-700/60 shadow-soft sm:flex-row sm:items-start sm:gap-10 sm:p-8"
    >
      <div className="flex shrink-0 justify-center sm:justify-start">
        <div
          aria-hidden
          className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-500/40 via-brand-500/15 to-slate-800 text-3xl font-bold text-brand-200 ring-2 ring-brand-500/30 shadow-[0_0_40px_-12px_rgba(28,183,101,0.55)] sm:h-32 sm:w-32"
        >
          {initial}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 text-center sm:text-left">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-slate-500">
            Creator
          </p>
          <h3 className="mt-1 text-xl font-bold text-slate-100 sm:text-2xl">
            Hello, I&rsquo;m {AUTHOR_NAME}.
          </h3>
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-slate-400 sm:text-[15px]">
          {AUTHOR_BIO.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <SocialLinks className="justify-center sm:justify-start" />
      </div>
    </motion.div>
  )
}
