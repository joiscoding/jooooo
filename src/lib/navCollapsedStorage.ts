const STORAGE_KEY = 'lookbook_nav_collapsed_v1';

export function readNavCollapsed(): boolean {
  if (typeof localStorage === 'undefined') return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === '1' || raw === 'true') return true;
    if (raw === '0' || raw === 'false') return false;
    return false;
  } catch {
    return false;
  }
}

export function writeNavCollapsed(collapsed: boolean): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
  } catch {
    // quota / private mode
  }
}

export const NAV_COLLAPSED_STORAGE_KEY = STORAGE_KEY;
