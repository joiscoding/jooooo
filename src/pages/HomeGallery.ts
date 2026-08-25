import { createElement as h, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchLooks().then((data) => {
      if (!cancelled) {
        setLooks(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  const featured =
    looks.find((l) => l.id === 'city-charcoal') ??
    looks.find((l) => l.tag === 'classic') ??
    looks[0];

  const spotlights = useMemo(() => {
    const rest = featured ? looks.filter((l) => l.id !== featured.id) : looks;
    return rest.slice(0, 2);
  }, [looks, featured]);

  if (loading) {
    return h(
      'div',
      { className: 'home' },
      h(
        'section',
        { className: 'home-hero-cinematic home-hero-cinematic--loading' },
        h('div', { className: 'hero-veil', 'aria-hidden': true }),
        h('p', { className: 'muted' }, 'Loading lookbook…')
      )
    );
  }

  return h(
    'div',
    { className: 'home' },
    h(
      'section',
      { className: 'home-hero-cinematic', 'aria-label': 'Introduction' },
      featured ? h('img', { src: featured.hero, alt: '', className: 'hero-bg' }) : null,
      h('div', { className: 'hero-veil', 'aria-hidden': true }),
      h(
        'div',
        { className: 'hero-copy' },
        h('p', { className: 'eyebrow' }, 'Men / Seasonal edit'),
        h('h1', { className: 'home-title' }, 'Looks'),
        h('p', { className: 'hero-lede' }, 'Built for quiet confidence.'),
        h(
          'p',
          { className: 'hero-metrics' },
          h('span', null, `${looks.length} looks`),
          h('span', { className: 'hero-metrics-dot', 'aria-hidden': true }, '/'),
          h('span', null, '5 styles'),
          h('span', { className: 'hero-metrics-dot', 'aria-hidden': true }, '/'),
          h('span', null, 'Local albums')
        ),
        h(
          'div',
          { className: 'hero-actions' },
          h('a', { href: '#collection', className: 'btn primary' }, 'Enter gallery'),
          h(Link, { to: '/albums', className: 'btn ghost' }, 'Albums')
        )
      ),
      h(
        'a',
        { href: '#collection', className: 'hero-scroll' },
        h('span', { className: 'sr-only' }, 'Scroll to collection'),
        h('span', { 'aria-hidden': true }, '↓')
      )
    ),
    spotlights.length === 2
      ? h(
          'section',
          { className: 'spotlight-band', 'aria-label': 'Featured looks' },
          spotlights.map((look) =>
            h(
              Link,
              { key: look.id, to: `/look/${look.id}`, className: 'spotlight-card' },
              h('img', { src: look.hero, alt: '', className: 'spotlight-img' }),
              h(
                'div',
                { className: 'spotlight-copy' },
                h('p', { className: 'eyebrow' }, STYLE_LABELS[look.tag]),
                h('h2', { className: 'spotlight-title' }, look.title),
                h('span', { className: 'btn ghost' }, 'View look')
              )
            )
          )
        )
      : null,
    h(
      'section',
      { id: 'collection', className: 'collection-band', 'aria-label': 'Lookbook collection' },
      h(
        'header',
        { className: 'collection-head' },
        h('p', { className: 'eyebrow' }, 'The collection'),
        h('h2', { className: 'collection-title' }, 'Every look, one wall.')
      ),
      h(
        'div',
        { className: 'filters-bar', 'aria-label': 'Style filters' },
        h(
          'button',
          {
            type: 'button',
            className: filter === 'all' ? 'filter-pill active' : 'filter-pill',
            'aria-pressed': filter === 'all',
            onClick: () => setFilter('all'),
          },
          'All looks'
        ),
        STYLE_ORDER.map((tag) =>
          h(
            'button',
            {
              key: tag,
              type: 'button',
              className: filter === tag ? 'filter-pill active' : 'filter-pill',
              'aria-pressed': filter === tag,
              onClick: () => setFilter(tag),
            },
            STYLE_LABELS[tag]
          )
        )
      ),
      filtered.length === 0
        ? h('p', { className: 'empty-state' }, 'No looks in this filter.')
        : h(
            'div',
            { className: 'gallery-wall' },
            filtered.map((look, index) =>
              h(
                Link,
                { key: look.id, to: `/look/${look.id}`, className: 'wall-card' },
                h(
                  'div',
                  { className: 'wall-card-inner' },
                  h('img', {
                    key: `${look.id}-${look.hero}`,
                    src: look.hero,
                    alt: '',
                    className: 'wall-img',
                    loading: index < 4 ? 'eager' : 'lazy',
                  }),
                  h(
                    'div',
                    { className: 'wall-meta' },
                    h('span', { className: 'wall-tag' }, STYLE_LABELS[look.tag]),
                    h('h2', { className: 'wall-title' }, look.title)
                  )
                )
              )
            )
          )
    )
  );
}
