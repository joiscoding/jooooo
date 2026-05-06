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
  it('renders title and description', () => {
    wrap(
      <ListEmptyState
        title="Nothing here"
        description="Try something else."
      />,
    );
    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument();
    expect(screen.getByText('Try something else.')).toBeInTheDocument();
  });

  it('renders internal link primary action', () => {
    wrap(
      <ListEmptyState
        title="Empty"
        description="Desc"
        primaryAction={{ label: 'Go home', href: '/' }}
      />,
    );
    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders external link with rel', () => {
    wrap(
      <ListEmptyState
        title="Empty"
        description="Desc"
        primaryAction={{ label: 'Learn', href: 'https://example.com/doc' }}
      />,
    );
    const link = screen.getByRole('link', { name: 'Learn' });
    expect(link).toHaveAttribute('href', 'https://example.com/doc');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('invokes onClick for button primary', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    wrap(
      <ListEmptyState
        title="Empty"
        description="Desc"
        primaryAction={{ label: 'Do it', onClick }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Do it' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders secondary action', () => {
    wrap(
      <ListEmptyState
        title="Empty"
        description="Desc"
        primaryAction={{ label: 'First', href: '/a' }}
        secondaryAction={{ label: 'Second', href: '/b' }}
      />,
    );
    expect(screen.getByRole('link', { name: 'First' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Second' })).toBeInTheDocument();
  });
});
