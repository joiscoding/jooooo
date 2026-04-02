export type BillingBusTopic = 'billing.webhook';

type Handler = (payload: unknown) => void;

const handlers = new Map<BillingBusTopic, Set<Handler>>();

export function subscribeBillingBus(
  topic: BillingBusTopic,
  handler: Handler
): () => void {
  let set = handlers.get(topic);
  if (!set) {
    set = new Set();
    handlers.set(topic, set);
  }
  set.add(handler);
  return () => {
    set!.delete(handler);
  };
}

export function emitBillingBus(topic: BillingBusTopic, payload: unknown): void {
  const set = handlers.get(topic);
  if (!set) return;
  for (const h of set) {
    h(payload);
  }
}

/** Test helper: clear all subscribers. */
export function resetBillingBus(): void {
  handlers.clear();
}
