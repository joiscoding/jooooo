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
    looks.find((l) => l.id === 'city-charcoal') ??
    looks.find((l) => l.tag === 'classic') ??
    looks[0];

  if (loading) {
    return (
      <div className="home">
        <section className="home-hero-cinematic home-hero-cinematic--loading">
          <div className="hero-veil" aria-hidden="true" />
          <p className="muted">Loading lookbook…</p>
        </section>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="home-hero-cinematic" aria-label="Introduction">
        {featured ? (
          <img src={featured.hero} alt="" className="hero-bg" />
        ) : null}
        <div className="hero-veil" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">Men / Seasonal edit</p>
          <h1 className="home-title">Looks</h1>
          <p className="hero-lede">Built for quiet confidence.</p>
          <p className="hero-metrics">
            <span>{looks.length} looks</span>
            <span className="hero-metrics-dot" aria-hidden="true">
              /
            </span>
            <span>5 styles</span>
            <span className="hero-metrics-dot" aria-hidden="true">
              /
            </span>
            <span>Local albums</span>
          </p>
          <div className="hero-actions">
            <a href="#collection" className="btn primary">
              Enter gallery
            </a>
            <Link to="/albums" className="btn ghost">
              Albums
            </Link>
          </div>
        </div>
        <a href="#collection" className="hero-scroll">
          <span className="sr-only">Scroll to collection</span>
          <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section id="collection" className="collection-band" aria-label="Lookbook collection">
        <header className="collection-head">
          <p className="eyebrow">The collection</p>
          <h2 className="collection-title">Every look, one wall.</h2>
        </header>

        <div className="filters-bar" aria-label="Style filters">
          <button
            type="button"
            className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All looks
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'filter-pill active' : 'filter-pill'}
              aria-pressed={filter === tag}
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
            {filtered.map((look, i) => {
              return (
                <Link key={look.id} to={`/look/${look.id}`} className="wall-card">
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
      </section>
    </div>
  );
}
