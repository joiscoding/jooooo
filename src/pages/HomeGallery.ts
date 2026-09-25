import { createElement as h, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const STYLE_BLURBS: Record<StyleTag, string> = {
  minimal: 'Neutrals, clean silhouettes, and understated color.',
  streetwear: 'Sneakers, layers, and city utility.',
  classic: 'Structure, prep, and dress-casual tailoring.',
  athleisure: 'Performance-inspired pieces for travel and training.',
  workwear: 'Durable fabrics with a heritage cut.',
};

const STEPS = [
  {
    title: 'Browse the edit',
    body: 'Start from the seasonal gallery and narrow it with a style.',
  },
  {
    title: 'Open a look',
    body: 'See the hero, the key pieces, and where the outfit belongs.',
  },
  {
    title: 'Save an album',
    body: 'Keep favorites in this browser. They stay after a refresh.',
  },
];

function lookBlurb(look: Look) {
  const pieces = look.keyItems.slice(0, 2).join(' and ');
  return `${look.occasion} · ${look.season}. Built around ${pieces}.`;
}

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

  const featured = useMemo(() => looks.slice(0, 3), [looks]);
  const heroLook =
    looks.find((look) => look.id === 'boardroom-soft') ?? looks[0];

  function selectStyle(tag: StyleTag) {
    setFilter(tag);
    document.getElementById('looks')?.scrollIntoView({ behavior: 'smooth' });
  }

  function renderFeaturedCard(look: Look) {
    return h(
      Link,
      { key: look.id, to: `/look/${look.id}`, className: 'lp-card' },
      h('img', { src: look.hero, alt: '', className: 'lp-card-img' }),
      h(
        'div',
        { className: 'lp-card-body' },
        h('p', { className: 'lp-card-kicker' }, STYLE_LABELS[look.tag]),
        h('h2', null, look.title),
        h('p', null, lookBlurb(look)),
        h('span', { className: 'lp-more' }, 'View look ›')
      )
    );
  }

  function renderGalleryCard(look: Look, index: number) {
    return h(
      Link,
      { key: look.id, to: `/look/${look.id}`, className: 'lp-card' },
      h('img', {
        src: look.hero,
        alt: '',
        className: 'lp-card-img',
        loading: index < 3 ? 'eager' : 'lazy',
      }),
      h(
        'div',
        { className: 'lp-card-body' },
        h('p', { className: 'lp-card-kicker' }, STYLE_LABELS[look.tag]),
        h('h2', null, look.title),
        h('p', null, `${look.occasion} · ${look.season}`),
        h('span', { className: 'lp-more' }, 'View look ›')
      )
    );
  }

  return h(
    'div',
    { className: 'lp' },
    h(
      'section',
      {
        className: 'lp-hero',
        style: heroLook
          ? {
              backgroundImage: `linear-gradient(90deg, rgba(22, 30, 45, 0.94) 0%, rgba(22, 30, 45, 0.78) 46%, rgba(22, 30, 45, 0.42) 100%), url(${heroLook.hero})`,
            }
          : undefined,
      },
      h(
        'div',
        { className: 'lp-wrap lp-hero-inner' },
        h('p', { className: 'lp-kicker' }, 'Men’s seasonal edit'),
        h('h1', null, 'The lookbook for quiet confidence.'),
        h(
          'p',
          { className: 'lp-hero-copy' },
          'Browse men’s looks across five styles. Open an outfit, then save it to an album that stays in this browser.'
        ),
        h(
          'div',
          { className: 'lp-hero-actions' },
          h('a', { className: 'lp-btn', href: '#looks' }, 'Explore looks'),
          h(
            Link,
            { className: 'lp-btn lp-btn-secondary', to: '/albums' },
            'View albums'
          )
        )
      )
    ),
    h(
      'section',
      { className: 'lp-features', 'aria-label': 'Featured looks' },
      h(
        'div',
        { className: 'lp-wrap' },
        loading
          ? h('p', { className: 'lp-loading' }, 'Loading lookbook…')
          : h(
              'div',
              { className: 'lp-feature-grid' },
              featured.map((look) => renderFeaturedCard(look))
            )
      )
    ),
    h(
      'section',
      { id: 'styles', className: 'lp-section' },
      h(
        'div',
        { className: 'lp-wrap' },
        h('h2', { className: 'lp-heading' }, 'Five styles for the season'),
        h(
          'p',
          { className: 'lp-lead' },
          'Pick the way you dress. The gallery below follows that filter.'
        ),
        h(
          'div',
          { className: 'lp-style-grid' },
          STYLE_ORDER.map((tag) =>
            h(
              'button',
              {
                key: tag,
                type: 'button',
                className: 'lp-style',
                onClick: () => selectStyle(tag),
              },
              h('h3', null, STYLE_LABELS[tag]),
              h('p', null, STYLE_BLURBS[tag]),
              h('span', { className: 'lp-more' }, 'Browse looks ›')
            )
          )
        )
      )
    ),
    h(
      'section',
      { id: 'looks', className: 'lp-section lp-section-muted' },
      h(
        'div',
        { className: 'lp-wrap' },
        h('h2', { className: 'lp-heading' }, 'Explore the gallery'),
        h(
          'p',
          { className: 'lp-lead' },
          'Every look is a full outfit, not a product grid.'
        ),
        h(
          'div',
          { className: 'lp-tabs', role: 'tablist', 'aria-label': 'Style filters' },
          h(
            'button',
            {
              type: 'button',
              role: 'tab',
              'aria-selected': filter === 'all',
              className: filter === 'all' ? 'lp-tab active' : 'lp-tab',
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
                role: 'tab',
                'aria-selected': filter === tag,
                className: filter === tag ? 'lp-tab active' : 'lp-tab',
                onClick: () => setFilter(tag),
              },
              STYLE_LABELS[tag]
            )
          )
        ),
        loading
          ? h('p', { className: 'lp-loading' }, 'Loading lookbook…')
          : filtered.length === 0
            ? h('p', { className: 'empty-state' }, 'No looks in this filter.')
            : h(
                'div',
                { className: 'lp-grid' },
                filtered.map((look, index) => renderGalleryCard(look, index))
              )
      )
    ),
    h(
      'section',
      { className: 'lp-section' },
      h(
        'div',
        { className: 'lp-wrap' },
        h('h2', { className: 'lp-heading' }, 'Get started in three steps'),
        h(
          'ol',
          { className: 'lp-steps' },
          STEPS.map((step, index) =>
            h(
              'li',
              { key: step.title },
              h('span', { className: 'lp-step-num' }, index + 1),
              h('h3', null, step.title),
              h('p', null, step.body)
            )
          )
        )
      )
    ),
    h(
      'section',
      { className: 'lp-cta' },
      h(
        'div',
        { className: 'lp-wrap lp-cta-inner' },
        h(
          'div',
          null,
          h('h2', null, 'Save a look. Build an album.'),
          h('p', null, 'Albums live in this browser and survive a refresh.')
        ),
        h(Link, { className: 'lp-btn', to: '/albums' }, 'Open albums')
      )
    )
  );
}
