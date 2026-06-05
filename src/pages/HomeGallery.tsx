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

  const featuredLook = useMemo(
    () => looks.find((look) => look.tag === 'classic') ?? looks[0],
    [looks],
  );

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
        <div className="home-hero-copy">
          <p className="eyebrow">Men · Estate edit</p>
          <h1 className="home-title">
            American ease, tailored for <em>quiet</em> confidence.
          </h1>
          <p className="home-dek">
            A curated wardrobe of tweed textures, brushed cotton, polished
            knits, and weekend layers with a country-club sense of restraint.
          </p>
          <div className="hero-actions" aria-label="Featured collection links">
            <a href="#seasonal-gallery" className="hero-cta primary">
              Shop the edit
            </a>
            {featuredLook ? (
              <Link
                to={`/look/${featuredLook.id}`}
                className="hero-cta secondary"
              >
                View featured look
              </Link>
            ) : null}
          </div>
        </div>
        {featuredLook ? (
          <Link
            to={`/look/${featuredLook.id}`}
            className="home-hero-card"
            aria-label={`View featured look: ${featuredLook.title}`}
          >
            <img
              src={featuredLook.hero}
              alt={featuredLook.title}
              className="home-hero-img"
            />
            <span className="hero-card-kicker">Featured look</span>
            <span className="hero-card-title">{featuredLook.title}</span>
          </Link>
        ) : null}
      </section>

      <section
        id="seasonal-gallery"
        className="filters-bar"
        aria-label="Style filters"
      >
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
                aria-label={`View look: ${look.title}`}
              >
                <div className="wall-card-inner">
                  <img
                    key={`${look.id}-${look.hero}`}
                    src={look.hero}
                    alt={look.title}
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
