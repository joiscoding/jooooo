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

  if (loading) {
    return (
      <div className="home home-rl">
        <section className="home-hero-full home-hero-full--loading" aria-label="Hero">
          <div className="home-hero-content">
            <p className="home-hero-eyebrow">Men · Seasonal edit</p>
            <h1 className="home-hero-headline">Loading lookbook…</h1>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="home home-rl">
      <section className="home-hero-full" aria-label="Hero">
        {heroLook ? (
          <img
            className="home-hero-bg"
            src={heroLook.hero}
            alt=""
            loading="eager"
            fetchPriority="high"
          />
        ) : null}
        <div className="home-hero-overlay" aria-hidden />
        <div className="home-hero-content">
          <p className="home-hero-eyebrow">Men · Seasonal edit</p>
          <h1 className="home-hero-headline">
            The art of <em>effortless</em> elegance.
          </h1>
          <p className="home-hero-sub">
            Curated looks for refined everyday dressing — classic proportion,
            quiet confidence.
          </p>
          <a href="#lookbook" className="home-hero-cta">
            Explore the collection
          </a>
        </div>
      </section>

      <div className="home-inner" id="lookbook">
      <section className="home-section-intro" aria-labelledby="lookbook-heading">
        <p className="home-section-kicker">The collection</p>
        <h2 id="lookbook-heading" className="home-section-title">
          Shop the edit
        </h2>
        <p className="home-section-lede">
          Filter by mood — each look is styled as a complete idea you can make
          your own.
        </p>
      </section>

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
