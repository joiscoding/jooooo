import { createChargeLedger } from './chargeLedger';
import type { IngestDeps } from './types';

export function createBillingDeps(
  overrides: Partial<Pick<IngestDeps, 'storageKey' | 'onInventorySnapshot'>> & {
    getSessionItem?: IngestDeps['getSessionItem'];
    setSessionItem?: IngestDeps['setSessionItem'];
    ledger?: IngestDeps['ledger'];
  } = {}
): IngestDeps {
  const storageKey = overrides.storageKey ?? 'lookbook_mcp_looks_v13';
  return {
    storageKey,
    getSessionItem:
      overrides.getSessionItem ??
      ((key) => {
        try {
          return sessionStorage.getItem(key);
        } catch {
          return null;
        }
      }),
    setSessionItem:
      overrides.setSessionItem ??
      ((key, value) => {
        try {
          sessionStorage.setItem(key, value);
        } catch {
          // ignore quota / private mode
        }
      }),
    ledger: overrides.ledger ?? createChargeLedger(),
    onInventorySnapshot: overrides.onInventorySnapshot,
  };
}
