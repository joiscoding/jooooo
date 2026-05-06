import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY } from '../lib/navCollapsedStorage';

afterEach(() => {
  cleanup();
});

describe('Layout sidebar persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('applies collapsed class from localStorage and persists on toggle', async () => {
    localStorage.setItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY, '1');
    const user = userEvent.setup();
    const { container } = render(
      <BrowserRouter>
        <Layout>
          <p>content</p>
        </Layout>
      </BrowserRouter>,
    );

    const layout = container.querySelector('.layout');
    expect(layout).toHaveClass('layout--nav-collapsed');

    await user.click(
      screen.getByRole('button', { name: 'Expand navigation' }),
    );
    expect(layout).not.toHaveClass('layout--nav-collapsed');
    expect(localStorage.getItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY)).toBe(
      '0',
    );
  });
});
