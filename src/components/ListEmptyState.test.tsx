import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ListEmptyState } from './ListEmptyState';

describe('ListEmptyState', () => {
  it('renders title and description', () => {
    render(
      <MemoryRouter>
        <ListEmptyState
          title="Nothing here"
          description="Add something to get started."
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument();
    expect(
      screen.getByText('Add something to get started.')
    ).toBeInTheDocument();
  });

  it('renders link and button actions', () => {
    const onPrimary = vi.fn();
    render(
      <MemoryRouter>
        <ListEmptyState
          title="Empty"
          primaryAction={{ label: 'Do thing', onClick: onPrimary }}
          secondaryAction={{ label: 'Go home', to: '/', variant: 'ghost' }}
        />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Do thing' }));
    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
