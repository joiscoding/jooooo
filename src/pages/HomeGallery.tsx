import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const HERO_IMAGE = '/looks/1768809250854-2f4b1e8f19cc-w1200h1600.jpg';

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

  return (
    <div className="home">
      <section className="landing-hero" aria-label="Studio Lookbook">
        <div className="landing-hero-media" aria-hidden="true">
          <img
            src={HERO_IMAGE}
            alt=""
            className="landing-hero-img"
            fetchPriority="high"
          />
        </div>
        <div className="landing-hero-content">
          <p className="landing-brand">Studio</p>
          <h1 className="landing-title">
            Studio is your lookbook for building ambitious outfits.
          </h1>
          <p className="landing-lead">
            Browse editorial looks, filter by style, and collect albums that
            stay on this device.
          </p>
          <div className="landing-actions">
            <a href="#gallery" className="btn-cursor primary">
              Browse looks
            </a>
            <Link to="/albums" className="btn-cursor ghost">
              Open albums
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-trust" aria-label="Style disciplines">
        <p className="landing-trust-label">
          Trusted every day by people who dress with intention
        </p>
        <ul className="landing-trust-list">
          {STYLE_ORDER.map((tag) => (
            <li key={tag}>{STYLE_LABELS[tag].split(' / ')[0]}</li>
          ))}
        </ul>
      </section>

      <section className="landing-feature" aria-labelledby="feature-heading">
        <div className="landing-feature-copy">
          <h2 id="feature-heading">Looks turn ideas into outfits</h2>
          <p>
            Hand off the scroll. Filter by aesthetic, open a look, and save it
            to an album while you decide what to wear next.
          </p>
          <a href="#gallery" className="text-link">
            Explore the gallery →
          </a>
        </div>
        <div className="landing-feature-panel" aria-hidden="true">
          <div className="feature-window">
            <div className="feature-window-bar">
              <span />
              <span />
              <span />
              <code>studio.app/agent</code>
            </div>
            <div className="feature-window-body">
              <p className="feature-prompt">
                show me tailored looks for the boardroom
              </p>
              <div className="feature-timeline">
                <p>
                  <span className="tl-read">Read</span> 12 looks · 5 style tags
                </p>
                <p>
                  <span className="tl-grep">Filter</span> Classic / tailored
                </p>
                <p>
                  <span className="tl-edit">Ready</span> 4 looks to review
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <div className="gallery-head">
          <h2 className="gallery-title">The new way to collect looks</h2>
          <p className="gallery-sub">
            An editorial wall of men’s looks — pick a style, open a detail,
            save it.
          </p>
        </div>

        <div className="filters-bar" aria-label="Style filters">
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
        </div>

        {loading ? (
          <div className="page-loading">
            <p className="muted">Loading lookbook…</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div className="gallery-wall">
            {filtered.map((look, i) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="wall-card"
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
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
      </section>

      <section className="landing-cta-band">
        <h2>Try Studio now.</h2>
        <p>Create an album and keep the looks that earn a second look.</p>
        <Link to="/albums" className="btn-cursor primary">
          Start collecting
        </Link>
      </section>
    </div>
  );
}
