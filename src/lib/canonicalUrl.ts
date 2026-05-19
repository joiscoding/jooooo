/**
 * Builds a shareable canonical URL for the current origin and a path-only route
 * (no query string or hash — stable links for routing).
 */
export function buildCanonicalPageUrl(origin: string, pathname: string): string {
  const base = origin.replace(/\/$/, '');
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${path}`;
}
