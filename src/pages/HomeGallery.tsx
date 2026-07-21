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

  const featured =
    looks.find((l) => l.id === 'boardroom-soft') ?? looks[0];

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="hero-vp" aria-labelledby="hero-heading">
        <div className="hero-vp__copy">
          <p className="hero-vp__brand">Studio Lookbook</p>
          <h1 id="hero-heading" className="hero-vp__title">
            Quiet confidence, season by season.
          </h1>
          <p className="hero-vp__lede">
            A curated edit of men’s looks — minimal, tailored, and everything
            between.
          </p>
          <div className="hero-vp__cta">
            <a href="#gallery" className="btn btn-primary">
              Browse looks
            </a>
            <Link to="/albums" className="btn btn-secondary">
              Your albums →
            </Link>
          </div>
        </div>
        {featured ? (
          <div className="hero-vp__media" aria-hidden="true">
            <img
              src={featured.hero}
              alt=""
              className="hero-vp__img"
              fetchPriority="high"
            />
          </div>
        ) : null}
      </section>

      <section
        id="gallery"
        className="gallery-section"
        aria-label="Look gallery"
      >
        <div className="filters-bar" aria-label="Style filters">
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
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div className="gallery-wall gallery-wall--offset" key={filter}>
            {filtered.map((look, i) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className={`wall-card wall-card--offset-${i % 6}`}
                style={{ ['--i' as string]: i }}
              >
                <div className="wall-card-inner">
                  <img
                    key={`${look.id}-${look.hero}`}
                    src={look.hero}
                    alt=""
                    className="wall-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                  <div className="wall-meta">
                    <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                    <h2 className="wall-title">{look.title}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
