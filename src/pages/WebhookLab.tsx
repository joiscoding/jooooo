import { useCallback, useMemo, useState } from 'react';
import type { IngestMode, IngestResult } from '../billing/types';
import { createBillingDeps } from '../billing/createBillingDeps';
import { ingestWebhook } from '../billing/ingestWebhook';
import { createChargeLedger } from '../billing/chargeLedger';
import { LOOKBOOK_LOOKS_SESSION_KEY } from '../data/fetchLooks';

const SAMPLE_CHARGE = `{
  "idempotencyKey": "evt_demo_001",
  "type": "charge.succeeded",
  "region": "us-west",
  "amountCents": 1299
}`;

const SAMPLE_INVENTORY = `{
  "idempotencyKey": "inv_demo_001",
  "type": "inventory.patch",
  "region": "us-west",
  "look": {
    "id": "webhook-lab-look",
    "title": "Webhook Lab (demo look)",
    "tag": "minimal",
    "season": "Demo",
    "occasion": "Integration",
    "keyItems": ["Event bus", "Idempotency"],
    "hero": "/looks/minimal-quiet-01-v2.jpg",
    "gallery": ["/looks/minimal-quiet-01-v2.jpg"]
  }
}`;

export function WebhookLab() {
  const [mode, setMode] = useState<IngestMode>('shadow');
  const [payloadText, setPayloadText] = useState(SAMPLE_INVENTORY);
  const [result, setResult] = useState<IngestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const storageKey = LOOKBOOK_LOOKS_SESSION_KEY;

  const run = useCallback(() => {
    setError(null);
    setResult(null);
    try {
      const parsed = JSON.parse(payloadText) as unknown;
      if (typeof parsed !== 'object' || parsed === null || !('idempotencyKey' in parsed)) {
        setError('Payload must be a JSON object with idempotencyKey.');
        return;
      }
      const deps = createBillingDeps({
        storageKey,
        ledger: createChargeLedger(),
      });
      const r = ingestWebhook(
        parsed as Parameters<typeof ingestWebhook>[0],
        mode,
        deps
      );
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  }, [mode, payloadText, storageKey]);

  const clearSessionLooks = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setResult(null);
    setError(null);
  }, [storageKey]);

  const modeHelp = useMemo(
    () =>
      ({
        'legacy-only': 'Only the legacy path runs (Sidekiq-style direct apply).',
        'dual-write': 'Legacy and bus paths both record charges; inventory runs legacy merge then bus consumer.',
        shadow:
          'Both paths run; comparer surfaces mismatches (duplicate charges, divergent session JSON).',
      } satisfies Record<IngestMode, string>),
    []
  );

  return (
    <div className="webhook-lab">
      <header className="webhook-lab-header">
        <p className="eyebrow">LB-7 demo · Integration lab</p>
        <h1 className="webhook-lab-title">Billing webhook migration</h1>
        <p className="webhook-lab-lede muted">
          Client-side simulation of event bus ingestion, idempotency, and dual-write /
          shadow comparison. Inventory patches merge into the same session key the gallery
          uses—reload the gallery to see injected looks.
        </p>
      </header>

      <section className="webhook-lab-panel" aria-label="Ingestion controls">
        <div className="webhook-lab-field">
          <span className="webhook-lab-label">Mode</span>
          <div className="webhook-lab-modes">
            {(['legacy-only', 'dual-write', 'shadow'] as const).map((m) => (
              <label key={m} className="webhook-lab-radio">
                <input
                  type="radio"
                  name="ingest-mode"
                  value={m}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                />
                <span>{m}</span>
              </label>
            ))}
          </div>
          <p className="webhook-lab-hint muted">{modeHelp[mode]}</p>
        </div>

        <div className="webhook-lab-field">
          <div className="webhook-lab-toolbar">
            <span className="webhook-lab-label">Payload (JSON)</span>
            <div className="webhook-lab-presets">
              <button
                type="button"
                className="btn ghost"
                onClick={() => setPayloadText(SAMPLE_CHARGE)}
              >
                Load charge sample
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setPayloadText(SAMPLE_INVENTORY)}
              >
                Load inventory sample
              </button>
            </div>
          </div>
          <textarea
            className="webhook-lab-textarea"
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
            spellCheck={false}
            rows={14}
            aria-label="Webhook JSON payload"
          />
        </div>

        <div className="webhook-lab-actions">
          <button type="button" className="btn primary" onClick={run}>
            Ingest webhook
          </button>
          <button type="button" className="btn ghost" onClick={clearSessionLooks}>
            Clear session looks override
          </button>
        </div>
      </section>

      {error ? (
        <p className="webhook-lab-error" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <section className="webhook-lab-result" aria-label="Ingest result">
          <h2 className="webhook-lab-result-title">Result</h2>
          <dl className="webhook-lab-dl">
            <dt>Mode</dt>
            <dd>{result.mode}</dd>
            <dt>Legacy</dt>
            <dd>
              {result.legacy.status}
              {result.legacy.detail ? ` — ${result.legacy.detail}` : ''}
            </dd>
            <dt>Bus</dt>
            <dd>
              {result.bus.status}
              {result.bus.detail ? ` — ${result.bus.detail}` : ''}
            </dd>
            {result.shadowMismatch ? (
              <>
                <dt>Shadow mismatch</dt>
                <dd className="webhook-lab-warn">{result.shadowMismatch}</dd>
              </>
            ) : null}
            {result.dualWriteMismatch ? (
              <>
                <dt>Dual-write mismatch</dt>
                <dd className="webhook-lab-warn">{result.dualWriteMismatch}</dd>
              </>
            ) : null}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
