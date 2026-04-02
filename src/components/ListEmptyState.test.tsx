import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ListEmptyState } from './ListEmptyState';

function wrap(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ListEmptyState', () => {
  it('renders title, body, and primary link when action uses to', () => {
    wrap(
      <ListEmptyState
        title="Nothing here"
        body="Add something to get started."
        primaryAction={{ label: 'Go home', to: '/' }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument();
    expect(screen.getByText('Add something to get started.')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('calls onClick for a button primary action', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    wrap(
      <ListEmptyState
        title="Empty"
        body="Try the action below."
        primaryAction={{ label: 'Focus field', onClick }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Focus field' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders secondary action when provided', () => {
    wrap(
      <ListEmptyState
        title="Filtered out"
        body="Reset to see more."
        primaryAction={{ label: 'Reset', onClick: () => {} }}
        secondaryAction={{ label: 'Learn more', href: 'https://example.com' }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Learn more' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });
});
