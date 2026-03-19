import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const STYLE_STORIES: Record<
  StyleTag,
  {
    title: string;
    description: string;
    highlight: string;
  }
> = {
  minimal: {
    title: 'Quiet layers with room to breathe',
    description:
      'Soft neutrals, airy textures, and clean silhouettes keep the edit calm and premium.',
    highlight: 'Most loved for refined weekend dressing.',
  },
  streetwear: {
    title: 'Relaxed volume with sharper utility',
    description:
      'Oversized staples, technical layers, and confident proportions make these looks feel current without being chaotic.',
    highlight: 'Built for movement, contrast, and city energy.',
  },
  classic: {
    title: 'Polished tailoring that stays approachable',
    description:
      'Easy structure, smart shirting, and understated depth give this collection a more elevated everyday cadence.',
    highlight: 'Ideal when the brief is sharp but not stiff.',
  },
  athleisure: {
    title: 'Performance-minded essentials for everyday pacing',
    description:
      'Technical comfort, lighter layers, and travel-ready pieces make these looks the fastest to wear on repeat.',
    highlight: 'A strong fit for transit, training, and recovery.',
  },
  workwear: {
    title: 'Heritage textures with grounded practicality',
    description:
      'Utility jackets, raw denim, and leather accents keep the story durable while still feeling curated.',
    highlight: 'Best when you want texture, weight, and structure.',
  },
};

const VALUE_POINTS = [
  {
    label: 'Premium feel',
    copy: 'Cleaner spacing, richer photography, and quieter typography make the page feel more considered.',
  },
  {
    label: 'Easier browsing',
    copy: 'The flow now moves from hero to trust cues to a straight shopping grid, similar to a modern essentials brand.',
  },
  {
    label: 'Clearer decisions',
    copy: 'Each card surfaces the season, use case, and key pieces so users can evaluate a look at a glance.',
  },
] as const;

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

  const filterCounts = useMemo(
    () =>
      STYLE_ORDER.reduce<Record<StyleTag, number>>((acc, tag) => {
        acc[tag] = looks.filter((look) => look.tag === tag).length;
        return acc;
      }, {} as Record<StyleTag, number>),
    [looks],
  );

  const defaultFeaturedLook =
    looks.find((look) => look.id === 'boardroom-soft') ?? looks[0];
  const featuredLook =
    filter === 'all' ? defaultFeaturedLook : filtered[0] ?? defaultFeaturedLook;
  const supportingLooks = filtered
    .filter((look) => look.id !== featuredLook?.id)
    .slice(0, 3);
  const activeStory =
    filter === 'all'
      ? {
          title: 'An editorial browse flow, adapted for our lookbook',
          description:
            'Inspired by Quince, the experience now puts value messaging, soft merchandising, and visual calm ahead of decorative chrome.',
          highlight:
            'Start with a curated hero, scan the trust strip, then drop into a shoppable edit.',
        }
      : STYLE_STORIES[filter];

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">New season edit</p>
          <h1 className="home-title">
            Quiet luxury cues, translated into a simpler browse experience.
          </h1>
          <p className="home-lede">
            The page now borrows from Quince&apos;s calm, product-first flow:
            strong imagery, light-touch value messaging, and cleaner pathways
            into each look.
          </p>
          <div className="hero-actions">
            <a href="#shop-edit" className="btn primary">
              Shop the edit
            </a>
            {featuredLook && (
              <Link to={`/look/${featuredLook.id}`} className="btn ghost">
                View featured look
              </Link>
            )}
          </div>
          <dl className="hero-stats">
            <div>
              <dt>{looks.length}</dt>
              <dd>curated looks</dd>
            </div>
            <div>
              <dt>{STYLE_ORDER.length}</dt>
              <dd>style stories</dd>
            </div>
            <div>
              <dt>3-step</dt>
              <dd>browse flow</dd>
            </div>
          </dl>
        </div>

        {featuredLook && (
          <Link to={`/look/${featuredLook.id}`} className="hero-feature-card">
            <div className="hero-feature-media">
              <img
                src={featuredLook.hero}
                alt={featuredLook.title}
                className="hero-feature-image"
                loading="eager"
              />
            </div>
            <div className="hero-feature-copy">
              <span className="hero-feature-badge">Featured look</span>
              <h2 className="hero-feature-title">{featuredLook.title}</h2>
              <p className="hero-feature-meta">
                {STYLE_LABELS[featuredLook.tag]} · {featuredLook.season}
              </p>
              <p className="hero-feature-text">
                For {featuredLook.occasion.toLowerCase()} dressing, anchored by{' '}
                {featuredLook.keyItems.slice(0, 2).join(' and ')}.
              </p>
            </div>
          </Link>
        )}
      </section>

      <section className="value-strip" aria-label="Browse highlights">
        {VALUE_POINTS.map((point) => (
          <article key={point.label} className="value-card">
            <p className="value-label">{point.label}</p>
            <p className="value-copy">{point.copy}</p>
          </article>
        ))}
      </section>

      <section className="shop-section" id="shop-edit">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Shop by style</p>
            <h2 className="section-title">{activeStory.title}</h2>
          </div>
          <p className="section-copy">{activeStory.description}</p>
        </div>

        <section className="filters-bar" aria-label="Style filters">
          <button
            type="button"
            className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter('all')}
          >
            All looks
            <span className="filter-count">{looks.length}</span>
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setFilter(tag)}
            >
              {STYLE_LABELS[tag]}
              <span className="filter-count">{filterCounts[tag]}</span>
            </button>
          ))}
        </section>

        <div className="shop-layout">
          <aside className="collection-summary">
            <p className="collection-summary-label">Current focus</p>
            <h3 className="collection-summary-title">
              {filter === 'all' ? 'Entire seasonal edit' : STYLE_LABELS[filter]}
            </h3>
            <p className="collection-summary-copy">{activeStory.highlight}</p>
            <div className="collection-summary-block">
              <span className="collection-summary-kicker">What to expect</span>
              <p>
                Better scanability, clearer look context, and product-tile cards
                that feel closer to a premium essentials storefront.
              </p>
            </div>
            {supportingLooks.length > 0 && (
              <div className="collection-summary-block">
                <span className="collection-summary-kicker">Start with</span>
                <ul className="summary-links">
                  {supportingLooks.map((look) => (
                    <li key={look.id}>
                      <Link to={`/look/${look.id}`}>
                        {look.title} · {look.occasion}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {filtered.length === 0 ? (
            <p className="empty-state">No looks in this filter.</p>
          ) : (
            <div className="look-grid">
              {filtered.map((look, i) => (
                <Link key={look.id} to={`/look/${look.id}`} className="look-card">
                  <div className="look-card-media">
                    <img
                      src={look.hero}
                      alt={look.title}
                      className="look-card-image"
                      loading="eager"
                    />
                    <span className="look-card-badge">
                      {i === 0 ? 'Editors pick' : look.season}
                    </span>
                  </div>
                  <div className="look-card-body">
                    <div className="look-card-head">
                      <div>
                        <p className="look-card-tag">{STYLE_LABELS[look.tag]}</p>
                        <h3 className="look-card-title">{look.title}</h3>
                      </div>
                      <span className="look-card-occasion">{look.occasion}</span>
                    </div>
                    <p className="look-card-copy">
                      {look.keyItems.slice(0, 2).join(', ')}
                      {look.keyItems[2] ? `, and ${look.keyItems[2]}` : ''}.
                    </p>
                    <div className="look-card-footer">
                      <span>Build the look</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
