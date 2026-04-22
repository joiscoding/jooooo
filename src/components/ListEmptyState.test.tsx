import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ListEmptyState } from './ListEmptyState';

function renderWithRouter(ui: ReactElement) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={ui} />
        <Route path="/other" element={<div>other page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ListEmptyState', () => {
  it('renders title, description, and link primary action', () => {
    renderWithRouter(
      <ListEmptyState
        title="Nothing here"
        description="Add something to get started."
        primary={{ label: 'Go', to: '/other' }}
      />
    );
    expect(screen.getByRole('region', { name: /no items in this list/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument();
    expect(
      screen.getByText('Add something to get started.')
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveAttribute('href', '/other');
  });

  it('fires onClick for button primary', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    renderWithRouter(
      <ListEmptyState
        title="T"
        primary={{ label: 'Do it', onClick }}
        secondary={{ label: 'B', to: '/other' }}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Do it' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders secondary as link when provided', () => {
    renderWithRouter(
      <ListEmptyState
        title="T"
        description="D"
        primary={{ label: 'A', to: '/other' }}
        secondary={{ label: 'B', to: '/other' }}
      />
    );
    const links = screen.getAllByRole('link', { name: 'B' });
    expect(links.length).toBeGreaterThan(0);
  });
});
