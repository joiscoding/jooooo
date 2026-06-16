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
        <div className="home-hero-media">
          <img
            src="/looks/1768809250854-2f4b1e8f19cc-w1200h1600.jpg"
            alt=""
            className="home-hero-img"
          />
          <div className="home-hero-overlay">
            <p className="eyebrow eyebrow-light">The Autumn Collection · Men</p>
            <h1 className="home-title">
              An enduring <em>heritage</em>,<br />tailored for today.
            </h1>
            <p className="home-hero-sub">
              Crafted silhouettes, considered neutrals, and the quiet
              confidence of timeless menswear.
            </p>
            <a href="#gallery" className="hero-cta">
              Explore the Lookbook
            </a>
          </div>
        </div>
      </section>

      <section className="home-intro">
        <p className="home-intro-eyebrow">Established in the spirit of craft</p>
        <h2 className="home-intro-title">
          Looks built for <em>quiet</em> confidence.
        </h2>
        <p className="home-intro-body">
          A curated wardrobe of seasonal looks — from tailored classics to
          relaxed weekend ease. Browse by aesthetic and save your favorites
          to a personal atelier.
        </p>
      </section>

      <section
        id="gallery"
        className="filters-bar"
        aria-label="Style filters"
      >
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
  );
}
