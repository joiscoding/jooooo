import type { ReactElement } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ListEmptyState } from './ListEmptyState';

function renderWithRouter(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ListEmptyState', () => {
  it('renders title and optional description', () => {
    renderWithRouter(
      <ListEmptyState
        title="Nothing here yet"
        description="Add items to get started."
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Nothing here yet' })).toBeInTheDocument();
    expect(screen.getByText('Add items to get started.')).toBeInTheDocument();
  });

  it('renders a route primary action', () => {
    renderWithRouter(
      <ListEmptyState
        title="Empty"
        primaryAction={{ action: 'route', label: 'Go home', to: '/' }}
      />,
    );
    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveClass('btn', 'primary');
  });

  it('renders secondary action as ghost link', () => {
    renderWithRouter(
      <ListEmptyState
        title="Empty"
        secondaryAction={{ action: 'route', label: 'Learn more', to: '/albums' }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Learn more' })).toHaveClass('btn', 'ghost');
  });

  it('invokes button primary action', () => {
    const onClick = vi.fn();
    renderWithRouter(
      <ListEmptyState
        title="Filtered out"
        primaryAction={{ action: 'button', label: 'Reset', onClick }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders anchor action for in-page targets', () => {
    renderWithRouter(
      <ListEmptyState
        title="No albums"
        primaryAction={{
          action: 'anchor',
          label: 'Jump to form',
          fragmentId: 'album-name-input',
        }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Jump to form' })).toHaveAttribute(
      'href',
      '#album-name-input',
    );
  });
});
