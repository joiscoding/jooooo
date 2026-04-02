export const NAV_COLLAPSED_STORAGE_KEY = 'lookbook:nav-collapsed';

export function readNavCollapsed(fallback = false): boolean {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY);
    if (raw === '1') return true;
    if (raw === '0') return false;
    return fallback;
  } catch {
    return fallback;
  }
}

export function writeNavCollapsed(collapsed: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      NAV_COLLAPSED_STORAGE_KEY,
      collapsed ? '1' : '0',
    );
  } catch {
    /* quota / private mode */
  }
}
