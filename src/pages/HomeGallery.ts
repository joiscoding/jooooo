import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

function isStyleTag(value: string | null): value is StyleTag {
  return value !== null && STYLE_ORDER.some((tag) => tag === value);
}

function toSentenceList(items: string[]): string {
  const lower = items.map((item) => item.toLowerCase());
  if (lower.length < 2) return lower.join('');
  return `${lower.slice(0, -1).join(', ')} and ${lower[lower.length - 1]}`;
}

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const styleParam = searchParams.get('style');
  const filter: StyleTag | 'all' = isStyleTag(styleParam) ? styleParam : 'all';

  // A style in the URL (e.g. from a footer link) means the visitor asked for
  // the wall, not the top of the page.
  const pendingScroll = useRef(isStyleTag(styleParam));

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

  useEffect(() => {
    if (loading || !pendingScroll.current) return;
    pendingScroll.current = false;
    document.getElementById('gallery')?.scrollIntoView();
  }, [loading]);

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((look) => look.tag === filter);
  }, [looks, filter]);

  const featured = useMemo(
    () => looks.find((look) => look.tag === 'minimal') ?? looks[0],
    [looks]
  );

  function selectFilter(next: StyleTag | 'all') {
    setSearchParams(next === 'all' ? {} : { style: next }, { replace: true });
  }

  if (loading) {
    return createElement(
      'div',
      { className: 'wrap' },
      createElement('p', { className: 'page-loading' }, 'Loading the lookbook...')
    );
  }

  return createElement(
    'div',
    { className: 'home' },
    createElement(
      'section',
      { className: 'hero wrap' },
      createElement(
        'div',
        { className: 'hero-grid' },
        createElement(
          'h1',
          { className: 'hero-title' },
          'A menswear ',
          createElement('a', { className: 'ilink', href: '#gallery' }, 'lookbook'),
          ' built on restraint, not volume.'
        ),
        createElement(
          'div',
          { className: 'hero-side' },
          createElement(
            'p',
            { className: 'lede' },
            `${looks.length} outfits across ${STYLE_ORDER.length} aesthetics, photographed for reference rather than checkout. Read a look, note what it is built from, and keep the ones worth returning to.`
          ),
          createElement(
            'div',
            { className: 'hero-actions' },
            createElement(
              'a',
              { className: 'btn primary', href: '#gallery' },
              'Browse the gallery'
            ),
            createElement(Link, { className: 'btn ghost', to: '/albums' }, 'See albums')
          )
        )
      )
    ),
    featured &&
      createElement(
        'section',
        { className: 'wrap' },
        createElement(
          'article',
          { className: 'feature-card' },
          createElement(
            'div',
            { className: 'feature-copy' },
            createElement(
              'p',
              { className: 'eyebrow' },
              `Featured edit · ${featured.season}`
            ),
            createElement('h2', { className: 'feature-title' }, featured.title),
            createElement(
              'p',
              { className: 'feature-body' },
              `${STYLE_LABELS[featured.tag]}, cut for ${featured.occasion.toLowerCase()} and built around ${toSentenceList(featured.keyItems)}.`
            ),
            createElement(
              'dl',
              { className: 'feature-meta' },
              createElement(
                'div',
                null,
                createElement('dt', null, 'Season'),
                createElement('dd', null, featured.season)
              ),
              createElement(
                'div',
                null,
                createElement('dt', null, 'Occasion'),
                createElement('dd', null, featured.occasion)
              ),
              createElement(
                'div',
                null,
                createElement('dt', null, 'Aesthetic'),
                createElement('dd', null, STYLE_LABELS[featured.tag])
              )
            ),
            createElement(
              Link,
              { className: 'ilink feature-link', to: `/look/${featured.id}` },
              'See the full look →'
            )
          ),
          createElement(
            'div',
            { className: 'feature-visual' },
            createElement('img', { src: featured.hero, alt: '' })
          )
        )
      ),
    createElement(
      'section',
      { className: 'wrap section-gap' },
      createElement(
        'div',
        { className: 'section-head' },
        createElement('h2', { className: 'section-title' }, 'Start here')
      ),
      createElement(
        'div',
        { className: 'note-grid' },
        createElement(
          'div',
          { className: 'note-card' },
          createElement('h3', null, 'The wall'),
          createElement(
            'p',
            null,
            'Every look sits on one offset wall rather than a catalogue grid, so the photography sets the pace.'
          ),
          createElement('a', { className: 'ilink', href: '#gallery' }, 'Jump to the wall →')
        ),
        createElement(
          'div',
          { className: 'note-card' },
          createElement('h3', null, 'Five aesthetics'),
          createElement(
            'p',
            null,
            'Minimal, streetwear, classic, athleisure and workwear. One tag per look, no fifty-facet filter panel.'
          ),
          createElement(Link, { className: 'ilink', to: '/?style=minimal' }, 'Start with minimal →')
        ),
        createElement(
          'div',
          { className: 'note-card' },
          createElement('h3', null, 'Albums'),
          createElement(
            'p',
            null,
            'Save looks into named albums. They live in this browser, so they survive a refresh without an account.'
          ),
          createElement(Link, { className: 'ilink', to: '/albums' }, 'Open albums →')
        )
      )
    ),
    createElement(
      'section',
      { className: 'wrap section-gap', id: 'gallery' },
      createElement(
        'div',
        { className: 'section-head' },
        createElement('h2', { className: 'section-title' }, 'The wall'),
        createElement(
          'p',
          { className: 'section-count' },
          filter === 'all'
            ? `${looks.length} looks`
            : `${filtered.length} of ${looks.length} looks`
        )
      ),
      createElement(
        'div',
        { className: 'filters-bar', 'aria-label': 'Style filters' },
        createElement(
          'button',
          {
            type: 'button',
            className: filter === 'all' ? 'filter-btn active' : 'filter-btn',
            onClick: () => selectFilter('all'),
          },
          'All looks'
        ),
        STYLE_ORDER.map((tag) =>
          createElement(
            'button',
            {
              key: tag,
              type: 'button',
              className: filter === tag ? 'filter-btn active' : 'filter-btn',
              onClick: () => selectFilter(tag),
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
            filtered.map((look, index) =>
              createElement(
                Link,
                {
                  key: look.id,
                  to: `/look/${look.id}`,
                  className: 'look-card',
                },
                createElement('img', {
                  src: look.hero,
                  alt: '',
                  className: 'look-card-img',
                  loading: index < 3 ? 'eager' : 'lazy',
                }),
                createElement(
                  'div',
                  { className: 'look-card-body' },
                  createElement('p', { className: 'eyebrow' }, STYLE_LABELS[look.tag]),
                  createElement('h3', { className: 'look-card-title' }, look.title),
                  createElement('span', { className: 'look-card-cta' }, 'View look →')
                )
              )
            )
          )
    ),
    createElement(
      'section',
      { className: 'band-dark' },
      createElement(
        'div',
        { className: 'wrap band-inner' },
        createElement(
          'div',
          null,
          createElement('p', { className: 'eyebrow' }, 'Keep what you find'),
          createElement(
            'h2',
            { className: 'band-title' },
            'Albums are the point. Everything else is browsing.'
          )
        ),
        createElement(
          'div',
          null,
          createElement(
            'p',
            { className: 'band-body' },
            'Create as many as you like — seasonal, occasion-based, or one running list. Albums are stored locally in this browser, with no account and no sync.'
          ),
          createElement(
            'div',
            { className: 'band-actions' },
            createElement(Link, { className: 'btn clay', to: '/albums' }, 'Start an album'),
            createElement('a', { className: 'btn ghost', href: '#gallery' }, 'Back to the wall')
          )
        )
      )
    )
  );
}
