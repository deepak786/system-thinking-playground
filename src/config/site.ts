/**
 * Single source of truth for site-wide constants: names, URLs, and author
 * info. Every page and component reads from here — never hardcode these.
 */
export const SITE_NAME = 'System Thinking Playground'
export const SITE_URL = 'https://play.deepakdroid.xyz'

export const GITHUB_URL = 'https://github.com/deepak786/system-thinking-playground'
export const GITHUB_REPO_NAME = 'deepak786/system-thinking-playground'
export const GITHUB_ISSUES_URL = `${GITHUB_URL}/issues`

export const YOUTUBE_URL = 'https://www.youtube.com/@deepakdroid'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/deepakdroid'
export const PERSONAL_WEBSITE = 'https://deepakdroid.xyz'

export const AUTHOR_NAME = 'Deepak'
export const AUTHOR_BIO = [
  'I\u2019m a software engineer passionate about making complex technical concepts easier to understand.',
  'I believe the best way to learn systems is to see them in action before diving into implementation.',
  'This project combines software engineering, visual storytelling, and interactive learning to help developers build stronger mental models.',
] as const
