/**
 * Builds a shareable canonical URL from origin + pathname (no query or hash).
 */
export function getCanonicalUrl(
  pathname: string,
  origin = typeof window !== 'undefined' ? window.location.origin : 'https://example.com',
): string {
  const pathOnly = pathname.split('?')[0].split('#')[0];
  const normalized = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  return `${origin.replace(/\/$/, '')}${normalized}`;
}
