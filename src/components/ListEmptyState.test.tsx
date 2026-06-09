import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ListEmptyState } from './ListEmptyState';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ListEmptyState', () => {
  it('renders headline and description', () => {
    renderWithRouter(
      <ListEmptyState
        headline="No albums yet"
        description="Create your first album to get started."
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'No albums yet' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Create your first album to get started.'),
    ).toBeInTheDocument();
  });

  it('renders primary button action and calls onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderWithRouter(
      <ListEmptyState
        headline="Empty"
        primaryAction={{ label: 'Create first album', onClick }}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Create first album' }),
    );
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders link actions for navigation CTAs', () => {
    renderWithRouter(
      <ListEmptyState
        headline="Empty album"
        primaryAction={{ label: 'Browse gallery', href: '/' }}
        secondaryAction={{
          label: 'View albums',
          href: '/albums',
          variant: 'ghost',
        }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Browse gallery' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByRole('link', { name: 'View albums' })).toHaveAttribute(
      'href',
      '/albums',
    );
  });

  it('exposes status role for screen readers', () => {
    renderWithRouter(<ListEmptyState headline="Nothing here" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
