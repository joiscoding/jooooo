import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

export function filterLooksByQuery(looks: Look[], query: string): Look[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return looks;
  }

  return looks.filter((look) => {
    const haystack = [
      look.title,
      look.season,
      look.occasion,
      STYLE_LABELS[look.tag],
      ...look.keyItems,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
}
