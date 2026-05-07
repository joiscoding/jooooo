/**
 * Detects the app-wide “focus search” chord: ⌘K (macOS) or Ctrl+K (Windows/Linux).
 * Does not treat Meta+Ctrl+K as a match to reduce accidental triggers.
 */
export function isGlobalSearchShortcut(e: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'repeat'>): boolean {
  if (e.repeat) return false;
  if (e.key !== 'k' && e.key !== 'K') return false;
  if (e.metaKey && e.ctrlKey) return false;
  if (e.metaKey && !e.ctrlKey) return true;
  if (!e.metaKey && e.ctrlKey) return true;
  return false;
}
