/** Persists desktop sidebar collapsed state (LB-4). */
export const NAV_COLLAPSED_STORAGE_KEY = 'lookbook_nav_collapsed_v1';

export function readNavCollapsedFromStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY);
    if (raw === 'true') return true;
    if (raw === 'false') return false;
  } catch {
    // private mode / quota
  }
  return false;
}

export function writeNavCollapsedToStorage(collapsed: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      NAV_COLLAPSED_STORAGE_KEY,
      collapsed ? 'true' : 'false',
    );
  } catch {
    // ignore
  }
}
