import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GITHUB_URL, SITE_NAME, YOUTUBE_URL } from '../../../config/site'
import { fadeUp } from '../animations'

const NAV_LINKS = [
  { label: 'Home', to: '/', external: false },
  { label: 'About', to: '/about', external: false },
  { label: 'GitHub', to: GITHUB_URL, external: true },
  { label: 'YouTube', to: YOUTUBE_URL, external: true },
] as const

/** Section 7 — quiet closing bar for the About page. */
export function Footer() {
  return (
    <motion.footer
      variants={fadeUp}
      className="mt-4 border-t border-slate-800/80 pt-8"
    >
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
        <div>
          <p className="text-sm font-semibold text-slate-200">{SITE_NAME}</p>
          <p className="mt-1 text-xs text-slate-500">
            Built with{' '}
            <span aria-label="love" role="img">
              ❤️
            </span>{' '}
            using React, TypeScript and Framer Motion.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.to}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </motion.footer>
  )
}
