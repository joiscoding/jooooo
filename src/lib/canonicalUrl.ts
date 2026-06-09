/** Stable share URL for the current origin and path (no hash or query). */
export function buildCanonicalPageUrl(origin: string, pathname: string): string {
  const base = origin.replace(/\/$/, '');
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${path}`;
}
