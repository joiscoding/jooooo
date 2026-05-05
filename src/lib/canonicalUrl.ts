/** Canonical share URL: origin + pathname (no hash or query). */
export function getCanonicalPageUrl(): string {
  if (typeof window === 'undefined') return '';
  const { origin, pathname } = window.location;
  return `${origin}${pathname}`;
}

/** Build canonical URL for a path under the current origin (leading slash optional). */
export function getCanonicalUrlForPath(pathname: string): string {
  if (typeof window === 'undefined') {
    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  }
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${window.location.origin}${path}`;
}
