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

  const featuredLooks = filtered.slice(0, 3);
  const heroLook = filtered[0] ?? looks[0];
  const collectionLabel =
    filter === 'all' ? 'All looks' : STYLE_LABELS[filter];

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero-copy">
          <p className="eyebrow">Studio Lookbook</p>
          <h1 id="home-hero-title" className="home-title">
            Considered dressing for every version of the day.
          </h1>
          <p className="home-subtitle">
            A quiet, editorial menswear system for exploring silhouettes,
            saving references, and building personal albums from seasonal
            looks.
          </p>
          <div className="home-actions" aria-label="Landing page actions">
            <a className="text-cta" href="#collection">
              Explore collection
            </a>
            <Link className="text-cta secondary" to="/albums">
              Build an album
            </Link>
          </div>
        </div>

        {heroLook ? (
          <Link to={`/look/${heroLook.id}`} className="hero-look-card">
            <img src={heroLook.hero} alt="" className="hero-look-img" />
            <div className="hero-look-meta">
              <span>{STYLE_LABELS[heroLook.tag]}</span>
              <strong>{heroLook.title}</strong>
              <small>
                {heroLook.season} · {heroLook.occasion}
              </small>
            </div>
          </Link>
        ) : null}
      </section>

      <section className="collection-strip" aria-label="Collection summary">
        <div>
          <span className="strip-label">Current edit</span>
          <strong>{collectionLabel}</strong>
        </div>
        <div>
          <span className="strip-label">Looks</span>
          <strong>{filtered.length}</strong>
        </div>
        <div>
          <span className="strip-label">Method</span>
          <strong>Filter, inspect, save</strong>
        </div>
      </section>

      <section className="style-index" aria-label="Style filters">
        <div>
          <p className="eyebrow">Style index</p>
          <h2>Choose a mood, then refine the details.</h2>
        </div>
        <div className="filters-bar">
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
      </section>

      {featuredLooks.length > 0 ? (
        <section className="spotlight-grid" aria-label="Featured looks">
          {featuredLooks.map((look) => (
            <Link
              key={`featured-${look.id}`}
              to={`/look/${look.id}`}
              className="spotlight-card"
            >
              <img src={look.hero} alt="" className="spotlight-img" />
              <div>
                <span>{STYLE_LABELS[look.tag]}</span>
                <h2>{look.title}</h2>
                <p>
                  {look.keyItems.slice(0, 2).join(' · ')} for {look.occasion}.
                </p>
              </div>
            </Link>
          ))}
        </section>
      ) : null}

      <section id="collection" className="collection-section">
        <div className="section-heading">
          <p className="eyebrow">Collection</p>
          <h2>{collectionLabel}</h2>
          <p>
            Open each look for seasonal context, key pieces, and album controls.
          </p>
        </div>

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
      </section>
    </div>
  );
}
