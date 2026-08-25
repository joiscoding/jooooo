import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

/** Case-insensitive match across look title, tag label, season, occasion, and key items. */
export function matchLookSearch(look: Look, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    look.title,
    STYLE_LABELS[look.tag],
    look.tag,
    look.season,
    look.occasion,
    ...look.keyItems,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalized);
}
