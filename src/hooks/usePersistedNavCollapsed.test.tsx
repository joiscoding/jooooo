import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePersistedNavCollapsed } from './usePersistedNavCollapsed';
import {
  LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY,
  readNavCollapsed,
} from '../lib/navCollapsedStorage';

afterEach(() => {
  cleanup();
});

function Probe() {
  const { collapsed, toggle } = usePersistedNavCollapsed();
  return (
    <div>
      <span data-testid="state">{collapsed ? 'collapsed' : 'expanded'}</span>
      <button type="button" onClick={toggle}>
        toggle
      </button>
    </div>
  );
}

describe('usePersistedNavCollapsed', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes from localStorage', () => {
    localStorage.setItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY, '1');
    render(<Probe />);
    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
  });

  it('toggle updates state and storage', async () => {
    const user = userEvent.setup();
    render(<Probe />);
    expect(screen.getByTestId('state')).toHaveTextContent('expanded');
    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('state')).toHaveTextContent('collapsed');
    expect(readNavCollapsed(localStorage)).toBe(true);
    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('state')).toHaveTextContent('expanded');
    expect(readNavCollapsed(localStorage)).toBe(false);
  });
});
