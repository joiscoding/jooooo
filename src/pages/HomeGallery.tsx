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
    return looks.filter((look) => look.tag === filter);
  }, [looks, filter]);

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
        <div className="hero-index" aria-hidden="true">01 / 05</div>
        <div className="hero-copy">
          <p className="eyebrow">Men · Seasonal edit</p>
          <h1 className="home-title">
            Looks built for <em>quiet</em> confidence.
          </h1>
          <p className="hero-note">Modern style, designed to last.</p>
        </div>
        <div className="hero-geometry" aria-hidden="true">
          <span />
          <span />
          <b>SS / 26</b>
        </div>
      </section>

      <section className="filters-bar" aria-label="Style filters">
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
      </section>

      {filtered.length === 0 ? (
        <p className="empty-state">No looks in this filter.</p>
      ) : (
        <div className="gallery-wall">
          {filtered.map((look, index) => (
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
                  loading={index < 4 ? 'eager' : 'lazy'}
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
    </div>
  );
}
