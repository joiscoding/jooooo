import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ListEmptyState } from './ListEmptyState';

function wrap(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ListEmptyState', () => {
  it('renders title, body, and primary link', () => {
    wrap(
      <ListEmptyState
        title="Nothing here"
        body="Add something to get started."
        primary={{ kind: 'link', label: 'Go home', to: '/' }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument();
    expect(screen.getByText('Add something to get started.')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('invokes primary button on click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    wrap(
      <ListEmptyState
        title="Empty"
        body="Tap below."
        primary={{ kind: 'button', label: 'Do it', onClick }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Do it' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders secondary action when provided', () => {
    wrap(
      <ListEmptyState
        title="T"
        body="B"
        primary={{ kind: 'link', label: 'First', to: '/a' }}
        secondary={{ kind: 'link', label: 'Second', to: '/b' }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Second' })).toHaveAttribute(
      'href',
      '/b',
    );
  });
});
