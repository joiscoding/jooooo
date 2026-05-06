/** Join origin and pathname into a stable share URL (no query or hash). */
export function joinOriginAndPath(origin: string, pathname: string): string {
  const base = origin.replace(/\/$/, '');
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

/** Canonical URL for the current browser location (origin + pathname only). */
export function canonicalPageUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return joinOriginAndPath(window.location.origin, window.location.pathname);
}

/** Canonical URL for a route path on the current origin. */
export function canonicalUrlForPath(pathname: string): string {
  if (typeof window === 'undefined') {
    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  }
  return joinOriginAndPath(window.location.origin, pathname);
}
