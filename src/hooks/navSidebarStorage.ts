export const NAV_COLLAPSED_KEY = 'lookbook_nav_collapsed_v1' as const;

type StorageApi = {
  getItem: (k: string) => string | null;
  setItem: (k: string, v: string) => void;
};

const memory = new Map<string, string>();
const memoryStore: StorageApi = {
  getItem: (k) => (memory.has(k) ? memory.get(k)! : null),
  setItem: (k, v) => {
    memory.set(k, v);
  },
};

let override: StorageApi | null = null;

/** For tests: reset memory override and in-memory data */
export function resetNavStorageForTests() {
  override = null;
  memory.clear();
}

/** For tests: use in-memory storage instead of localStorage */
export function setNavStorageOverride(store: StorageApi) {
  override = store;
}

function store(): StorageApi {
  if (override) return override;
  if (typeof localStorage === 'undefined') {
    return memoryStore;
  }
  return localStorage;
}

export function getNavCollapsed(): boolean {
  try {
    const raw = store().getItem(NAV_COLLAPSED_KEY);
    if (raw === '1' || raw === 'true') return true;
    if (raw === '0' || raw === 'false') return false;
    return false;
  } catch {
    return false;
  }
}

export function setNavCollapsed(collapsed: boolean) {
  try {
    store().setItem(NAV_COLLAPSED_KEY, collapsed ? '1' : '0');
  } catch {
    // private mode or quota
  }
}
