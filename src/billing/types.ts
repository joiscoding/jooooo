import type { Look } from '../types';
import type { createChargeLedger } from './chargeLedger';

/** Simulated billing webhook envelope (LB-7 demo — not production PCI data). */
export interface BillingWebhookPayload {
  idempotencyKey: string;
  type: 'charge.succeeded' | 'inventory.patch';
  /** Optional region label for runbook / dashboard-style logging. */
  region?: string;
  /** Present when type is charge.succeeded */
  amountCents?: number;
  /** Present when type is inventory.patch — upserts one look in session-backed store */
  look?: Look;
}

export type IngestMode = 'legacy-only' | 'dual-write' | 'shadow';

export interface IngestDeps {
  storageKey: string;
  getSessionItem: (key: string) => string | null;
  setSessionItem: (key: string, value: string) => void;
  ledger: ReturnType<typeof createChargeLedger>;
  /** Called after each successful inventory merge (legacy or bus) for metrics / comparer. */
  onInventorySnapshot?: (looksJson: string) => void;
}

export interface IngestResult {
  mode: IngestMode;
  legacy: PathResult;
  bus: PathResult;
  shadowMismatch?: string;
  dualWriteMismatch?: string;
}

/** Passed on the simulated event bus so consumers can apply with the same deps as the caller. */
export interface BillingBusEnvelope {
  payload: BillingWebhookPayload;
  deps: IngestDeps;
}

export interface PathResult {
  status: 'applied' | 'duplicate' | 'skipped';
  detail?: string;
}
