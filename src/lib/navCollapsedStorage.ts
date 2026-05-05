/** Persisted desktop sidebar collapsed flag (LB-4). */
export const NAV_COLLAPSED_STORAGE_KEY = 'lookbook_nav_collapsed_v1';

export function readNavCollapsed(): boolean {
  if (typeof localStorage === 'undefined') return false;
  try {
    const raw = localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY);
    return raw === '1' || raw === 'true';
  } catch {
    return false;
  }
}

export function writeNavCollapsed(collapsed: boolean): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, collapsed ? '1' : '0');
  } catch {
    // Quota or private mode — ignore
  }
}
