import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

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

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className={`home-hero ${heroReady ? 'is-ready' : ''}`}>
        {heroLook ? (
          <img
            src={heroLook.hero}
            alt=""
            className="home-hero-image"
            onLoad={() => setHeroReady(true)}
          />
        ) : null}
        <div className="home-hero-plane" aria-hidden="true" />
        <div className="home-hero-copy">
          <p className="home-brand">Studio</p>
          <h1 className="home-title">New season for him</h1>
          <p className="home-lede">
            Sharp silhouettes and quiet layers — shop the lookbook edit.
          </p>
          <div className="home-cta-group">
            <a className="home-cta" href="#looks">
              View collection
            </a>
            {heroLook ? (
              <Link className="home-cta home-cta-ghost" to={`/look/${heroLook.id}`}>
                Open look
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="looks-section" id="looks" aria-label="Looks">
        <div className="looks-section-head">
          <h2 className="looks-section-title">Man</h2>
          <nav className="filters-bar" aria-label="Style filters">
            <button
              type="button"
              className={filter === 'all' ? 'filter-link active' : 'filter-link'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                className={filter === tag ? 'filter-link active' : 'filter-link'}
                onClick={() => setFilter(tag)}
              >
                {STYLE_LABELS[tag]}
              </button>
            ))}
          </nav>
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
                style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
              >
                <div className="wall-media">
                  <img
                    key={`${look.id}-${look.hero}`}
                    src={look.hero}
                    alt=""
                    className="wall-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                </div>
                <div className="wall-meta">
                  <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                  <h3 className="wall-title">{look.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
