import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SearchProvider } from '../context/SearchContext';
import { Layout } from './Layout';
import { HomeGallery } from '../pages/HomeGallery';

vi.mock('../data/fetchLooks', () => ({
  fetchLooks: vi.fn(async () => [
    {
      id: '1',
      title: 'Quiet Linen Suit',
      tag: 'minimal' as const,
      season: 'Spring',
      occasion: 'Office',
      keyItems: ['Linen blazer'],
      hero: 'https://example.com/a.jpg',
      gallery: [],
    },
    {
      id: '2',
      title: 'Street Shell',
      tag: 'streetwear' as const,
      season: 'Fall',
      occasion: 'City',
      keyItems: ['Parka'],
      hero: 'https://example.com/b.jpg',
      gallery: [],
    },
  ]),
}));

describe('global search', () => {
  it('focuses search on meta+k and filters gallery links', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <SearchProvider>
          <Layout>
            <HomeGallery />
          </Layout>
        </SearchProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('link', { name: /quiet linen suit/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /street shell/i })).toBeInTheDocument();

    await user.keyboard('{Meta>}k{/Meta}');

    const input = screen.getByRole('searchbox');
    expect(input).toHaveFocus();

    await user.type(input, 'street');
    expect(screen.queryByRole('link', { name: /quiet linen suit/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /street shell/i })).toBeInTheDocument();
  });
});
