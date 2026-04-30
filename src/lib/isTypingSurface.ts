/** True when the element is a field where typing should keep keyboard focus. */
export function isTypingSurface(el: EventTarget | null): boolean {
  if (!el || !(el instanceof Element)) return false;
  const node = el.closest(
    'input, textarea, select, [contenteditable="true"]',
  );
  if (!node) return false;
  if (node instanceof HTMLInputElement) {
    const t = node.type;
    if (t === 'button' || t === 'checkbox' || t === 'radio' || t === 'submit' || t === 'reset' || t === 'file' || t === 'hidden') {
      return false;
    }
  }
  return true;
}
