/** localStorage key for desktop sidebar collapsed preference (LB-4). */
export const LOOKBOOK_NAV_COLLAPSED_KEY = 'lookbook_nav_collapsed_v1';

export function readNavCollapsed(storage: Storage): boolean {
  try {
    return storage.getItem(LOOKBOOK_NAV_COLLAPSED_KEY) === '1';
  } catch {
    return false;
  }
}

export function writeNavCollapsed(storage: Storage, collapsed: boolean): void {
  try {
    storage.setItem(LOOKBOOK_NAV_COLLAPSED_KEY, collapsed ? '1' : '0');
  } catch {
    // private mode / quota — ignore
  }
}
