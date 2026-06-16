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

  const featured = looks[0];

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">Men · Seasonal edit</p>
          <h1 className="hero-title">
            Looks built for <em>quiet</em> confidence.
          </h1>
          <p className="hero-lead">
            A calm, image-led wardrobe edit. Browse outfit-first looks across
            five aesthetics, then save the ones that feel like you into albums.
          </p>
          <div className="hero-actions">
            <a href="#gallery" className="btn-pill primary">
              Browse the gallery
            </a>
            <Link to="/albums" className="btn-pill ghost">
              Your albums
            </Link>
          </div>
        </div>
      </section>

      {featured && (
        <section className="feature" aria-label="Featured look">
          <Link to={`/look/${featured.id}`} className="feature-card">
            <div className="feature-media">
              <img src={featured.hero} alt="" loading="eager" />
            </div>
            <div className="feature-body">
              <span className="pill-tag">{STYLE_LABELS[featured.tag]}</span>
              <h2 className="feature-title">{featured.title}</h2>
              <p className="feature-meta">
                {featured.season} · {featured.occasion}
              </p>
              <p className="feature-items">
                {featured.keyItems.join(' · ')}
              </p>
              <span className="feature-cta">View the look →</span>
            </div>
          </Link>
        </section>
      )}

      <section className="gallery-section" id="gallery">
        <div className="section-head">
          <h2 className="section-title">The gallery</h2>
          <p className="section-sub">
            {filtered.length} {filtered.length === 1 ? 'look' : 'looks'}
          </p>
        </div>

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
                    <h3 className="wall-title">{look.title}</h3>
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
