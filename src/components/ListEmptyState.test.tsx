import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ListEmptyState } from './ListEmptyState';

describe('ListEmptyState', () => {
  it('renders title and optional description', () => {
    render(
      <MemoryRouter>
        <ListEmptyState
          title="Nothing here"
          description="Try something else."
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument();
    expect(screen.getByText('Try something else.')).toBeInTheDocument();
  });

  it('renders a primary link action', () => {
    render(
      <MemoryRouter>
        <ListEmptyState
          title="Empty"
          primaryAction={{ type: 'link', label: 'Go home', to: '/' }}
        />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders an external link with security attributes', () => {
    render(
      <MemoryRouter>
        <ListEmptyState
          title="Outside"
          primaryAction={{
            type: 'external',
            label: 'Open site',
            href: 'https://example.com',
          }}
        />
      </MemoryRouter>,
    );

    const a = screen.getByRole('link', { name: 'Open site' });
    expect(a).toHaveAttribute('href', 'https://example.com');
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders primary and secondary actions and invokes button handlers', async () => {
    const user = userEvent.setup();
    const onPrimary = vi.fn();

    render(
      <MemoryRouter>
        <ListEmptyState
          title="Pick next step"
          primaryAction={{
            type: 'button',
            label: 'Primary',
            onClick: onPrimary,
          }}
          secondaryAction={{
            type: 'link',
            label: 'Secondary',
            to: '/albums',
          }}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Primary' }));
    expect(onPrimary).toHaveBeenCalledTimes(1);

    expect(screen.getByRole('link', { name: 'Secondary' })).toHaveAttribute(
      'href',
      '/albums',
    );
  });
});
