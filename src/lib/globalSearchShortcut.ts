/**
 * True when the key event should focus the app global search (⌘/Ctrl+K).
 * Skips editable fields so typing shortcuts are not stolen; allows the
 * global search input itself so the shortcut can refocus/select-all.
 */
export function isGlobalSearchFocusShortcut(event: KeyboardEvent): boolean {
  if (event.defaultPrevented) return false;
  if (event.repeat) return false;
  if (event.key !== 'k' && event.key !== 'K') return false;
  const mod = event.metaKey || event.ctrlKey;
  if (!mod) return false;
  if (event.altKey || event.shiftKey) return false;
  const target = event.target;
  if (!target || !(target instanceof Node)) return true;
  return !isTextEditingTarget(target);
}

function isTextEditingTarget(node: Node): boolean {
  const el = node instanceof Element ? node : node.parentElement;
  if (!el) return false;
  const host = el.closest('[data-global-search="true"]');
  if (host) return false;

  const active = el as HTMLElement;
  if (active.isContentEditable) return true;

  const tag = active.tagName;
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (tag !== 'INPUT') return false;

  const type = (active as HTMLInputElement).type?.toLowerCase() ?? 'text';
  const nonText = new Set([
    'hidden',
    'checkbox',
    'radio',
    'file',
    'button',
    'submit',
    'reset',
    'image',
    'range',
    'color',
  ]);
  return !nonText.has(type);
}
