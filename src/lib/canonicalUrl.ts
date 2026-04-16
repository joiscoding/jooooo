/**
 * Builds a shareable canonical URL: origin + pathname only (no query or hash).
 */
export function buildCanonicalPageUrl(location: {
  origin: string;
  pathname: string;
}): string {
  const pathname = location.pathname || '/';
  return `${location.origin}${pathname}`;
}

/**
 * Builds a canonical URL for a route path (must start with `/`).
 */
export function buildCanonicalUrlForPath(
  origin: string,
  pathname: string
): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${origin}${path}`;
}
