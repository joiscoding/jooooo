/** localStorage key for desktop sidebar collapsed preference (LB-4). */
export const NAV_COLLAPSED_STORAGE_KEY = 'lookbook_nav_collapsed_v1';

export function readNavCollapsed(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    const v = localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY);
    return v === '1';
  } catch {
    return false;
  }
}

export function writeNavCollapsed(collapsed: boolean): void {
  try {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, collapsed ? '1' : '0');
  } catch {
    // Quota or private mode — layout still works for the session.
  }
}
