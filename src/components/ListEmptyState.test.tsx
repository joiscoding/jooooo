import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ListEmptyState } from './ListEmptyState';

describe('ListEmptyState', () => {
  it('renders headline, copy, and a primary link', () => {
    render(
      <MemoryRouter>
        <ListEmptyState
          title="Nothing here"
          description="Add something to get started."
          primaryAction={{ label: 'Go home', to: '/' }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument();
    expect(screen.getByText('Add something to get started.')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders primary and secondary actions with correct styles', () => {
    render(
      <MemoryRouter>
        <ListEmptyState
          title="Empty list"
          primaryAction={{ label: 'Primary', to: '/a' }}
          secondaryAction={{ label: 'Secondary', to: '/b' }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Primary' })).toHaveClass('primary');
    expect(screen.getByRole('link', { name: 'Secondary' })).toHaveClass('ghost');
  });

  it('invokes primary button onClick', () => {
    const onClick = vi.fn();
    render(
      <MemoryRouter>
        <ListEmptyState
          title="Filtered out"
          primaryAction={{ label: 'Reset', onClick }}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
