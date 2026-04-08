import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ListEmptyState } from './ListEmptyState';

function wrap(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ListEmptyState', () => {
  it('renders title and description', () => {
    wrap(
      <ListEmptyState
        title="Nothing here yet"
        description="Try adding something from the gallery."
      />,
    );
    expect(screen.getByRole('heading', { name: 'Nothing here yet' })).toBeInTheDocument();
    expect(
      screen.getByText('Try adding something from the gallery.'),
    ).toBeInTheDocument();
  });

  it('renders primary link and secondary external link', () => {
    wrap(
      <ListEmptyState
        title="No matches"
        primaryAction={{ label: 'Show all', to: '/' }}
        secondaryAction={{
          label: 'How look data works',
          href: 'https://example.com/docs',
        }}
      />,
    );
    const primary = screen.getByRole('link', { name: 'Show all' });
    expect(primary).toHaveAttribute('href', '/');
    expect(primary).toHaveClass('primary');

    const secondary = screen.getByRole('link', { name: 'How look data works' });
    expect(secondary).toHaveAttribute('href', 'https://example.com/docs');
    expect(secondary).toHaveAttribute('target', '_blank');
    expect(secondary).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('calls onClick for button action', async () => {
    const onClick = vi.fn();
    wrap(
      <ListEmptyState
        title="Reset filter"
        primaryAction={{ label: 'Clear filter', onClick }}
      />,
    );
    await screen.getByRole('button', { name: 'Clear filter' }).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
