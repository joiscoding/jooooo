import type { PathResult } from './types';

export interface ChargeRecord {
  idempotencyKey: string;
  amountCents: number;
  region?: string;
}

function recordsEqual(a: ChargeRecord[], b: ChargeRecord[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    if (
      x.idempotencyKey !== y.idempotencyKey ||
      x.amountCents !== y.amountCents ||
      x.region !== y.region
    ) {
      return false;
    }
  }
  return true;
}

export function describeChargeLedgerMismatch(ledger: {
  legacyCharges: ChargeRecord[];
  busCharges: ChargeRecord[];
  dualWriteConsistent(): boolean;
}): string | undefined {
  if (ledger.dualWriteConsistent()) return undefined;
  return `legacy (${ledger.legacyCharges.length}) vs bus (${ledger.busCharges.length}); sample legacy=${JSON.stringify(ledger.legacyCharges[0])} bus=${JSON.stringify(ledger.busCharges[0])}`;
}

export function createChargeLedger() {
  const legacyCharges: ChargeRecord[] = [];
  const busCharges: ChargeRecord[] = [];
  const legacyProcessed = new Set<string>();
  const busProcessed = new Set<string>();

  function appendCharge(
    target: ChargeRecord[],
    processed: Set<string>,
    idempotencyKey: string,
    amountCents: number,
    region?: string
  ): PathResult {
    if (processed.has(idempotencyKey)) {
      return { status: 'duplicate', detail: 'idempotency key already seen' };
    }
    processed.add(idempotencyKey);
    target.push({ idempotencyKey, amountCents, region });
    return { status: 'applied' };
  }

  return {
    legacyCharges,
    busCharges,
    appendLegacy(
      idempotencyKey: string,
      amountCents: number,
      region?: string
    ): PathResult {
      return appendCharge(legacyCharges, legacyProcessed, idempotencyKey, amountCents, region);
    },
    appendBus(
      idempotencyKey: string,
      amountCents: number,
      region?: string
    ): PathResult {
      return appendCharge(busCharges, busProcessed, idempotencyKey, amountCents, region);
    },
    reset() {
      legacyCharges.length = 0;
      busCharges.length = 0;
      legacyProcessed.clear();
      busProcessed.clear();
    },
    dualWriteConsistent(): boolean {
      return recordsEqual(legacyCharges, busCharges);
    },
  };
}
