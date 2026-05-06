/** Normalizes a path segment for joining with origin (leading slash, no trailing slash on origin). */
export function normalizePathname(pathname: string): string {
  const trimmed = pathname.trim();
  if (!trimmed.startsWith('/')) {
    return `/${trimmed}`;
  }
  return trimmed;
}

/**
 * Canonical share URL: origin + pathname only (no query or hash).
 * Used for stable links when filters or scroll state are in the URL.
 */
export function buildCanonicalUrl(origin: string, pathname: string): string {
  const base = origin.replace(/\/$/, '');
  const path = normalizePathname(pathname);
  return `${base}${path}`;
}

export function getCanonicalUrlForPath(pathname: string): string {
  return buildCanonicalUrl(window.location.origin, pathname);
}
