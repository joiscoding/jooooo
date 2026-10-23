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

  if (loading) {
    return h(
      'div',
      { className: 'page-loading' },
      h('p', { className: 'muted' }, 'Loading lookbook…')
    );
  }

  const featured_look = looks[0];

  return h(
    'div',
    { className: 'home' },
    h(
      'section',
      { className: 'home-hero' },
      h(
        'div',
        { className: 'hero-copy' },
        h('p', { className: 'eyebrow' }, 'Men · Seasonal edit'),
        h('h1', { className: 'home-title' }, 'Looks built for quiet confidence.'),
        h(
          'p',
          { className: 'hero-deck' },
          'A considered wardrobe for moving through the world. Modern silhouettes, useful layers, and pieces designed to last.'
        ),
        featured_look &&
          h(
            Link,
            { to: `/look/${featured_look.id}`, className: 'text-link' },
            'Explore the seasonal edit ',
            h('span', { 'aria-hidden': true }, '→')
          )
      ),
      featured_look &&
        h(
          Link,
          { to: `/look/${featured_look.id}`, className: 'hero-visual' },
          h('img', { src: featured_look.hero, alt: featured_look.title }),
          h(
            'span',
            { className: 'hero-caption' },
            h('span', null, STYLE_LABELS[featured_look.tag]),
            h('strong', null, featured_look.title)
          )
        )
    ),
    h(
      'section',
      { className: 'manifesto', 'aria-labelledby': 'manifesto-title' },
      h('p', { className: 'section-index' }, '01 / Approach'),
      h('h2', { id: 'manifesto-title' }, 'Style should feel instinctive, not overthought.'),
      h(
        'p',
        null,
        'This edit brings together distinct ways of dressing with one idea in common: fewer, better choices that make room for personality.'
      )
    ),
    h(
      'section',
      { className: 'collection', 'aria-labelledby': 'collection-title' },
      h(
        'div',
        { className: 'collection-head' },
        h(
          'div',
          null,
          h('p', { className: 'section-index' }, '02 / The collection'),
          h('h2', { id: 'collection-title' }, 'Find your point of view.')
        ),
        h('p', null, `${filtered.length} curated looks`)
      ),
      h(
        'div',
        { className: 'filters-bar', 'aria-label': 'Style filters' },
        h(
          'button',
          {
            type: 'button',
            className: filter === 'all' ? 'filter-pill active' : 'filter-pill',
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
            filtered.map((look, i) =>
              h(
                Link,
                {
                  key: look.id,
                  to: `/look/${look.id}`,
                  className: 'wall-card',
                },
                h(
                  'div',
                  { className: 'wall-card-inner' },
                  h('img', {
                    key: `${look.id}-${look.hero}`,
                    src: look.hero,
                    alt: '',
                    className: 'wall-img',
                    loading: i < 4 ? 'eager' : 'lazy',
                  }),
                  h(
                    'div',
                    { className: 'wall-meta' },
                    h('span', { className: 'wall-tag' }, STYLE_LABELS[look.tag]),
                    h('h3', { className: 'wall-title' }, look.title)
                  )
                )
              )
            )
          )
    ),
    h(
      'section',
      { className: 'closing-statement' },
      h('p', { className: 'section-index' }, '03 / Make it yours'),
      h('h2', null, 'Save what speaks to you. Build a wardrobe with intention.'),
      h(
        Link,
        { to: '/albums', className: 'text-link' },
        'View your albums ',
        h('span', { 'aria-hidden': true }, '→')
      )
    )
  );
}
