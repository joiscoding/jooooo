/** Key used for persisting desktop sidebar collapsed state (LB-4). */
export const LOOKBOOK_NAV_COLLAPSED_KEY = 'lookbook_nav_collapsed_v1' as const;

export function readNavCollapsed(): boolean | null {
  try {
    const raw = localStorage.getItem(LOOKBOOK_NAV_COLLAPSED_KEY);
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    return null;
  } catch {
    return null;
  }
}

export function writeNavCollapsed(collapsed: boolean): void {
  try {
    localStorage.setItem(LOOKBOOK_NAV_COLLAPSED_KEY, String(collapsed));
  } catch {
    // private mode / quota — ignore
  }
}
