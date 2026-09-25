import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const STYLE_BLURBS: Record<StyleTag, string> = {
  minimal: 'Neutrals, clean silhouettes, and understated color.',
  streetwear: 'Sneakers, layers, and city utility.',
  classic: 'Structure, prep, and dress-casual tailoring.',
  athleisure: 'Performance-inspired pieces for travel and training.',
  workwear: 'Durable fabrics with a heritage cut.',
};

const STEPS = [
  {
    title: 'Browse the edit',
    body: 'Start from the seasonal gallery and narrow it with a style.',
  },
  {
    title: 'Open a look',
    body: 'See the hero, the key pieces, and where the outfit belongs.',
  },
  {
    title: 'Save an album',
    body: 'Keep favorites in this browser. They stay after a refresh.',
  },
];

function lookBlurb(look: Look) {
  const pieces = look.keyItems.slice(0, 2).join(' and ');
  return `${look.occasion} · ${look.season}. Built around ${pieces}.`;
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
    return looks.filter((look) => look.tag === filter);
  }, [looks, filter]);

  const featured = useMemo(() => looks.slice(0, 3), [looks]);
  const heroLook =
    looks.find((look) => look.id === 'boardroom-soft') ?? looks[0];

  function selectStyle(tag: StyleTag) {
    setFilter(tag);
    document.getElementById('looks')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="lp">
      <section
        className="lp-hero"
        style={
          heroLook
            ? {
                backgroundImage: `linear-gradient(90deg, rgba(22, 30, 45, 0.94) 0%, rgba(22, 30, 45, 0.78) 46%, rgba(22, 30, 45, 0.42) 100%), url(${heroLook.hero})`,
              }
            : undefined
        }
      >
        <div className="lp-wrap lp-hero-inner">
          <p className="lp-kicker">Men’s seasonal edit</p>
          <h1>The lookbook for quiet confidence.</h1>
          <p className="lp-hero-copy">
            Browse men’s looks across five styles. Open an outfit, then save
            it to an album that stays in this browser.
          </p>
          <div className="lp-hero-actions">
            <a className="lp-btn" href="#looks">
              Explore looks
            </a>
            <Link className="lp-btn lp-btn-secondary" to="/albums">
              View albums
            </Link>
          </div>
        </div>
      </section>

      <section className="lp-features" aria-label="Featured looks">
        <div className="lp-wrap">
          {loading ? (
            <p className="lp-loading">Loading lookbook…</p>
          ) : (
            <div className="lp-feature-grid">
              {featured.map((look) => (
                <Link
                  key={look.id}
                  to={`/look/${look.id}`}
                  className="lp-card"
                >
                  <img src={look.hero} alt="" className="lp-card-img" />
                  <div className="lp-card-body">
                    <p className="lp-card-kicker">{STYLE_LABELS[look.tag]}</p>
                    <h2>{look.title}</h2>
                    <p>{lookBlurb(look)}</p>
                    <span className="lp-more">View look ›</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="styles" className="lp-section">
        <div className="lp-wrap">
          <h2 className="lp-heading">Five styles for the season</h2>
          <p className="lp-lead">
            Pick the way you dress. The gallery below follows that filter.
          </p>
          <div className="lp-style-grid">
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                className="lp-style"
                onClick={() => selectStyle(tag)}
              >
                <h3>{STYLE_LABELS[tag]}</h3>
                <p>{STYLE_BLURBS[tag]}</p>
                <span className="lp-more">Browse looks ›</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="looks" className="lp-section lp-section-muted">
        <div className="lp-wrap">
          <h2 className="lp-heading">Explore the gallery</h2>
          <p className="lp-lead">
            Every look is a full outfit, not a product grid.
          </p>
          <div className="lp-tabs" role="tablist" aria-label="Style filters">
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              className={filter === 'all' ? 'lp-tab active' : 'lp-tab'}
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
                className={filter === tag ? 'lp-tab active' : 'lp-tab'}
                onClick={() => setFilter(tag)}
              >
                {STYLE_LABELS[tag]}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="lp-loading">Loading lookbook…</p>
          ) : filtered.length === 0 ? (
            <p className="empty-state">No looks in this filter.</p>
          ) : (
            <div className="lp-grid">
              {filtered.map((look, i) => (
                <Link
                  key={look.id}
                  to={`/look/${look.id}`}
                  className="lp-card"
                >
                  <img
                    src={look.hero}
                    alt=""
                    className="lp-card-img"
                    loading={i < 3 ? 'eager' : 'lazy'}
                  />
                  <div className="lp-card-body">
                    <p className="lp-card-kicker">{STYLE_LABELS[look.tag]}</p>
                    <h2>{look.title}</h2>
                    <p>
                      {look.occasion} · {look.season}
                    </p>
                    <span className="lp-more">View look ›</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-wrap">
          <h2 className="lp-heading">Get started in three steps</h2>
          <ol className="lp-steps">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="lp-step-num">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="lp-cta">
        <div className="lp-wrap lp-cta-inner">
          <div>
            <h2>Save a look. Build an album.</h2>
            <p>Albums live in this browser and survive a refresh.</p>
          </div>
          <Link className="lp-btn" to="/albums">
            Open albums
          </Link>
        </div>
      </section>
    </div>
  );
}
