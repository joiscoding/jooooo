import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY } from '../constants/navStorage';
import { Layout } from './Layout';

vi.mock('../hooks/useMediaQuery', () => ({
  useMediaQuery: () => true,
}));

describe('Layout desktop sidebar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('persists collapsed state to localStorage when toggled', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout>
          <p>Content</p>
        </Layout>
      </MemoryRouter>,
    );

    expect(screen.getByRole('complementary', { name: /site navigation/i })).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Collapse navigation' }),
    );
    expect(localStorage.getItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY)).toBe('1');

    await user.click(
      screen.getByRole('button', { name: 'Expand navigation' }),
    );
    expect(localStorage.getItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY)).toBe('0');
  });
});
