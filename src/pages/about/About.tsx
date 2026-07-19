import { motion } from 'framer-motion'
import { Brain, Code2, Eye, Target } from 'lucide-react'
import { Seo } from '../../components/Seo'
import { SITE_NAME } from '../../config/site'
import { fadeUp, staggerContainer, VIEWPORT } from './animations'
import { CreatorCard } from './components/CreatorCard'
import { FeatureCard } from './components/FeatureCard'
import { Footer } from './components/Footer'
import { GithubCard } from './components/GithubCard'
import { HeroSection } from './components/HeroSection'
import { SectionHeading } from './components/SectionHeading'

const PRINCIPLES = [
  {
    icon: Target,
    title: 'One Concept',
    description: 'Every demo focuses on a single idea.',
    accentClass: 'text-brand-400',
  },
  {
    icon: Eye,
    title: 'Visual First',
    description:
      'If a concept can be understood visually, explain it visually before introducing technical details.',
    accentClass: 'text-sky-400',
  },
  {
    icon: Brain,
    title: 'Build Mental Models',
    description:
      'The goal isn\u2019t to teach an API. The goal is to help you understand how the system behaves.',
    accentClass: 'text-violet-400',
  },
  {
    icon: Code2,
    title: 'Implementation Comes Later',
    description:
      'Once you understand the system, code becomes much easier to learn.',
    accentClass: 'text-amber-400',
  },
] as const

/**
 * About page — explains why the playground exists: to make invisible
 * software systems visible through carefully designed visual representations.
 */
export function About() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-16 pb-4 sm:gap-20">
      <Seo
        title="About"
        description={`${SITE_NAME} makes invisible software systems visible through carefully designed visual representations — from AI systems to distributed architectures.`}
      />

      <HeroSection />

      {/* Mission */}
      <motion.section
        aria-labelledby="mission-heading"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="flex flex-col gap-5"
      >
        <SectionHeading id="mission-heading" title="Why This Exists" />
        <motion.div
          variants={fadeUp}
          className="max-w-2xl space-y-4 text-sm leading-relaxed text-slate-400 sm:text-[15px]"
        >
          <p className="text-base font-medium text-slate-200 sm:text-lg">
            Software systems are invisible.
          </p>
          <p>
            When someone explains Retrieval-Augmented Generation, vector search,
            caching, or distributed systems, they often rely on code, diagrams,
            or technical jargon.
          </p>
          <p>
            But before implementation comes understanding.
          </p>
          <p>
            {SITE_NAME} creates visual representations that make complex systems
            intuitive.
          </p>
          <p className="text-slate-300">
            Every animation is designed to answer one question:
          </p>
          <p className="rounded-2xl bg-slate-900/70 px-5 py-4 text-base font-semibold text-slate-100 ring-1 ring-slate-700/60 shadow-soft sm:text-lg">
            &ldquo;What is actually happening?&rdquo;
          </p>
        </motion.div>
      </motion.section>

      {/* Design philosophy */}
      <motion.section
        aria-labelledby="philosophy-heading"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="flex flex-col gap-6"
      >
        <SectionHeading
          id="philosophy-heading"
          title="How These Visualizations Are Designed"
          subtitle="Each visualization follows four principles."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </motion.section>

      {/* Open source */}
      <motion.section
        aria-labelledby="opensource-heading"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="flex flex-col gap-6"
      >
        <SectionHeading
          id="opensource-heading"
          title="Open Source"
          subtitle="Every interactive demo is open source. Explore the implementation, learn from the code, or contribute improvements."
        />
        <GithubCard />
      </motion.section>

      {/* Creator */}
      <motion.section
        aria-labelledby="creator-heading"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="flex flex-col gap-6"
      >
        <SectionHeading id="creator-heading" title="About the Creator" />
        <CreatorCard />
      </motion.section>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        <Footer />
      </motion.div>
    </div>
  )
}
