/** Persisted desktop sidebar collapsed flag (LB-4). */
export const NAV_COLLAPSED_STORAGE_KEY = 'lookbook_nav_collapsed_v1';

export function collapsedFromStoredValue(raw: string | null): boolean {
  return raw === '1';
}

export function toStoredCollapsedValue(collapsed: boolean): '0' | '1' {
  return collapsed ? '1' : '0';
}

export function readNavCollapsed(): boolean {
  try {
    return collapsedFromStoredValue(
      localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)
    );
  } catch {
    return false;
  }
}

export function writeNavCollapsed(collapsed: boolean): void {
  try {
    localStorage.setItem(
      NAV_COLLAPSED_STORAGE_KEY,
      toStoredCollapsedValue(collapsed)
    );
  } catch {
    // private mode / quota — ignore
  }
}
