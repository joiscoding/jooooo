import { createElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const STYLE_BLURBS: Record<StyleTag, string> = {
  minimal: 'Neutrals, clean silhouettes, nothing extra.',
  streetwear: 'Sneakers, layers and utility cues for the city.',
  classic: 'Structure and prep, dressed just casual enough.',
  athleisure: 'Performance-inspired pieces with a relaxed fit.',
  workwear: 'Durable fabrics with a vintage-work backbone.',
};

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

  const heroLooks = looks.slice(0, 3);

  const pickStyle = (tag: StyleTag) => {
    setFilter(tag);
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

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
        createElement('p', { className: 'eyebrow' }, 'Men · Seasonal edit'),
        createElement(
          'h1',
          { className: 'home-title' },
          'Looks built for ',
          createElement('em', null, 'quiet'),
          ' confidence.'
        ),
        createElement(
          'p',
          { className: 'hero-lede' },
          'An outfit-first lookbook. Browse considered looks across five styles, then save the ones you love to your own albums.'
        ),
        createElement(
          'div',
          { className: 'hero-actions' },
          createElement(
            'a',
            { href: '#gallery', className: 'btn-pill dark' },
            'Browse looks'
          ),
          createElement(
            Link,
            { to: '/albums', className: 'btn-pill outline' },
            'Your albums'
          )
        )
      ),
      createElement(
        'div',
        { className: 'hero-collage', 'aria-hidden': true },
        heroLooks.map((look, i) =>
          createElement('img', {
            key: look.id,
            src: look.hero,
            alt: '',
            className: `hero-collage-img n${i}`,
          })
        )
      )
    ),
    createElement(
      'section',
      { className: 'styles-section', 'aria-labelledby': 'styles-heading' },
      createElement(
        'div',
        { className: 'section-head' },
        createElement(
          'h2',
          { id: 'styles-heading', className: 'section-title' },
          'Five ways to dress'
        ),
        createElement(
          'p',
          { className: 'section-lede' },
          'Every look maps to one primary style. Pick a direction to start.'
        )
      ),
      createElement(
        'div',
        { className: 'style-cards' },
        STYLE_ORDER.map((tag, i) =>
          createElement(
            'button',
            {
              key: tag,
              type: 'button',
              className: 'style-card',
              onClick: () => pickStyle(tag),
            },
            createElement('span', { className: 'style-card-num' }, `0${i + 1}`),
            createElement(
              'span',
              { className: 'style-card-title' },
              STYLE_LABELS[tag]
            ),
            createElement(
              'span',
              { className: 'style-card-body' },
              STYLE_BLURBS[tag]
            ),
            createElement('span', { className: 'style-card-link' }, 'View looks →')
          )
        )
      )
    ),
    createElement(
      'section',
      { id: 'gallery', className: 'gallery-section' },
      createElement(
        'div',
        { className: 'section-head' },
        createElement('h2', { className: 'section-title' }, 'The lookbook')
      ),
      createElement(
        'div',
        { className: 'filters-bar', role: 'group', 'aria-label': 'Style filters' },
        createElement(
          'button',
          {
            type: 'button',
            className: filter === 'all' ? 'filter-pill active' : 'filter-pill',
            onClick: () => setFilter('all'),
          },
          'All looks'
        ),
        STYLE_ORDER.map((tag) =>
          createElement(
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
        ? createElement('p', { className: 'empty-state' }, 'No looks in this filter.')
        : createElement(
            'div',
            { className: 'gallery-wall' },
            filtered.map((look, i) =>
              createElement(
                Link,
                { key: look.id, to: `/look/${look.id}`, className: 'wall-card' },
                createElement(
                  'div',
                  { className: 'wall-card-inner' },
                  createElement('img', {
                    key: `${look.id}-${look.hero}`,
                    src: look.hero,
                    alt: '',
                    className: 'wall-img',
                    loading: i < 4 ? 'eager' : 'lazy',
                  })
                ),
                createElement(
                  'div',
                  { className: 'wall-meta' },
                  createElement('span', { className: 'wall-tag' }, STYLE_LABELS[look.tag]),
                  createElement('h3', { className: 'wall-title' }, look.title)
                )
              )
            )
          )
    ),
    createElement(
      'section',
      { className: 'cta-band' },
      createElement('h2', { className: 'cta-title' }, 'Keep the looks you love.'),
      createElement(
        'p',
        { className: 'cta-body' },
        'Albums live in your browser, so your edits are still here after a refresh.'
      ),
      createElement(
        Link,
        { to: '/albums', className: 'btn-pill light' },
        'Start an album'
      )
    )
  );
}
