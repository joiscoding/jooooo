import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const HERO_IMAGE = '/looks/1768809250854-2f4b1e8f19cc-w1200h1600.jpg';
const PROFILE_IMAGE = '/looks/1600117025146-5092075da653-w1200h1500.jpg';

/** Editorial "release" dates, presented in the style of IR announcement listings. */
const UPDATE_DATES = [
  'June 18, 2026',
  'May 30, 2026',
  'May 12, 2026',
  'April 24, 2026',
  'April 2, 2026',
];

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

  const seasonCount = useMemo(
    () => new Set(looks.map((l) => l.season)).size,
    [looks]
  );

  const updates = useMemo(() => looks.slice(0, UPDATE_DATES.length), [looks]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="ir-home">
      <section className="ir-hero" aria-label="Collection overview">
        <img src={HERO_IMAGE} alt="" className="ir-hero-bg" />
        <div className="ir-hero-overlay" />
        <div className="ir-container ir-hero-inner">
          <p className="ir-hero-eyebrow">Seasonal Collection · 2026 Edition</p>
          <h1 className="ir-hero-title">
            Modern menswear,<br />designed to last.
          </h1>
          <p className="ir-hero-sub">
            A curated house of editorial looks across five enduring style
            disciplines — built for quiet, lasting confidence.
          </p>
          <div className="ir-hero-actions">
            <a href="#featured" className="ir-btn ir-btn--primary">
              Explore the gallery
            </a>
            <Link to="/albums" className="ir-btn ir-btn--ghost">
              View albums
            </Link>
          </div>
        </div>
      </section>

      <section className="ir-stats" aria-label="Collection at a glance">
        <div className="ir-container ir-stats-inner">
          <div className="ir-stat">
            <span className="ir-stat-num">{looks.length}</span>
            <span className="ir-stat-label">Curated looks</span>
          </div>
          <div className="ir-stat">
            <span className="ir-stat-num">{STYLE_ORDER.length}</span>
            <span className="ir-stat-label">Style disciplines</span>
          </div>
          <div className="ir-stat">
            <span className="ir-stat-num">{seasonCount}</span>
            <span className="ir-stat-label">Seasons covered</span>
          </div>
          <div className="ir-stat">
            <span className="ir-stat-num">2026</span>
            <span className="ir-stat-label">Current edition</span>
          </div>
        </div>
      </section>

      <section className="ir-section ir-about" aria-label="About the collection">
        <div className="ir-container ir-about-grid">
          <div className="ir-about-text">
            <p className="ir-kicker">About the house</p>
            <h2 className="ir-h2">
              An editorial approach to everyday dressing.
            </h2>
            <p className="ir-body">
              Studio Lookbook is a quiet, modern menswear practice. Each season
              we publish a focused edit of outfit-first “looks”, organised by a
              small set of enduring style disciplines rather than a sprawling
              catalogue.
            </p>
            <p className="ir-body">
              Our intent is calm and quality-forward: restrained neutrals,
              strong photography, and clear hierarchy. Save the looks that
              resonate into albums and return to them season after season.
            </p>
            <Link to="/albums" className="ir-link">
              Browse your albums →
            </Link>
          </div>
          <div className="ir-about-media">
            <img src={PROFILE_IMAGE} alt="" />
          </div>
        </div>
      </section>

      <section
        className="ir-section ir-section--alt"
        id="featured"
        aria-label="Featured looks"
      >
        <div className="ir-container">
          <div className="ir-section-head">
            <div>
              <p className="ir-kicker">Featured</p>
              <h2 className="ir-h2">Looks by discipline</h2>
            </div>
            <p className="ir-section-note">
              Filter the collection by style discipline.
            </p>
          </div>

          <div className="ir-tabs" role="tablist" aria-label="Style filters">
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              className={filter === 'all' ? 'ir-tab is-active' : 'ir-tab'}
              onClick={() => setFilter('all')}
            >
              All looks
            </button>
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                role="tab"
                aria-selected={filter === tag}
                className={filter === tag ? 'ir-tab is-active' : 'ir-tab'}
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

      <section className="ir-section ir-updates" aria-label="Latest updates">
        <div className="ir-container">
          <div className="ir-section-head">
            <div>
              <p className="ir-kicker">Newsroom</p>
              <h2 className="ir-h2">Latest updates</h2>
            </div>
            <a href="#featured" className="ir-link">
              View all looks →
            </a>
          </div>

          <ul className="ir-update-list">
            {updates.map((look, i) => (
              <li key={look.id} className="ir-update-row">
                <Link to={`/look/${look.id}`} className="ir-update-link">
                  <span className="ir-update-date">
                    {UPDATE_DATES[i] ?? UPDATE_DATES[UPDATE_DATES.length - 1]}
                  </span>
                  <span className="ir-update-body">
                    <span className="ir-update-cat">
                      {STYLE_LABELS[look.tag]}
                    </span>
                    <span className="ir-update-title">
                      New look added: {look.title}
                    </span>
                  </span>
                  <img
                    src={look.hero}
                    alt=""
                    className="ir-update-thumb"
                    loading="lazy"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ir-cta" aria-label="Get started">
        <div className="ir-container ir-cta-inner">
          <div>
            <h2 className="ir-cta-title">Build your seasonal edit.</h2>
            <p className="ir-cta-sub">
              Save the looks that speak to you into albums — they persist across
              visits.
            </p>
          </div>
          <Link to="/albums" className="ir-btn ir-btn--light">
            Go to albums
          </Link>
        </div>
      </section>
    </div>
  );
}
