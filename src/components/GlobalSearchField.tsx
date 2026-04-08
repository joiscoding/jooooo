import { useEffect, useState } from 'react';
import { useSearchContext } from '../context/SearchContext';
import { isCommandKShortcut } from '../utils/isCommandKShortcut';

function shortcutHintLabel(): string {
  if (typeof navigator === 'undefined') return 'Ctrl+K';
  const p = navigator.platform ?? '';
  if (/Mac|iPhone|iPad|iPod/.test(p)) return '⌘K';
  return 'Ctrl+K';
}

export function GlobalSearchField() {
  const { query, setQuery, inputRef, focusSearch, globalSearchInputId } =
    useSearchContext();
  const [hint, setHint] = useState(shortcutHintLabel);

  useEffect(() => {
    setHint(shortcutHintLabel());
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!isCommandKShortcut(event, globalSearchInputId)) return;
      event.preventDefault();
      focusSearch();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusSearch, globalSearchInputId]);

  return (
    <div className="global-search-wrap">
      <label htmlFor={globalSearchInputId} className="visually-hidden">
        Search looks
      </label>
      <input
        ref={inputRef}
        id={globalSearchInputId}
        type="search"
        className="global-search-input"
        placeholder="Search looks…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        aria-describedby={`${globalSearchInputId}-shortcut-hint`}
        enterKeyHint="search"
      />
      <span
        id={`${globalSearchInputId}-shortcut-hint`}
        className="global-search-kbd-hint"
        aria-hidden="true"
      >
        {hint}
      </span>
    </div>
  );
}
