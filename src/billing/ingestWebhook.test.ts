import { describe, expect, it, beforeEach } from 'vitest';
import { createChargeLedger } from './chargeLedger';
import { ingestWebhook } from './ingestWebhook';
import { resetBillingBus } from './eventBus';
import type { IngestDeps } from './types';
import type { Look } from '../types';

const demoLook: Look = {
  id: 'test-look-1',
  title: 'Test',
  tag: 'minimal',
  season: 'S',
  occasion: 'O',
  keyItems: ['a'],
  hero: '/x.jpg',
  gallery: ['/x.jpg'],
};

function makeMemoryDeps(): { deps: IngestDeps; store: Map<string, string> } {
  const store = new Map<string, string>();
  const ledger = createChargeLedger();
  const deps: IngestDeps = {
    storageKey: 'test_looks',
    getSessionItem: (k) => store.get(k) ?? null,
    setSessionItem: (k, v) => {
      store.set(k, v);
    },
    ledger,
  };
  return { deps, store };
}

beforeEach(() => {
  resetBillingBus();
});

describe('ingestWebhook charges', () => {
  it('legacy-only records only on legacy path', () => {
    const { deps } = makeMemoryDeps();
    const r = ingestWebhook(
      {
        idempotencyKey: 'k1',
        type: 'charge.succeeded',
        amountCents: 100,
        region: 'eu',
      },
      'legacy-only',
      deps
    );
    expect(r.legacy.status).toBe('applied');
    expect(r.bus.status).toBe('skipped');
    expect(deps.ledger.legacyCharges).toHaveLength(1);
    expect(deps.ledger.busCharges).toHaveLength(0);
  });

  it('deduplicates charge by idempotency key', () => {
    const { deps } = makeMemoryDeps();
    const p = {
      idempotencyKey: 'dup',
      type: 'charge.succeeded' as const,
      amountCents: 50,
    };
    ingestWebhook(p, 'legacy-only', deps);
    const r2 = ingestWebhook(p, 'legacy-only', deps);
    expect(r2.legacy.status).toBe('duplicate');
    expect(deps.ledger.legacyCharges).toHaveLength(1);
  });

  it('dual-write keeps ledgers aligned', () => {
    const { deps } = makeMemoryDeps();
    const r = ingestWebhook(
      {
        idempotencyKey: 'dw',
        type: 'charge.succeeded',
        amountCents: 200,
      },
      'dual-write',
      deps
    );
    expect(r.legacy.status).toBe('applied');
    expect(r.bus.status).toBe('applied');
    expect(r.dualWriteMismatch).toBeUndefined();
    expect(deps.ledger.dualWriteConsistent()).toBe(true);
  });

  it('shadow mode surfaces status mismatch when paths diverge (simulated)', () => {
    const store = new Map<string, string>();
    const ledger = createChargeLedger();
    const deps: IngestDeps = {
      storageKey: 'k',
      getSessionItem: (key) => store.get(key) ?? null,
      setSessionItem: (key, v) => store.set(key, v),
      ledger: {
        ...ledger,
        appendBus: () => ({ status: 'skipped' as const, detail: 'injected' }),
      },
    };
    const r = ingestWebhook(
      { idempotencyKey: 'm', type: 'charge.succeeded', amountCents: 1 },
      'shadow',
      deps
    );
    expect(r.shadowMismatch).toContain('legacy=applied');
  });
});

describe('ingestWebhook inventory', () => {
  it('merges look into session JSON via legacy in legacy-only', () => {
    const { deps, store } = makeMemoryDeps();
    const r = ingestWebhook(
      {
        idempotencyKey: 'inv1',
        type: 'inventory.patch',
        look: demoLook,
      },
      'legacy-only',
      deps
    );
    expect(r.legacy.status).toBe('applied');
    expect(r.bus.status).toBe('skipped');
    const raw = store.get('test_looks');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!) as Look[];
    expect(parsed.some((l) => l.id === 'test-look-1')).toBe(true);
  });

  it('dual-write runs bus consumer without corrupting session JSON', () => {
    const { deps, store } = makeMemoryDeps();
    const r = ingestWebhook(
      {
        idempotencyKey: 'inv2',
        type: 'inventory.patch',
        look: demoLook,
      },
      'dual-write',
      deps
    );
    expect(r.shadowMismatch).toBeUndefined();
    const raw = store.get('test_looks');
    const parsed = JSON.parse(raw!) as Look[];
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe('test-look-1');
  });
});
