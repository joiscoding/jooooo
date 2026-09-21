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
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  if (loading) {
    return createElement(
      'div',
      { className: 'page-loading' },
      createElement('p', { className: 'muted' }, 'Loading lookbook…'),
    );
  }

  return createElement(
    'div',
    { className: 'home' },
    createElement(
      'section',
      { className: 'home-hero' },
      createElement('p', { className: 'eyebrow' }, 'Men · Seasonal edit'),
      createElement(
        'h1',
        { className: 'home-title' },
        'Looks built for ',
        createElement('em', null, 'quiet'),
        ' confidence.',
      ),
    ),
    createElement(
      'section',
      {
        className: 'filters-bar',
        'aria-label': 'Style filters',
      },
      createElement(
        'button',
        {
          type: 'button',
          className: filter === 'all' ? 'filter-pill active' : 'filter-pill',
          onClick: () => setFilter('all'),
        },
        'All looks',
      ),
      STYLE_ORDER.map((tag) =>
        createElement(
          'button',
          {
            key: tag,
            type: 'button',
            className:
              filter === tag ? 'filter-pill active' : 'filter-pill',
            onClick: () => setFilter(tag),
          },
          STYLE_LABELS[tag],
        ),
      ),
    ),
    filtered.length === 0
      ? createElement(
          'p',
          { className: 'empty-state' },
          'No looks in this filter.',
        )
      : createElement(
          'div',
          { className: 'gallery-wall' },
          filtered.map((look, i) =>
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
                  loading: i < 4 ? 'eager' : 'lazy',
                }),
                createElement(
                  'div',
                  { className: 'wall-meta' },
                  createElement(
                    'span',
                    { className: 'wall-tag' },
                    STYLE_LABELS[look.tag],
                  ),
                  createElement('h2', { className: 'wall-title' }, look.title),
                ),
              ),
            ),
          ),
        ),
  );
}
