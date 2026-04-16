import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ListEmptyState } from './ListEmptyState';

describe('ListEmptyState', () => {
  it('renders title and description', () => {
    render(
      <ListEmptyState
        title="Nothing here yet"
        description="Add something to get started."
      />,
    );
    expect(screen.getByRole('heading', { name: 'Nothing here yet' })).toBeInTheDocument();
    expect(
      screen.getByText('Add something to get started.'),
    ).toBeInTheDocument();
  });

  it('renders optional actions', () => {
    render(
      <ListEmptyState title="Empty" description="Desc">
        <button type="button">Primary</button>
      </ListEmptyState>,
    );
    expect(screen.getByRole('button', { name: 'Primary' })).toBeInTheDocument();
  });
});
