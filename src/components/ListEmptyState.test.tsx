import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ListEmptyState } from './ListEmptyState';

function wrap(ui: ReactElement, initial = '/') {
  return <MemoryRouter initialEntries={[initial]}>{ui}</MemoryRouter>;
}

describe('ListEmptyState', () => {
  it('renders title and description', () => {
    render(
      wrap(
        <ListEmptyState
          title="Nothing here"
          description="Add items to get started."
        />,
      ),
    );
    expect(
      screen.getByRole('heading', { level: 2, name: 'Nothing here' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Add items to get started.')).toBeInTheDocument();
  });

  it('exposes a landmark labelled by the title', () => {
    render(wrap(<ListEmptyState title="Empty list" />));
    const region = screen.getByRole('region', { name: 'Empty list' });
    expect(region).toBeInTheDocument();
  });

  it('renders a router link as primary action', () => {
    render(
      wrap(
        <Routes>
          <Route
            path="/"
            element={
              <ListEmptyState
                title="Empty"
                primaryAction={{ type: 'router', to: '/albums', label: 'Go' }}
              />
            }
          />
        </Routes>,
      ),
    );
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveAttribute('href', '/albums');
  });

  it('invokes button primary action', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      wrap(
        <ListEmptyState
          title="Empty"
          primaryAction={{ type: 'button', onClick, label: 'Do it' }}
        />,
      ),
    );
    await user.click(screen.getByRole('button', { name: 'Do it' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders secondary ghost link', () => {
    render(
      wrap(
        <ListEmptyState
          title="Empty"
          primaryAction={{ type: 'router', to: '/', label: 'Main' }}
          secondaryAction={{
            type: 'router',
            to: '/albums',
            label: 'More',
            variant: 'ghost',
          }}
        />,
      ),
    );
    expect(screen.getByRole('link', { name: 'More' })).toHaveClass('ghost');
  });
});
