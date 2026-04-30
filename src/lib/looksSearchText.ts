import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

/** Lowercase text used to match gallery search queries against a look. */
export function looksSearchText(look: Look): string {
  const parts = [
    look.title,
    STYLE_LABELS[look.tag],
    look.season,
    look.occasion,
    ...look.keyItems,
  ];
  return parts.join(' ').toLowerCase();
}
