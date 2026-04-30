/**
 * Canonical share URL: current origin + pathname (no hash).
 * Search is omitted so client-only query state is not baked into shared links.
 */
export function canonicalPageUrl(pathname: string): string {
  if (typeof window === 'undefined') {
    return pathname;
  }
  const origin = window.location.origin;
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${origin}${path}`;
}
