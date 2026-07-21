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

  if (loading) {
    return (
      <div className="page-loading" role="status">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  const featuredLook = looks[0];

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow home-hero-eyebrow">Men’s seasonal system / 2026</p>
          <h1 className="home-title">Built for every mode.</h1>
          <p className="home-intro">
            A modular wardrobe of considered layers, technical essentials, and
            enduring silhouettes—configured around the way you move.
          </p>
          <a className="hero-cta" href="#look-grid">
            Explore the collection
            <span aria-hidden="true">→</span>
          </a>
        </div>
        {featuredLook && (
          <Link
            to={`/look/${featuredLook.id}`}
            className="home-hero-visual"
            aria-label={`View featured look: ${featuredLook.title}`}
          >
            <img src={featuredLook.hero} alt="" />
            <span className="hero-image-label">
              <span>Featured configuration</span>
              <strong>{featuredLook.title}</strong>
            </span>
          </Link>
        )}
      </section>

      <section className="filters-bar" aria-label="Style filters">
        <div className="filters-heading">
          <span>Browse configurations</span>
          <strong>{filtered.length.toString().padStart(2, '0')} looks</strong>
        </div>
        <div className="filter-options">
          <button
            type="button"
            className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
          >
            All looks
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setFilter(tag)}
              aria-pressed={filter === tag}
            >
              {STYLE_LABELS[tag]}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No looks in this filter.</p>
          <button type="button" className="btn ghost" onClick={() => setFilter('all')}>
            Show all looks
          </button>
        </div>
      ) : (
        <div className="gallery-wall" id="look-grid">
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
                    alt={`${look.title} men’s look`}
                    className="wall-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                  <div className="wall-meta">
                    <div>
                      <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                      <h2 className="wall-title">{look.title}</h2>
                    </div>
                    <dl className="wall-facts">
                      <div>
                        <dt>Season</dt>
                        <dd>{look.season}</dd>
                      </div>
                      <div>
                        <dt>Use</dt>
                        <dd>{look.occasion}</dd>
                      </div>
                    </dl>
                    <span className="wall-arrow" aria-hidden="true">↗</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
