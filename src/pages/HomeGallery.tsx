import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const WALL_VARIANTS = ['wall-card--tall', 'wall-card--wide', 'wall-card--offset'] as const;

function wallVariant(index: number): string {
  return WALL_VARIANTS[index % WALL_VARIANTS.length];
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
  const spotlight = looks[2] ?? looks[1];

  if (loading) {
    return (
      <div className="page-loading page-loading--landing">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      {featured && (
        <section className="home-cinema" aria-label="Seasonal hero">
          <div className="home-cinema-media">
            <img
              src={featured.hero}
              alt=""
              className="home-cinema-img"
              loading="eager"
            />
            <div className="home-cinema-vignette" aria-hidden="true" />
          </div>

          <div className="home-cinema-content">
            <span className="home-cinema-label" aria-hidden="true">
              SS / 26
            </span>
            <p className="eyebrow eyebrow--light">Men · Seasonal edit</p>
            <h1 className="home-cinema-title">
              Quiet
              <br />
              <em>confidence</em>
              <br />
              <span className="home-cinema-title-sub">redefined</span>
            </h1>
            <p className="home-cinema-deck">
              An editorial collection of menswear looks — minimal silhouettes,
              considered layers, and pieces built to outlast the trend cycle.
            </p>
            <a href="#collection" className="home-cinema-cta">
              Explore the collection
            </a>
          </div>

          {spotlight && (
            <Link to={`/look/${spotlight.id}`} className="home-cinema-feature">
              <img src={spotlight.hero} alt="" loading="eager" />
              <div className="home-cinema-feature-meta">
                <span className="wall-tag">{STYLE_LABELS[spotlight.tag]}</span>
                <span className="home-cinema-feature-title">{spotlight.title}</span>
              </div>
            </Link>
          )}
        </section>
      )}

      <section className="home-manifesto" aria-label="Brand statement">
        <div className="home-manifesto-inner">
          <p className="home-manifesto-kicker">The edit</p>
          <blockquote className="home-manifesto-quote">
            Style should feel <em>effortless</em>, not loud — every look curated
            for men who dress with intention.
          </blockquote>
          <p className="home-manifesto-count">
            {looks.length} looks · 5 aesthetics
          </p>
        </div>
      </section>

      <section id="collection" className="home-collection" aria-label="Look collection">
        <div className="home-collection-head">
          <h2 className="home-section-title">The gallery</h2>
          <p className="home-section-deck">
            Filter by mood. Each frame is a complete outfit — tap to study the
            pieces.
          </p>
        </div>

        <div className="filters-bar filters-bar--editorial" aria-label="Style filters">
          <button
            type="button"
            className={filter === 'all' ? 'filter-tab active' : 'filter-tab'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'filter-tab active' : 'filter-tab'}
              onClick={() => setFilter(tag)}
            >
              {STYLE_LABELS[tag]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div className="gallery-wall gallery-wall--staggered">
            {filtered.map((look, i) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className={`wall-card ${wallVariant(i)}`}
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
                  <span className="wall-index" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="home-closer" aria-label="Closing statement">
        <div className="home-closer-grid">
          <div className="home-closer-copy">
            <p className="eyebrow">Curate your own</p>
            <h2 className="home-closer-title">
              Save looks to <em>albums</em>
            </h2>
            <p className="home-closer-deck">
              Build personal mood boards from the gallery — no account required.
              Your selections stay in this browser.
            </p>
            <Link to="/albums" className="btn btn--editorial">
              View albums
            </Link>
          </div>
          {looks[1] && (
            <Link to={`/look/${looks[1].id}`} className="home-closer-visual">
              <img src={looks[1].hero} alt="" loading="lazy" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
