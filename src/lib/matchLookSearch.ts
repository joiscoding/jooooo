import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function tokensFromQuery(q: string): string[] {
  return normalize(q)
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Returns true if every token matches at least one searchable field on the look. */
export function matchLookSearch(look: Look, query: string): boolean {
  const tokens = tokensFromQuery(query);
  if (tokens.length === 0) return true;

  const tagLabel = STYLE_LABELS[look.tag].toLowerCase();
  const haystacks: string[] = [
    look.title.toLowerCase(),
    look.season.toLowerCase(),
    look.occasion.toLowerCase(),
    look.tag.toLowerCase(),
    tagLabel,
    ...look.keyItems.map((k) => k.toLowerCase()),
  ];

  return tokens.every((token) =>
    haystacks.some((h) => h.includes(token)),
  );
}
