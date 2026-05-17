/**
 * Canonical share URL: origin + pathname (no query or hash).
 */
export function canonicalPageUrl(origin: string, pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${origin.replace(/\/$/, '')}${path}`;
}
