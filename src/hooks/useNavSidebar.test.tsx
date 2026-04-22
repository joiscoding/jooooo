import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useNavSidebar } from './useNavSidebar';
import { Layout } from '../components/Layout';
import { resetNavStorageForTests, setNavStorageOverride } from './navSidebarStorage';

function makeMemoryStore() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => {
      m.set(k, v);
    },
  };
}

function SpyingLayout() {
  return (
    <Layout>
      <p>Test content</p>
    </Layout>
  );
}

function HookProbe() {
  const { collapsed, setCollapsed, toggleCollapsed } = useNavSidebar();
  return (
    <div>
      <span data-testid="collapsed">{String(collapsed)}</span>
      <button type="button" onClick={toggleCollapsed}>
        toggle
      </button>
      <button type="button" onClick={() => setCollapsed(true)}>
        collapse
      </button>
    </div>
  );
}

describe('useNavSidebar', () => {
  afterEach(() => {
    resetNavStorageForTests();
  });

  it('toggles and persists in injected storage', () => {
    const s = makeMemoryStore();
    setNavStorageOverride(s);
    render(<HookProbe />);
    expect(screen.getByTestId('collapsed').textContent).toBe('false');
    act(() => {
      fireEvent.click(screen.getByText('toggle'));
    });
    expect(screen.getByTestId('collapsed').textContent).toBe('true');
    act(() => {
      fireEvent.click(screen.getByText('toggle'));
    });
    expect(screen.getByTestId('collapsed').textContent).toBe('false');
  });
});

describe('Layout sidebar (desktop width)', () => {
  afterEach(() => {
    resetNavStorageForTests();
  });

  it('sets data-collapsed on the sidebar when the toggle is used', () => {
    setNavStorageOverride(makeMemoryStore());
    const { container } = render(
      <MemoryRouter>
        <SpyingLayout />
      </MemoryRouter>
    );
    const aside = container.querySelector('.app-sidebar') as HTMLElement | null;
    expect(aside).toBeTruthy();
    expect(aside?.getAttribute('data-collapsed')).toBe('false');
    const btn = screen.getByTitle('Collapse navigation');
    act(() => {
      fireEvent.click(btn);
    });
    expect(aside?.getAttribute('data-collapsed')).toBe('true');
  });
});
