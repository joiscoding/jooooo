export const LOOKBOOK_NAV_COLLAPSED_KEY = 'lookbook_nav_collapsed_v1';

export function readNavCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(LOOKBOOK_NAV_COLLAPSED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function writeNavCollapsed(collapsed: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      LOOKBOOK_NAV_COLLAPSED_KEY,
      collapsed ? 'true' : 'false',
    );
  } catch {
    // private mode / quota — ignore
  }
}
