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
        <p className="muted">Loading…</p>
      </div>
    );
  }

  const heroLook = looks[0];
  const splitLooks = looks.slice(1, 3);

  return (
    <div className="zara-home">
      {heroLook && (
        <section className="z-hero" aria-label="Featured editorial">
          <Link to={`/look/${heroLook.id}`} className="z-hero-media">
            <img
              src={heroLook.hero}
              alt={heroLook.title}
              className="z-hero-img"
              loading="eager"
            />
          </Link>
          <div className="z-hero-overlay">
            <p className="z-eyebrow z-eyebrow--light">Man · Studio Collection</p>
            <p className="z-hero-caption">Spring / Summer Editorial</p>
            <Link to={`/look/${heroLook.id}`} className="z-link z-link--light">
              View Editorial
            </Link>
          </div>
        </section>
      )}

      <section className="z-section">
        <header className="z-section-bar">
          <h2 className="z-section-title">New In · Studio Lookbook</h2>
          <Link to="/albums" className="z-link">View All</Link>
        </header>

        <nav className="z-filter-strip" aria-label="Style filters">
          <button
            type="button"
            className={filter === 'all' ? 'z-filter active' : 'z-filter'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'z-filter active' : 'z-filter'}
              onClick={() => setFilter(tag)}
            >
              {STYLE_LABELS[tag].split(' / ')[0]}
            </button>
          ))}
        </nav>

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div className="z-editorial-grid">
            {filtered.map((look, i) => {
              const isLarge = i % 5 === 0;
              return (
                <Link
                  key={look.id}
                  to={`/look/${look.id}`}
                  className={
                    isLarge ? 'z-tile z-tile--full' : 'z-tile z-tile--half'
                  }
                >
                  <div className="z-tile-media">
                    <img
                      src={look.hero}
                      alt={look.title}
                      className="z-tile-img"
                      loading={i < 2 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="z-tile-caption">
                    <span className="z-tile-num">
                      {String(i + 1).padStart(2, '0')} ·{' '}
                      {STYLE_LABELS[look.tag].split(' / ')[0].toUpperCase()}
                    </span>
                    <h3 className="z-tile-title">{look.title}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {splitLooks.length === 2 && (
        <section className="z-split" aria-label="Campaign split">
          {splitLooks.map((look) => (
            <Link key={look.id} to={`/look/${look.id}`} className="z-split-tile">
              <img
                src={look.hero}
                alt={look.title}
                className="z-split-img"
                loading="lazy"
              />
              <div className="z-split-caption">
                <span className="z-eyebrow">
                  {STYLE_LABELS[look.tag].split(' / ')[0]}
                </span>
                <h3 className="z-split-title">{look.title}</h3>
                <span className="z-link">Discover →</span>
              </div>
            </Link>
          ))}
        </section>
      )}

      <section className="z-newsletter">
        <div className="z-newsletter-inner">
          <p className="z-eyebrow">Studio Newsletter</p>
          <h2 className="z-newsletter-title">
            Be the first to know.
          </h2>
          <p className="z-newsletter-sub">
            New collections, editorials and member previews — delivered weekly.
          </p>
          <form
            className="z-newsletter-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              aria-label="Email address"
              className="z-input"
            />
            <button type="submit" className="z-btn">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
