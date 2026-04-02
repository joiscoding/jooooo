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

  const heroLook = looks[0];
  const featuredLooks = looks.slice(1, 4);
  const categoryLooks = STYLE_ORDER.map((tag) => {
    const match = looks.find((l) => l.tag === tag);
    return match ? { tag, look: match } : null;
  }).filter(Boolean) as { tag: StyleTag; look: Look }[];

  return (
    <div className="home">
      {/* Full-bleed hero banner */}
      {heroLook && (
        <section className="rl-hero">
          <div className="rl-hero-image-wrap">
            <img
              src={heroLook.hero}
              alt=""
              className="rl-hero-image"
            />
            <div className="rl-hero-overlay" />
            <div className="rl-hero-content">
              <p className="rl-hero-eyebrow">Spring / Summer 2026</p>
              <h1 className="rl-hero-title">
                Looks built for <em>quiet</em> confidence
              </h1>
              <p className="rl-hero-subtitle">
                The refined energy of modern style inspires a new vision of timeless menswear
              </p>
              <div className="rl-hero-actions">
                <Link to={`/look/${heroLook.id}`} className="rl-btn-primary">
                  Explore Now
                </Link>
                <button
                  type="button"
                  className="rl-btn-outline"
                  onClick={() => {
                    document.querySelector('.rl-editorial')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Shop Looks
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured editorial blocks (2-up / asymmetric) */}
      {featuredLooks.length >= 2 && (
        <section className="rl-editorial">
          <div className="rl-editorial-grid">
            <Link to={`/look/${featuredLooks[0].id}`} className="rl-editorial-card rl-editorial-large">
              <img src={featuredLooks[0].hero} alt="" className="rl-editorial-img" />
              <div className="rl-editorial-overlay">
                <span className="rl-editorial-label">{STYLE_LABELS[featuredLooks[0].tag]}</span>
                <h2 className="rl-editorial-title">{featuredLooks[0].title}</h2>
                <span className="rl-editorial-cta">Explore Now</span>
              </div>
            </Link>
            <div className="rl-editorial-stack">
              {featuredLooks.slice(1, 3).map((look) => (
                <Link key={look.id} to={`/look/${look.id}`} className="rl-editorial-card">
                  <img src={look.hero} alt="" className="rl-editorial-img" />
                  <div className="rl-editorial-overlay">
                    <span className="rl-editorial-label">{STYLE_LABELS[look.tag]}</span>
                    <h2 className="rl-editorial-title">{look.title}</h2>
                    <span className="rl-editorial-cta">Explore Now</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Horizontal category strip */}
      <section className="rl-categories">
        <div className="rl-categories-scroll">
          {categoryLooks.map(({ tag, look }) => (
            <button
              key={tag}
              type="button"
              className={`rl-category-card ${filter === tag ? 'active' : ''}`}
              onClick={() => setFilter(filter === tag ? 'all' : tag)}
            >
              <div className="rl-category-img-wrap">
                <img src={look.hero} alt="" className="rl-category-img" />
              </div>
              <span className="rl-category-name">{STYLE_LABELS[tag].split(' / ')[0]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Gallery grid with filter */}
      <section className="rl-gallery-section">
        <div className="rl-gallery-header">
          <h2 className="rl-gallery-heading">
            {filter === 'all' ? 'All Looks' : STYLE_LABELS[filter]}
          </h2>
          <div className="filters-bar" role="group" aria-label="Style filters">
            <button
              type="button"
              className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                className={filter === tag ? 'filter-pill active' : 'filter-pill'}
                onClick={() => setFilter(tag)}
              >
                {STYLE_LABELS[tag].split(' / ')[0]}
              </button>
            ))}
          </div>
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
                    <h2 className="wall-title">{look.title}</h2>
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
