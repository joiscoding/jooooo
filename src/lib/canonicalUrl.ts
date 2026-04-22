/**
 * Builds a stable shareable URL: origin + pathname (and search when provided).
 * Omits hash fragments; query string is only included when explicitly needed.
 */
export function buildCanonicalUrl(
  origin: string,
  pathname: string,
  search: string = ''
): string {
  const base = origin.replace(/\/$/, '');
  const path = pathname && pathname.length > 0 ? pathname : '/';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const q =
    search && search.length > 0
      ? search.startsWith('?')
        ? search
        : `?${search}`
      : '';
  return `${base}${normalizedPath}${q}`;
}
