/** Full URL with origin + pathname only (no query or hash). */
export function canonicalUrlFromParts(origin: string, pathname: string): string {
  const base = origin.replace(/\/$/, '');
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

/** Canonical URL for the current browser location (same tab). */
export function canonicalCurrentPageUrl(): string {
  if (typeof window === 'undefined') return '';
  return canonicalUrlFromParts(window.location.origin, window.location.pathname);
}

/** Canonical URL for a path on the current origin (e.g. `/look/foo`). */
export function canonicalUrlForPath(pathname: string): string {
  if (typeof window === 'undefined') {
    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  }
  return canonicalUrlFromParts(window.location.origin, pathname);
}
