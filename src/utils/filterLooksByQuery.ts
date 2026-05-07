import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

/** Case-insensitive match across title, style label, season, occasion, and key items. */
export function filterLooksByQuery(looks: Look[], rawQuery: string): Look[] {
  const q = normalize(rawQuery);
  if (!q) return looks;

  return looks.filter((look) => {
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
  });
}
