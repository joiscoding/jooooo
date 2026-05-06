import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

/** Case-insensitive substring match across title, style label, season, occasion, and key items. */
export function lookMatchesSearchQuery(look: Look, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    look.title,
    STYLE_LABELS[look.tag],
    look.season,
    look.occasion,
    ...look.keyItems,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}
