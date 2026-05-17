import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

export function lookMatchesQuery(look: Look, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (q.length === 0) return true;
  const blob = [
    look.title,
    STYLE_LABELS[look.tag],
    look.season,
    look.occasion,
    ...look.keyItems,
  ]
    .join(' ')
    .toLowerCase();
  return blob.includes(q);
}
