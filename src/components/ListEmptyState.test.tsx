import { describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ListEmptyState } from './ListEmptyState';

function renderWithRouter(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ListEmptyState', () => {
  it('renders title and description', () => {
    renderWithRouter(
      <ListEmptyState
        title="Nothing here"
        description="Add something to get started."
      />,
    );
    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument();
    expect(
      screen.getByText('Add something to get started.'),
    ).toBeInTheDocument();
  });

  it('renders primary link CTA', () => {
    renderWithRouter(
      <ListEmptyState
        title="Empty"
        description="Desc"
        primary={{ kind: 'link', to: '/foo', label: 'Go' }}
      />,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveAttribute('href', '/foo');
  });

  it('renders primary button and calls onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithRouter(
      <ListEmptyState
        title="Empty"
        description="Desc"
        primary={{ kind: 'button', label: 'Act', onClick }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Act' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders primary and secondary actions', () => {
    renderWithRouter(
      <ListEmptyState
        title="T"
        description="D"
        primary={{ kind: 'link', to: '/a', label: 'First' }}
        secondary={{ kind: 'link', to: '/b', label: 'Second' }}
      />,
    );
    expect(screen.getByRole('link', { name: 'First' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Second' })).toBeInTheDocument();
  });
});
