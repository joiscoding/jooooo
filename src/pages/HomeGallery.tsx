import { useEffect, useMemo, useState } from 'react';
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

  const leadLook = filtered[0] ?? looks[0];
  const highlights = filtered.slice(1, 4);
  const countLabel = filter === 'all' ? `${looks.length} looks` : `${filtered.length} looks`;

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
          <p className="eyebrow">Spring / Summer 2026</p>
          <h1 className="home-title">
            Tailoring with a softer edge.
          </h1>
          <p className="hero-intro">
            Elevated everyday wardrobes in natural shades, sharp lines, and
            modern proportions.
          </p>
          <div className="hero-actions">
            <a href="#look-collection" className="hero-cta">
              Explore collection
            </a>
            <span className="hero-count">{countLabel}</span>
          </div>
        </div>
        {leadLook ? (
          <Link to={`/look/${leadLook.id}`} className="hero-image-link">
            <img
              src={leadLook.hero}
              alt={`${leadLook.title} look`}
              className="hero-image"
            />
            <div className="hero-caption">
              <span>{STYLE_LABELS[leadLook.tag]}</span>
              <h2>{leadLook.title}</h2>
              <p>
                {leadLook.season} · {leadLook.occasion}
              </p>
            </div>
          </Link>
        ) : null}
      </section>

      {highlights.length > 0 ? (
        <section className="highlight-row" aria-label="Featured looks">
          {highlights.map((look, i) => (
            <Link key={look.id} to={`/look/${look.id}`} className="highlight-card">
              <img
                src={look.hero}
                alt={`${look.title} look`}
                className="highlight-img"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className="highlight-meta">
                <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                <h2 className="wall-title">{look.title}</h2>
              </div>
            </Link>
          ))}
        </section>
      ) : null}

      <section className="filters-bar" aria-label="Style filters">
        <button
          type="button"
          className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
          onClick={() => setFilter('all')}
        >
          All looks
        </button>
        {STYLE_ORDER.map((tag) => (
          <button
            key={tag}
            type="button"
            className={filter === tag ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter(tag)}
          >
            {STYLE_LABELS[tag]}
          </button>
        ))}
      </section>

      <section className="collection-head" id="look-collection">
        <p className="eyebrow">Current selection</p>
        <p className="collection-copy">
          {filter === 'all'
            ? 'A complete edit of timeless tailoring, modern casualwear, and elevated essentials.'
            : `Browsing ${STYLE_LABELS[filter].toLowerCase()} looks.`}
        </p>
      </section>

      {filtered.length === 0 ? (
        <p className="empty-state">No looks in this filter.</p>
      ) : (
        <div className="gallery-wall">
          {filtered.map((look, i) => {
            return (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="wall-card"
              >
                <div className="wall-card-inner">
                  <img
                    key={`${look.id}-${look.hero}`}
                    src={look.hero}
                    alt={`${look.title} look`}
                    className="wall-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                  <div className="wall-meta">
                    <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                    <h2 className="wall-title">{look.title}</h2>
                    <p className="wall-sub">
                      {look.season} · {look.occasion}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <section className="service-strip" aria-label="Client services">
        <article>
          <h3>Styling appointments</h3>
          <p>One-on-one guidance to shape a sharper wardrobe foundation.</p>
        </article>
        <article>
          <h3>Fit recommendations</h3>
          <p>Precise silhouettes and proportion advice for every build.</p>
        </article>
        <article>
          <h3>Tailoring support</h3>
          <p>Adjustment-ready pieces refined for a clean personal finish.</p>
        </article>
      </section>
    </div>
  );
}
