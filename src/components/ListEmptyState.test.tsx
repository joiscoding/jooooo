import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ListEmptyState } from './ListEmptyState';

function renderEmptyState(
  props: ComponentProps<typeof ListEmptyState>,
) {
  return render(
    <MemoryRouter>
      <ListEmptyState {...props} />
    </MemoryRouter>,
  );
}

describe('ListEmptyState', () => {
  it('renders headline and description', () => {
    renderEmptyState({
      headline: 'Nothing here yet',
      description: 'Add your first item to get started.',
      primaryAction: { label: 'Create', onClick: () => {} },
    });

    expect(screen.getByRole('heading', { name: 'Nothing here yet' })).toBeInTheDocument();
    expect(screen.getByText('Add your first item to get started.')).toBeInTheDocument();
  });

  it('calls primary onClick when the primary button is pressed', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();

    renderEmptyState({
      headline: 'No albums',
      description: 'Create one to save looks.',
      primaryAction: { label: 'Create album', onClick: onCreate },
    });

    await user.click(screen.getByRole('button', { name: 'Create album' }));
    expect(onCreate).toHaveBeenCalledOnce();
  });

  it('renders a link for href actions and optional secondary action', () => {
    renderEmptyState({
      headline: 'Empty album',
      description: 'Browse the gallery to add looks.',
      primaryAction: { label: 'Browse gallery', href: '/' },
      secondaryAction: { label: 'All albums', href: '/albums' },
    });

    expect(screen.getByRole('link', { name: 'Browse gallery' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByRole('link', { name: 'All albums' })).toHaveAttribute(
      'href',
      '/albums',
    );
  });
});
