import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

function scrollToBrowse() {
  document.getElementById('browse-looks')?.scrollIntoView({ behavior: 'smooth' });
}

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

  const featured = looks[0];
  const spotlight = looks.slice(0, 3);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home home--cloudera">
      <section className="cdp-hero" aria-labelledby="home-hero-heading">
        <div className="cdp-hero-bg" aria-hidden>
          {featured && (
            <img src={featured.hero} alt="" className="cdp-hero-photo" />
          )}
          <div className="cdp-hero-scrim" />
          <div className="cdp-hero-pattern" />
        </div>
        <div className="cdp-hero-inner">
          <p className="cdp-brand-lockup">Studio Lookbook</p>
          <h1 id="home-hero-heading" className="cdp-hero-title">
            The hybrid edit for men&apos;s style — looks that travel with you.
          </h1>
          <p className="cdp-hero-lede">
            Curated outfits across five aesthetics. Filter, open detail, and
            save albums that stay in your browser.
          </p>
          <div className="cdp-hero-actions">
            <button
              type="button"
              className="cdp-btn cdp-btn--primary cdp-btn--lg"
              onClick={scrollToBrowse}
            >
              Explore the gallery
            </button>
            <Link to="/albums" className="cdp-btn cdp-btn--ghost cdp-btn--lg">
              View albums
            </Link>
          </div>
        </div>
      </section>

      <section
        id="why-studio"
        className="cdp-section cdp-section--muted"
        aria-labelledby="why-heading"
      >
        <div className="cdp-section-inner">
          <p className="cdp-kicker">Why Studio</p>
          <h2 id="why-heading" className="cdp-section-title">
            One platform for discovery, detail, and saved edits.
          </h2>
          <p className="cdp-section-lede">
            Built like a modern hybrid product home: clear hierarchy, strong
            calls to action, and paths into every look.
          </p>
          <ul className="cdp-capability-grid">
            <li className="cdp-capability">
              <span className="cdp-capability-icon" aria-hidden />
              <h3 className="cdp-capability-title">Style anywhere</h3>
              <p className="cdp-capability-text">
                Five aesthetic filters — minimal, street, tailored, athleisure,
                and workwear — so you land on the right silhouette fast.
              </p>
            </li>
            <li className="cdp-capability">
              <span className="cdp-capability-icon" aria-hidden />
              <h3 className="cdp-capability-title">Governed albums</h3>
              <p className="cdp-capability-text">
                Create named albums, add looks from detail pages, and keep
                capsules local — no account, no database.
              </p>
            </li>
            <li className="cdp-capability">
              <span className="cdp-capability-icon" aria-hidden />
              <h3 className="cdp-capability-title">Trusted detail</h3>
              <p className="cdp-capability-text">
                Open any tile for season, occasion, and key pieces — the full
                breakdown without cluttering the gallery.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section
        id="browse-looks"
        className="cdp-section"
        aria-labelledby="browse-heading"
      >
        <div className="cdp-section-inner">
          <div className="cdp-gallery-head">
            <div>
              <p className="cdp-kicker">What we do</p>
              <h2 id="browse-heading" className="cdp-section-title">
                Browse looks across every aesthetic.
              </h2>
            </div>
            <p className="cdp-gallery-count" role="status" aria-live="polite">
              {filtered.length}{' '}
              {filtered.length === 1 ? 'look' : 'looks'}
              {filter !== 'all' ? ` · ${STYLE_LABELS[filter]}` : ''}
            </p>
          </div>

          <div className="filters-bar" aria-label="Style filters">
            <button
              type="button"
              className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setFilter('all')}
              aria-pressed={filter === 'all'}
            >
              All looks
            </button>
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                className={filter === tag ? 'filter-pill active' : 'filter-pill'}
                onClick={() => setFilter(tag)}
                aria-pressed={filter === tag}
              >
                {STYLE_LABELS[tag]}
              </button>
            ))}
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
                      <h3 className="wall-title">{look.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {spotlight.length > 0 && (
        <section
          id="spotlight"
          className="cdp-section cdp-section--dark"
          aria-labelledby="spotlight-heading"
        >
          <div className="cdp-section-inner">
            <p className="cdp-kicker cdp-kicker--on-dark">In the spotlight</p>
            <h2 id="spotlight-heading" className="cdp-section-title cdp-section-title--on-dark">
              Latest looks from the seasonal edit.
            </h2>
            <ul className="cdp-spotlight-grid">
              {spotlight.map((look) => (
                <li key={look.id}>
                  <Link to={`/look/${look.id}`} className="cdp-spotlight-card">
                    <img src={look.hero} alt="" className="cdp-spotlight-img" />
                    <div className="cdp-spotlight-body">
                      <span className="cdp-spotlight-tag">
                        {STYLE_LABELS[look.tag]}
                      </span>
                      <h3 className="cdp-spotlight-title">{look.title}</h3>
                      <span className="cdp-spotlight-cta">
                        Read more <span aria-hidden>→</span>
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="cdp-cta-band" aria-labelledby="cta-heading">
        <div className="cdp-section-inner cdp-cta-band-inner">
          <div>
            <h2 id="cta-heading" className="cdp-cta-title">
              Ready to build your next edit?
            </h2>
            <p className="cdp-cta-lede">
              Start from the gallery, then save favorites into albums that
              survive a refresh.
            </p>
          </div>
          <div className="cdp-hero-actions">
            <button
              type="button"
              className="cdp-btn cdp-btn--primary cdp-btn--lg"
              onClick={scrollToBrowse}
            >
              Start browsing
            </button>
            <Link to="/albums" className="cdp-btn cdp-btn--ghost-dark cdp-btn--lg">
              Open albums
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
