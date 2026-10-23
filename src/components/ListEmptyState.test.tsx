import { describe, expect, it, vi } from 'vitest';
import type { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ListEmptyState } from './ListEmptyState';

function renderEmptyState(props: ComponentProps<typeof ListEmptyState>) {
  return render(
    <MemoryRouter>
      <ListEmptyState {...props} />
    </MemoryRouter>,
  );
}

describe('ListEmptyState', () => {
  it('renders headline and description', () => {
    renderEmptyState({
      headline: 'Nothing here',
      description: 'Add something to get started.',
    });

    expect(
      screen.getByRole('heading', { name: 'Nothing here' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Add something to get started.')).toBeInTheDocument();
  });

  it('renders link primary action', () => {
    renderEmptyState({
      headline: 'Empty',
      primaryAction: { label: 'Go home', href: '/' },
    });

    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('handles button primary action click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderEmptyState({
      headline: 'Empty',
      primaryAction: { label: 'Create', onClick },
    });

    await user.click(screen.getByRole('button', { name: 'Create' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
