/** Key used for desktop sidebar collapsed preference (LB-4). */
export const NAV_COLLAPSED_STORAGE_KEY = 'lookbook_nav_collapsed_v1';

export function readNavCollapsed(
  storage: Storage | null | undefined,
): boolean | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(NAV_COLLAPSED_STORAGE_KEY);
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    return null;
  } catch {
    return null;
  }
}

export function writeNavCollapsed(
  storage: Storage | null | undefined,
  collapsed: boolean,
): void {
  if (!storage) return;
  try {
    storage.setItem(NAV_COLLAPSED_STORAGE_KEY, String(collapsed));
  } catch {
    // Quota / private mode — ignore
  }
}
