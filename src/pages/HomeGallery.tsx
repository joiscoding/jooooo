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

  const featuredLook = filtered[0] ?? looks[0];
  const updateLooks = (filtered.length > 0 ? filtered : looks).slice(0, 3);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home home-ir">
      <section className="ir-hero">
        <div className="ir-hero-copy">
          <p className="eyebrow">Investor Home</p>
          <h1 className="home-title">
            Seasonal style intelligence, presented with investor-grade clarity.
          </h1>
          <p className="home-dek">
            A polished view of curated looks, recent releases, and wardrobe
            categories inspired by the structured Kingsoft investor relations
            experience.
          </p>
          <div className="ir-hero-actions">
            <a href="#featured-items" className="ir-button primary">
              Featured items
            </a>
            <a href="#look-gallery" className="ir-button secondary">
              View gallery
            </a>
          </div>
        </div>

        {featuredLook ? (
          <Link to={`/look/${featuredLook.id}`} className="ir-feature-card">
            <img
              src={featuredLook.hero}
              alt=""
              className="ir-feature-img"
              loading="eager"
            />
            <div className="ir-feature-overlay">
              <span className="wall-tag">{STYLE_LABELS[featuredLook.tag]}</span>
              <h2 className="wall-title">{featuredLook.title}</h2>
              <p>{featuredLook.season} · {featuredLook.occasion}</p>
            </div>
          </Link>
        ) : null}
      </section>

      <section className="ir-stats" aria-label="Lookbook overview">
        <article>
          <span>{looks.length}</span>
          <p>Total looks</p>
        </article>
        <article>
          <span>{STYLE_ORDER.length}</span>
          <p>Style categories</p>
        </article>
        <article>
          <span>{filtered.length}</span>
          <p>Current selection</p>
        </article>
      </section>

      <section className="ir-content-grid">
        <article className="corporate-card">
          <p className="eyebrow">Corporate Profile</p>
          <h2>Studio Lookbook curates dependable wardrobe direction.</h2>
          <p>
            Each edit combines silhouette, season, and occasion data into a
            clear discovery flow, echoing the crisp information hierarchy of a
            public-company investor page.
          </p>
        </article>

        <aside className="ir-updates" id="featured-items">
          <div className="section-heading compact">
            <p className="eyebrow">Featured Items</p>
            <h2>Recent releases</h2>
          </div>
          <ul>
            {updateLooks.map((look) => (
              <li key={look.id}>
                <Link to={`/look/${look.id}`}>
                  <span>{STYLE_LABELS[look.tag]}</span>
                  {look.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
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

      <section className="gallery-section" id="look-gallery">
        <div className="section-heading">
          <p className="eyebrow">Press Releases</p>
          <h2>Latest look releases</h2>
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
