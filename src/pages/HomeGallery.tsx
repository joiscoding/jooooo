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

  const heroLook = useMemo(
    () => looks.find((look) => look.tag === 'athleisure') ?? looks[0],
    [looks],
  );

  const featureLook = useMemo(
    () => looks.find((look) => look.tag === 'minimal') ?? looks[1] ?? looks[0],
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
        <div className="hero-copy">
          <p className="eyebrow">Men's gear · Designed for movement</p>
          <h1 className="home-title">Train hard. Move easy. Stay ready.</h1>
          <p className="home-intro">
            Technical layers, polished fits, and all-day staples for workouts,
            commutes, and everywhere after.
          </p>
          <div className="hero-actions" aria-label="Landing page actions">
            <a className="hero-button primary" href="#shop-edit">
              Shop the edit
            </a>
            <Link className="hero-button ghost" to="/albums">
              Build a kit
            </Link>
          </div>
        </div>
        {heroLook ? (
          <Link
            className="hero-visual"
            to={`/look/${heroLook.id}`}
            aria-label={`View ${heroLook.title}`}
          >
            <img src={heroLook.hero} alt="" className="hero-img" />
            <div className="hero-visual-card">
              <span>{STYLE_LABELS[heroLook.tag]}</span>
              <strong>{heroLook.title}</strong>
            </div>
          </Link>
        ) : null}
      </section>

      <section className="benefit-strip" aria-label="Shopping benefits">
        <div>
          <span>Free hemming</span>
          <strong>Dial in the fit</strong>
        </div>
        <div>
          <span>Performance fabrics</span>
          <strong>Sweat-ready comfort</strong>
        </div>
        <div>
          <span>Everyday versatility</span>
          <strong>Gym to city</strong>
        </div>
      </section>

      {featureLook ? (
        <section className="feature-banner">
          <div className="feature-copy">
            <p className="eyebrow">New arrivals</p>
            <h2>Sharp layers with room to move.</h2>
            <p>
              Lightweight textures and clean lines make this capsule easy to
              wear before, during, and after the workday.
            </p>
          </div>
          <Link className="feature-link" to={`/look/${featureLook.id}`}>
            Explore {featureLook.title}
          </Link>
        </section>
      ) : null}

      <section id="shop-edit" className="shop-section">
        <div className="section-head">
          <p className="eyebrow">Shop by intent</p>
          <h2>Find the look that works as hard as you do.</h2>
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
                      <span className="wall-tag">
                        {STYLE_LABELS[look.tag]}
                      </span>
                      <h2 className="wall-title">{look.title}</h2>
                      <span className="wall-cta">View look</span>
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
