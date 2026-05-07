import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ListEmptyState } from './ListEmptyState';

describe('ListEmptyState', () => {
  it('renders title and description', () => {
    render(
      <MemoryRouter>
        <ListEmptyState
          title="Nothing here"
          description="Add items to get started."
        />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: 'Nothing here' }),
    ).toBeTruthy();
    expect(screen.getByText('Add items to get started.')).toBeTruthy();
  });

  it('invokes primary onClick', () => {
    const onClick = vi.fn();
    render(
      <MemoryRouter>
        <ListEmptyState title="T" primary={{ label: 'Go', onClick }} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders router link for primary to', () => {
    render(
      <MemoryRouter>
        <ListEmptyState title="T" primary={{ label: 'Home', to: '/' }} />
      </MemoryRouter>,
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link.getAttribute('href')).toBe('/');
  });

  it('renders external href with security attrs', () => {
    render(
      <MemoryRouter>
        <ListEmptyState
          title="T"
          secondary={{
            label: 'Outside',
            href: 'https://example.com',
          }}
        />
      </MemoryRouter>,
    );
    const a = screen.getByRole('link', { name: 'Outside' });
    expect(a.getAttribute('href')).toBe('https://example.com');
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toContain('noopener');
  });

  it('renders secondary router link', () => {
    render(
      <MemoryRouter>
        <ListEmptyState
          title="T"
          secondary={{ label: 'Albums', to: '/albums' }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Albums' }).getAttribute('href')).toBe(
      '/albums',
    );
  });
});
