import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ListEmptyState } from './ListEmptyState';

describe('ListEmptyState', () => {
  it('renders title and description', () => {
    render(
      <MemoryRouter>
        <ListEmptyState
          title="Nothing here"
          description="Add something to get started."
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument();
    expect(screen.getByText('Add something to get started.')).toBeInTheDocument();
  });

  it('renders primary Link and secondary actions', () => {
    render(
      <MemoryRouter>
        <ListEmptyState
          title="Empty list"
          primaryAction={{ label: 'Go home', to: '/' }}
          secondaryAction={{ label: 'Docs', href: 'https://example.com/docs' }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'href',
      'https://example.com/docs',
    );
  });

  it('invokes onClick for button primary action', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <MemoryRouter>
        <ListEmptyState
          title="Reset"
          primaryAction={{ label: 'Reload data', onClick }}
        />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: 'Reload data' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
