import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLooks()
      .then((data) => {
        if (!cancelled) {
          setLooks(data);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
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

  if (error) {
    return (
      <div className="page-loading" role="alert">
        <p>We couldn’t load the lookbook. Please refresh and try again.</p>
      </div>
    );
  }

  const featured = looks[0];
  const filterLabel =
    filter === 'all' ? 'all styles' : STYLE_LABELS[filter].toLowerCase();

  return (
    <div className="home">
      {featured && (
        <section className="home-hero" aria-labelledby="hero-title">
          <img className="hero-media" src={featured.hero} alt="" />
          <div className="hero-scrim" />
          <div className="hero-content">
            <p className="eyebrow">Men · Seasonal edit 2026</p>
            <h1 className="home-title" id="hero-title">
              Looks built for <em>quiet</em> confidence.
            </h1>
            <p className="hero-copy">
              A considered wardrobe of modern layers, precise tailoring, and
              easy essentials for every part of the day.
            </p>
            <Link className="hero-cta" to={`/look/${featured.id}`}>
              Explore the edit <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      )}

      <section className="gallery-section" aria-labelledby="collection-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">The collection</p>
            <h2 id="collection-title">Find your next look</h2>
          </div>
          <p className="results-count" role="status" aria-live="polite">
            {filtered.length} {filterLabel} {filtered.length === 1 ? 'look' : 'looks'}
          </p>
        </div>

        <div className="filters-bar" aria-label="Style filters">
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

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <ul className="gallery-wall">
            {filtered.map((look, i) => {
              return (
                <li key={look.id}>
                  <Link to={`/look/${look.id}`} className="wall-card">
                    <div className="wall-card-inner">
                      <div className="wall-media">
                        <img
                          key={`${look.id}-${look.hero}`}
                          src={look.hero}
                          alt=""
                          className="wall-img"
                          loading={i < 3 ? 'eager' : 'lazy'}
                        />
                      </div>
                      <div className="wall-meta">
                        <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                        <h3 className="wall-title">{look.title}</h3>
                        <span className="wall-link">
                          View look <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
