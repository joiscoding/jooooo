import type { Look } from '../types';
import type {
  BillingBusEnvelope,
  BillingWebhookPayload,
  IngestDeps,
  IngestMode,
  IngestResult,
  PathResult,
} from './types';
import { describeChargeLedgerMismatch } from './chargeLedger';
import { emitBillingBus, subscribeBillingBus } from './eventBus';

export const BILLING_BUS_TOPIC = 'billing.webhook' as const;

function mergeLookIntoLooksJson(
  currentJson: string | null,
  look: Look
): { next: string; changed: boolean } {
  let list: Look[] = [];
  try {
    if (currentJson) {
      const parsed = JSON.parse(currentJson) as unknown;
      if (Array.isArray(parsed)) list = parsed as Look[];
    }
  } catch {
    list = [];
  }
  const idx = list.findIndex((l) => l.id === look.id);
  const prev = idx >= 0 ? JSON.stringify(list[idx]) : null;
  if (idx >= 0) {
    list[idx] = look;
  } else {
    list = [...list, look];
  }
  const next = JSON.stringify(list);
  const changed = prev !== JSON.stringify(look);
  return { next, changed };
}

function applyInventoryPatch(deps: IngestDeps, look: Look): PathResult {
  const raw = deps.getSessionItem(deps.storageKey);
  const { next, changed } = mergeLookIntoLooksJson(raw, look);
  deps.setSessionItem(deps.storageKey, next);
  deps.onInventorySnapshot?.(next);
  return changed
    ? { status: 'applied', detail: `look ${look.id} upserted` }
    : { status: 'applied', detail: `look ${look.id} unchanged (no-op upsert)` };
}

function ingestCharge(
  deps: IngestDeps,
  mode: IngestMode,
  payload: BillingWebhookPayload
): {
  legacy: PathResult;
  bus: PathResult;
  shadowMismatch?: string;
  dualWriteMismatch?: string;
} {
  const amount = payload.amountCents ?? 0;
  const key = payload.idempotencyKey;
  const region = payload.region;

  let legacy: PathResult = { status: 'skipped', detail: 'no charge path' };
  let bus: PathResult = { status: 'skipped', detail: 'no charge path' };
  let shadowMismatch: string | undefined;
  let dualWriteMismatch: string | undefined;

  if (mode === 'legacy-only') {
    legacy = deps.ledger.appendLegacy(key, amount, region);
    bus = { status: 'skipped', detail: 'event bus path disabled' };
    return { legacy, bus };
  }

  if (mode === 'dual-write') {
    legacy = deps.ledger.appendLegacy(key, amount, region);
    bus = deps.ledger.appendBus(key, amount, region);
    dualWriteMismatch = describeChargeLedgerMismatch(deps.ledger);
    return { legacy, bus, dualWriteMismatch };
  }

  legacy = deps.ledger.appendLegacy(key, amount, region);
  bus = deps.ledger.appendBus(key, amount, region);
  if (legacy.status !== bus.status) {
    shadowMismatch = `status legacy=${legacy.status} bus=${bus.status}`;
  } else if (
    legacy.status === 'applied' &&
    deps.ledger.legacyCharges.length !== deps.ledger.busCharges.length
  ) {
    shadowMismatch = 'ledger length mismatch after apply';
  }
  return { legacy, bus, shadowMismatch };
}

function runBusInventoryConsumerOnce(
  envelope: BillingBusEnvelope
): PathResult {
  const { payload, deps } = envelope;
  if (payload.type !== 'inventory.patch' || !payload.look) {
    return { status: 'skipped', detail: 'not an inventory patch' };
  }
  return applyInventoryPatch(deps, payload.look);
}

/**
 * Simulates LB-7 migration paths: legacy direct apply vs shared bus consumer.
 * Charge events update an in-memory ledger; inventory events merge into session-backed looks.
 */
export function ingestWebhook(
  payload: BillingWebhookPayload,
  mode: IngestMode,
  deps: IngestDeps
): IngestResult {
  if (payload.type === 'charge.succeeded') {
    const r = ingestCharge(deps, mode, payload);
    return {
      mode,
      legacy: r.legacy,
      bus: r.bus,
      shadowMismatch: r.shadowMismatch,
      dualWriteMismatch: r.dualWriteMismatch,
    };
  }

  if (!payload.look) {
    const err = { status: 'skipped' as const, detail: 'missing look payload' };
    return { mode, legacy: err, bus: err };
  }
  const look = payload.look;

  if (mode === 'legacy-only') {
    const legacy = applyInventoryPatch(deps, look);
    return {
      mode,
      legacy,
      bus: { status: 'skipped', detail: 'event bus path disabled' },
    };
  }

  if (mode === 'dual-write') {
    const legacy = applyInventoryPatch(deps, look);
    const unsub = subscribeBillingBus(BILLING_BUS_TOPIC, (raw) => {
      runBusInventoryConsumerOnce(raw as BillingBusEnvelope);
    });
    emitBillingBus(BILLING_BUS_TOPIC, { payload, deps } satisfies BillingBusEnvelope);
    unsub();
    const bus: PathResult = { status: 'applied', detail: 'bus consumer applied inventory' };
    return { mode, legacy, bus };
  }

  const legacy = applyInventoryPatch(deps, look);
  const snapshotAfterLegacy = deps.getSessionItem(deps.storageKey);
  const unsub = subscribeBillingBus(BILLING_BUS_TOPIC, (raw) => {
    runBusInventoryConsumerOnce(raw as BillingBusEnvelope);
  });
  emitBillingBus(BILLING_BUS_TOPIC, { payload, deps } satisfies BillingBusEnvelope);
  unsub();
  const snapshotAfterBus = deps.getSessionItem(deps.storageKey);
  const shadowMismatch =
    snapshotAfterLegacy !== snapshotAfterBus
      ? 'session JSON differed after legacy vs bus consumer (unexpected)'
      : undefined;
  return {
    mode,
    legacy,
    bus: { status: 'applied', detail: 'shadow bus consumer applied inventory' },
    shadowMismatch,
  };
}
