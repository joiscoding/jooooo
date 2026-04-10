/** Canonical share URL: current origin + path only (no hash or query). */
export function canonicalUrlFromPath(pathname: string): string {
  if (typeof window === 'undefined') {
    const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return path;
  }
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${window.location.origin}${path}`;
}
