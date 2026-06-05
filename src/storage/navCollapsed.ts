const KEY = 'lookbook_nav_collapsed_v1';

export function readNavCollapsed(): boolean {
  if (typeof localStorage === 'undefined') return false;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return false;
    if (raw === 'true') return true;
    if (raw === 'false') return false;
  } catch {
    /* private mode / quota */
  }
  return false;
}

export function writeNavCollapsed(collapsed: boolean): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(KEY, collapsed ? 'true' : 'false');
  } catch {
    /* ignore */
  }
}
