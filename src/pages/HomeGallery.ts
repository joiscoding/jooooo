import {
  createElement as h,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

export function HomeGallery() {
  const navigate = useNavigate();
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
      h('p', { className: 'muted' }, 'Loading lookbook...'),
    );
  }

  const featured = looks.slice(0, 3);
  const scroll_to_top = () => {
    const previous_behavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.documentElement.style.scrollBehavior = previous_behavior;
  };
  const open_look =
    (look_id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      scroll_to_top();
      window.requestAnimationFrame(() => navigate(`/look/${look_id}`));
    };

  return h(
    'div',
    { className: 'home' },
    h(
      'section',
      { className: 'hero' },
      h('p', { className: 'eyebrow' }, 'Men · Seasonal edit'),
      h(
        'h1',
        { className: 'home-title' },
        'Looks built for ',
        h('em', null, 'quiet'),
        ' confidence.',
      ),
      h(
        'p',
        { className: 'hero-lede' },
        'Modern style, designed to last. Browse the seasonal lookbook, filter by aesthetic, and keep the ones you want in albums.',
      ),
      h(
        'div',
        { className: 'hero-actions' },
        h('a', { className: 'btn primary', href: '#looks' }, 'Browse looks'),
        h(Link, { className: 'btn ghost', to: '/albums' }, 'Open albums'),
      ),
    ),
    featured.length > 0
      ? h(
          'section',
          { className: 'stage', 'aria-label': 'Featured looks' },
          h(
            'div',
            { className: 'stage-frame' },
            h(
              'div',
              { className: 'stage-bar' },
              h(
                'span',
                { className: 'stage-dots', 'aria-hidden': true },
                h('i'),
                h('i'),
                h('i'),
              ),
              h('span', { className: 'stage-label' }, 'Studio Lookbook'),
            ),
            h(
              'div',
              { className: 'stage-grid' },
              featured.map((look) =>
                h(
                  'a',
                  {
                    key: look.id,
                    href: `/look/${look.id}`,
                    className: 'stage-card',
                    onClick: open_look(look.id),
                  },
                  h('img', { src: look.hero, alt: '' }),
                  h(
                    'span',
                    null,
                    h('em', null, STYLE_LABELS[look.tag]),
                    look.title,
                  ),
                ),
              ),
            ),
          ),
        )
      : null,
    h(
      'section',
      { className: 'pillars', 'aria-label': 'Highlights' },
      h(
        'div',
        { className: 'pillars-inner' },
        h(
          'article',
          null,
          h('p', { className: 'pillar-kicker' }, '01'),
          h('h2', null, 'Quiet confidence'),
          h(
            'p',
            null,
            'Editorial looks with restrained neutrals, clean silhouettes, and room to breathe.',
          ),
        ),
        h(
          'article',
          null,
          h('p', { className: 'pillar-kicker' }, '02'),
          h('h2', null, 'Five aesthetics'),
          h(
            'p',
            null,
            'Minimal, street, tailored, sport, and heritage. Filter the wall without leaving the page.',
          ),
        ),
        h(
          'article',
          null,
          h('p', { className: 'pillar-kicker' }, '03'),
          h('h2', null, 'Albums that stay'),
          h(
            'p',
            null,
            'Save a look, name a collection, and find it again after a refresh in this browser.',
          ),
        ),
      ),
    ),
    h(
      'section',
      { id: 'looks', className: 'edit' },
      h(
        'div',
        { className: 'edit-head' },
        h('h2', null, 'The seasonal edit'),
        h('p', null, 'Every look, one wall. Open any frame for the full outfit.'),
      ),
      h(
        'section',
        { className: 'filters-bar', 'aria-label': 'Style filters' },
        h(
          'button',
          {
            type: 'button',
            className: filter === 'all' ? 'filter-pill active' : 'filter-pill',
            onClick: () => setFilter('all'),
          },
          'All looks',
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
            STYLE_LABELS[tag],
          ),
        ),
      ),
      filtered.length === 0
        ? h('p', { className: 'empty-state' }, 'No looks in this filter.')
        : h(
            'div',
            { className: 'gallery-wall' },
            filtered.map((look, i) =>
              h(
                'a',
                {
                  key: look.id,
                  href: `/look/${look.id}`,
                  className: 'wall-card',
                  onClick: open_look(look.id),
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
                    h('h3', { className: 'wall-title' }, look.title),
                  ),
                ),
              ),
            ),
          ),
    ),
    h(
      'section',
      { className: 'proof' },
      h(
        'blockquote',
        null,
        h('p', null, 'Modern style, designed to last.'),
        h('footer', null, 'Studio Lookbook · Men'),
      ),
      h(Link, { to: '/albums', className: 'btn primary' }, 'Open albums'),
    ),
  );
}
