const SITE_NAME = 'System Thinking Playground'

type SeoProps = {
  /** Page title; rendered as "<title> | System Thinking Playground". */
  title?: string
  description: string
  /** Absolute URL (or public/ path) of the social share image. */
  ogImage?: string
}

/**
 * Per-page document metadata. Uses React 19's native metadata hoisting:
 * <title> and <meta> tags rendered here are moved into <head> automatically,
 * no Helmet-style library required.
 */
export function Seo({ title, description, ogImage }: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta
        name="twitter:card"
        content={ogImage ? 'summary_large_image' : 'summary'}
      />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </>
  )
}
