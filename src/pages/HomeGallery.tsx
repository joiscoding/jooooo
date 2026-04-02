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

  const heroLook = looks[0];
  const featuredLooks = looks.slice(1, 3);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      {heroLook && (
        <Link to={`/look/${heroLook.id}`} style={{ textDecoration: 'none' }}>
          <section className="home-hero">
            <img
              src={heroLook.hero}
              alt=""
              className="hero-image"
            />
            <div className="hero-content">
              <p className="eyebrow">Spring / Summer 2026</p>
              <h1 className="home-title">
                Looks Built for <em>Quiet</em> Confidence
              </h1>
              <span className="hero-cta">
                Explore the Collection
              </span>
            </div>
          </section>
        </Link>
      )}

      {featuredLooks.length === 2 && (
        <div className="editorial-two-up">
          {featuredLooks.map((look) => (
            <Link
              key={look.id}
              to={`/look/${look.id}`}
              className="editorial-card"
              style={{ textDecoration: 'none' }}
            >
              <img src={look.hero} alt="" />
              <div className="editorial-card-content">
                <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                <h2 className="wall-title">{look.title}</h2>
                <span className="wall-card-cta">Shop Now</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="section-header">
        <p className="section-label">Studio Lookbook</p>
        <h2 className="section-title">The World of Style</h2>
      </div>

      <section className="filters-bar" aria-label="Style filters">
        <button
          type="button"
          className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
          onClick={() => setFilter('all')}
        >
          All Looks
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

      {filtered.length === 0 ? (
        <p className="empty-state">No looks in this filter.</p>
      ) : (
        <div className="gallery-wall">
          {filtered.map((look, i) => (
            <Link
              key={look.id}
              to={`/look/${look.id}`}
              className="wall-card"
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
                  <span className="wall-card-cta">View Look</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
