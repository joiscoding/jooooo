/**
 * Canonical share URL: origin + pathname only (no hash or query).
 */
export function buildCanonicalPageUrl(origin: string, pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const u = new URL(path, origin);
  return `${u.origin}${u.pathname}`;
}
