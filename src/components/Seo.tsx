import { useLocation } from 'react-router-dom'

const SITE_NAME = 'System Thinking Playground'
const SITE_URL = 'https://play.deepakdroid.xyz'

type SeoProps = {
  /** Page title; rendered as "<title> | System Thinking Playground". */
  title?: string
  description: string
  /** Social share image: public/ path (e.g. "/og/foo.png") or absolute URL. */
  ogImage?: string
}

/**
 * Per-page document metadata. Uses React 19's native metadata hoisting:
 * <title> and <meta> tags rendered here are moved into <head> automatically,
 * no Helmet-style library required.
 */
export function Seo({ title, description, ogImage }: SeoProps) {
  const { pathname } = useLocation()
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const pageUrl = `${SITE_URL}${pathname === '/' ? '' : pathname}`
  // Social platforms require absolute image URLs.
  const imageUrl = ogImage?.startsWith('/') ? `${SITE_URL}${ogImage}` : ogImage

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={pageUrl} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      <meta
        name="twitter:card"
        content={imageUrl ? 'summary_large_image' : 'summary'}
      />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </>
  )
}
