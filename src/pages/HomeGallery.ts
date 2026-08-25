import { createElement, useEffect, useMemo, useState } from 'react';
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
    return looks.filter((look) => look.tag === filter);
  }, [looks, filter]);

  if (loading) {
    return createElement(
      'div',
      { className: 'page-loading' },
      createElement('p', { className: 'muted' }, 'Loading lookbook…')
    );
  }

  return createElement(
    'div',
    { className: 'home' },
    createElement(
      'section',
      { className: 'home-hero' },
      createElement(
        'div',
        { className: 'hero-copy' },
        createElement('p', { className: 'eyebrow' }, "The men's seasonal edit"),
        createElement('h1', { className: 'home-title' }, 'What do you want to wear?'),
        createElement(
          'p',
          { className: 'home-intro' },
          'A considered collection of looks for work, weekends, and everywhere in between.'
        )
      ),
      createElement(
        'div',
        { className: 'style-prompt' },
        createElement(
          'div',
          { className: 'style-prompt-heading' },
          createElement('span', null, 'Explore by style'),
          createElement(
            'span',
            { className: 'style-prompt-status' },
            filter === 'all' ? 'Showing the full edit' : STYLE_LABELS[filter]
          )
        ),
        createElement(
          'div',
          { className: 'filters-bar', 'aria-label': 'Style filters' },
          createElement(
            'button',
            {
              type: 'button',
              className: filter === 'all' ? 'filter-pill active' : 'filter-pill',
              'aria-pressed': filter === 'all',
              onClick: () => setFilter('all'),
            },
            'All looks'
          ),
          ...STYLE_ORDER.map((tag) =>
            createElement(
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
        )
      )
    ),
    createElement(
      'div',
      { className: 'collection-heading' },
      createElement('h2', null, 'Explore the edit'),
      createElement('p', null, `${filtered.length} considered looks`)
    ),
    filtered.length === 0
      ? createElement('p', { className: 'empty-state' }, 'No looks in this filter.')
      : createElement(
          'div',
          { className: 'gallery-wall' },
          ...filtered.map((look, index) =>
            createElement(
              Link,
              {
                key: look.id,
                to: `/look/${look.id}`,
                className: 'wall-card',
              },
              createElement(
                'div',
                { className: 'wall-card-inner' },
                createElement('img', {
                  key: `${look.id}-${look.hero}`,
                  src: look.hero,
                  alt: '',
                  className: 'wall-img',
                  loading: index < 4 ? 'eager' : 'lazy',
                }),
                createElement(
                  'div',
                  { className: 'wall-meta' },
                  createElement('span', { className: 'wall-tag' }, STYLE_LABELS[look.tag]),
                  createElement(
                    'div',
                    { className: 'wall-title-row' },
                    createElement('h3', { className: 'wall-title' }, look.title),
                    createElement(
                      'span',
                      { className: 'wall-arrow', 'aria-hidden': 'true' },
                      '↗'
                    )
                  )
                )
              )
            )
          )
        )
  );
}
