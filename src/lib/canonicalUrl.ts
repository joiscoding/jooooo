/**
 * Canonical share URL: origin + pathname (no hash, query, or trailing noise).
 */
export function canonicalUrlFromLocation(loc: {
  origin: string;
  pathname: string;
}): string {
  const path = loc.pathname || '/';
  return `${loc.origin}${path}`;
}

export function canonicalUrlForPath(
  origin: string,
  pathname: string,
): string {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${origin.replace(/\/$/, '')}${p}`;
}
