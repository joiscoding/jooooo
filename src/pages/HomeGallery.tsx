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
  const featuredLooks = looks.slice(1, 3);
  const editorialLook = looks[3];

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading collection…</p>
      </div>
    );
  }

  return (
    <div className="home">
      {heroLook && (
        <section className="rl-hero" aria-label="Hero">
          <img
            src={heroLook.hero}
            alt=""
            className="rl-hero-img"
            loading="eager"
          />
          <div className="rl-hero-overlay" />
          <div className="rl-hero-content">
            <p className="rl-eyebrow">Spring 2026 · Men</p>
            <h1 className="rl-hero-title">
              The Art
              <br />
              of Living
            </h1>
            <p className="rl-hero-sub">
              A curated edit of timeless silhouettes, refined fabrics, and
              quiet confidence — inspired by the American classic.
            </p>
            <Link to={`/look/${heroLook.id}`} className="rl-cta">
              Discover the Collection
            </Link>
          </div>
        </section>
      )}

      <section className="rl-heritage" aria-label="Heritage">
        <div className="rl-heritage-inner">
          <blockquote className="rl-quote">
            &ldquo;Style is very personal. It has nothing to do with fashion.
            Fashion is over quickly. Style is forever.&rdquo;
          </blockquote>
          <cite className="rl-cite">— Ralph Lauren</cite>
        </div>
      </section>

      {featuredLooks.length >= 2 && (
        <section className="rl-featured" aria-label="Featured looks">
          <div className="rl-section-head">
            <p className="rl-eyebrow">Featured</p>
            <h2 className="rl-section-title">Seasonal Edit</h2>
          </div>
          <div className="rl-featured-grid">
            {featuredLooks.map((look) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="rl-featured-card"
              >
                <div className="rl-featured-img-wrap">
                  <img src={look.hero} alt="" className="rl-featured-img" />
                </div>
                <div className="rl-featured-meta">
                  <span className="rl-card-tag">{STYLE_LABELS[look.tag]}</span>
                  <h3 className="rl-card-title">{look.title}</h3>
                  <span className="rl-card-link">View Look</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {editorialLook && (
        <section className="rl-editorial" aria-label="Editorial">
          <div className="rl-editorial-img-wrap">
            <img
              src={editorialLook.hero}
              alt=""
              className="rl-editorial-img"
            />
          </div>
          <div className="rl-editorial-copy">
            <p className="rl-eyebrow">The World of</p>
            <h2 className="rl-editorial-title">
              American
              <br />
              Style
            </h2>
            <p className="rl-editorial-text">
              From tailored classics to relaxed weekend wear, each look tells a
              story of craftsmanship and enduring elegance. Explore pieces
              designed for the man who values quality over trends.
            </p>
            <Link to={`/look/${editorialLook.id}`} className="rl-cta rl-cta--dark">
              Explore {editorialLook.title}
            </Link>
          </div>
        </section>
      )}

      <section className="rl-gallery-section" aria-label="Full lookbook">
        <div className="rl-gallery-head">
          <div>
            <p className="rl-eyebrow">Complete Lookbook</p>
            <h2 className="rl-section-title">All Looks</h2>
          </div>
          <nav className="rl-filters" aria-label="Style filters">
            <button
              type="button"
              className={filter === 'all' ? 'rl-filter active' : 'rl-filter'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                className={filter === tag ? 'rl-filter active' : 'rl-filter'}
                onClick={() => setFilter(tag)}
              >
                {STYLE_LABELS[tag].split(' / ')[0]}
              </button>
            ))}
          </nav>
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div className="rl-gallery">
            {filtered.map((look, i) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="rl-gallery-card"
              >
                <div className="rl-gallery-img-wrap">
                  <img
                    src={look.hero}
                    alt=""
                    className="rl-gallery-img"
                    loading={i < 6 ? 'eager' : 'lazy'}
                  />
                </div>
                <div className="rl-gallery-meta">
                  <span className="rl-card-tag">{STYLE_LABELS[look.tag]}</span>
                  <h3 className="rl-card-title">{look.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
