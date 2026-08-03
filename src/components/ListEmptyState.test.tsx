import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
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
    expect(
      screen.getByRole('heading', { name: 'Nothing here' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Add something to get started.'),
    ).toBeInTheDocument();
  });

  it('renders primary link action', () => {
    renderWithRouter(
      <ListEmptyState
        title="Empty list"
        primaryAction={{ kind: 'link', to: '/foo', label: 'Go there' }}
      />,
    );
    const link = screen.getByRole('link', { name: 'Go there' });
    expect(link).toHaveAttribute('href', '/foo');
  });

  it('renders external link with security attributes', () => {
    renderWithRouter(
      <ListEmptyState
        title="Learn more"
        primaryAction={{
          kind: 'external',
          href: 'https://example.com/help',
          label: 'Docs',
        }}
      />,
    );
    const a = screen.getByRole('link', { name: 'Docs' });
    expect(a).toHaveAttribute('href', 'https://example.com/help');
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('invokes primary button on click', () => {
    const onClick = vi.fn();
    renderWithRouter(
      <ListEmptyState
        title="Do thing"
        primaryAction={{ kind: 'button', label: 'Tap me', onClick }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Tap me' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders secondary ghost action alongside primary', () => {
    renderWithRouter(
      <ListEmptyState
        title="Both"
        primaryAction={{ kind: 'link', to: '/a', label: 'Primary' }}
        secondaryAction={{ kind: 'link', to: '/b', label: 'Secondary' }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Primary' })).toHaveClass(
      'primary',
    );
    expect(screen.getByRole('link', { name: 'Secondary' })).toHaveClass(
      'ghost',
    );
  });
});
