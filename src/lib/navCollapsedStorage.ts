/** Key matches prior lookbook PRs / Jira LB-4 discussion. */
export const LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY = 'lookbook_nav_collapsed_v1';

export function readNavCollapsed(storage: Storage): boolean {
  try {
    const v = storage.getItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY);
    if (v === '1' || v === 'true') return true;
    if (v === '0' || v === 'false') return false;
  } catch {
    /* private mode / blocked storage */
  }
  return false;
}

export function writeNavCollapsed(storage: Storage, collapsed: boolean): void {
  try {
    storage.setItem(
      LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY,
      collapsed ? '1' : '0',
    );
  } catch {
    /* ignore */
  }
}
