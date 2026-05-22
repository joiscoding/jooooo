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
      <section className="home-hero-abc" aria-labelledby="home-hero-heading">
        <div className="home-hero-abc-inner">
          <p className="eyebrow-abc">Member experience · Seasonal edit</p>
          <h1 id="home-hero-heading" className="home-title-abc">
            Transform your studio with looks members remember.
          </h1>
          <p className="home-lead-abc">
            A connected gallery for merchandising and campaigns — filter by
            vibe, ship cohesive drops, and keep your brand feeling as intentional
            as the best fitness platforms feel for members.
          </p>
          <div className="home-hero-ctas">
            <a className="btn-abc-primary" href="#contact">
              Get demo &amp; pricing
            </a>
            <a className="btn-abc-secondary" href="#gallery">
              Explore the gallery
            </a>
          </div>
        </div>
        <div className="home-hero-visual" aria-hidden="true">
          <div className="home-hero-orbit" />
          <div className="home-hero-glow" />
        </div>
      </section>

      <section className="home-stats" aria-label="Highlights">
        <div className="home-stat">
          <span className="home-stat-value">40+</span>
          <span className="home-stat-label">curated looks</span>
        </div>
        <div className="home-stat">
          <span className="home-stat-value">12</span>
          <span className="home-stat-label">style tags</span>
        </div>
        <div className="home-stat">
          <span className="home-stat-value">100%</span>
          <span className="home-stat-label">responsive grid</span>
        </div>
        <div className="home-stat">
          <span className="home-stat-value">0</span>
          <span className="home-stat-label">login friction (demo)</span>
        </div>
      </section>

      <section id="gallery" className="home-gallery-region">
        <header className="home-section-head">
          <h2 className="home-section-title">Tailored looks for every moment</h2>
          <p className="home-section-sub">
            Pick a lane, browse the wall, and open a look for full styling notes —
            same scan-and-drill pattern you see on modern SaaS homepages.
          </p>
        </header>

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
      </section>

      <section id="contact" className="home-bottom-cta" aria-label="Contact">
        <h2 className="home-bottom-cta-title">Learn more about this demo</h2>
        <p className="home-bottom-cta-copy">
          This page mirrors the rhythm of enterprise fitness software marketing:
          bold hero, proof points, product bands, and a closing call-to-action.
        </p>
        <Link
          to="/albums"
          className="btn-abc-primary btn-abc-primary--dark"
        >
          Open albums
        </Link>
      </section>
    </div>
  );
}
