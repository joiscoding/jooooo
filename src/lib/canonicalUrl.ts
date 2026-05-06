/**
 * Canonical share URL: origin + pathname (no hash or query).
 */
export function buildCanonicalUrl(origin: string, pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const base = origin.replace(/\/$/, '');
  return `${base}${path}`;
}

export function canonicalUrlFromWindow(): string {
  if (typeof window === 'undefined' || !window.location) return '';
  return buildCanonicalUrl(window.location.origin, window.location.pathname);
}
