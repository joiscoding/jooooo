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
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="home-hero">
        <p className="eyebrow">Men · Seasonal Edit</p>
        <h1 className="home-title">
          Transform your style with <em>curated</em> looks
        </h1>
        <p className="home-subtitle">
          Discover outfit inspiration across every aesthetic — from minimal to
          streetwear. Your next look starts here.
        </p>
        <Link to="#gallery" className="hero-cta" onClick={(e) => {
          e.preventDefault();
          document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          Explore Looks
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{looks.length}+</span>
            <span className="stat-label">Curated Looks</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">5</span>
            <span className="stat-label">Style Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">100%</span>
            <span className="stat-label">Free to Browse</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">∞</span>
            <span className="stat-label">Inspiration</span>
          </div>
        </div>
      </section>

      <div id="gallery">
        <div className="section-header">
          <h2 className="section-title">Browse Looks</h2>
          <span className="section-subtitle">{filtered.length} looks</span>
        </div>

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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
