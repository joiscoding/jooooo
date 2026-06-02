/**
 * Builds a shareable canonical URL: origin + pathname (no hash or query).
 */
export function getCanonicalUrl(
  location: Pick<Location, 'origin' | 'pathname'> = window.location,
): string {
  const path = location.pathname || '/';
  return `${location.origin}${path}`;
}

/**
 * Canonical URL for a path on the current origin.
 */
export function getCanonicalUrlForPath(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return getCanonicalUrl({ origin: window.location.origin, pathname: path });
}
