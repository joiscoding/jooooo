import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

function pickFeaturedLooks(looks: Look[]) {
  const hero =
    looks.find((l) => l.tag === 'classic') ??
    looks.find((l) => l.tag === 'minimal') ??
    looks[0];

  const used = new Set(hero ? [hero.id] : []);
  const campaigns: Look[] = [];

  for (const tag of ['workwear', 'streetwear', 'athleisure'] as StyleTag[]) {
    const match = looks.find((l) => l.tag === tag && !used.has(l.id));
    if (match) {
      campaigns.push(match);
      used.add(match.id);
    }
  }

  if (campaigns.length < 2) {
    for (const look of looks) {
      if (campaigns.length >= 2) break;
      if (!used.has(look.id)) {
        campaigns.push(look);
        used.add(look.id);
      }
    }
  }

  return { hero, campaigns };
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

  const { hero, campaigns } = useMemo(
    () => pickFeaturedLooks(looks),
    [looks],
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading collection…</p>
      </div>
    );
  }

  return (
    <div className="home">
      {hero && (
        <section className="rl-hero" aria-label="Featured campaign">
          <img
            src={hero.hero}
            alt=""
            className="rl-hero__img"
            loading="eager"
          />
          <div className="rl-hero__veil" />
          <div className="rl-hero__content">
            <p className="rl-hero__season">{hero.season} · {hero.occasion}</p>
            <h1 className="rl-hero__title">
              {hero.title}
            </h1>
            <p className="rl-hero__subtitle">
              An edit of quiet confidence — tailored for the modern gentleman.
            </p>
            <div className="rl-hero__actions">
              <Link to={`/look/${hero.id}`} className="rl-btn rl-btn--light">
                Shop the Look
              </Link>
              <a href="#collections" className="rl-text-link">
                View Collection
              </a>
            </div>
          </div>
          <span className="rl-hero__scroll" aria-hidden="true">
            Scroll
          </span>
        </section>
      )}

      <section className="rl-statement">
        <blockquote className="rl-statement__quote">
          Style is not about trends — it is about knowing who you are and
          expressing it with grace, ease, and enduring quality.
        </blockquote>
        <p className="rl-statement__cite">The Studio Edit</p>
      </section>

      {campaigns.length >= 2 && (
        <section className="rl-campaigns" aria-label="Featured stories">
          {campaigns.slice(0, 2).map((look, i) => (
            <Link
              key={look.id}
              to={`/look/${look.id}`}
              className={`rl-campaign ${i === 1 ? 'rl-campaign--reverse' : ''}`}
            >
              <div className="rl-campaign__media">
                <img src={look.hero} alt="" loading="lazy" />
              </div>
              <div className="rl-campaign__copy">
                <p className="rl-campaign__label">{STYLE_LABELS[look.tag]}</p>
                <h2 className="rl-campaign__title">{look.title}</h2>
                <p className="rl-campaign__desc">
                  {look.season} · {look.occasion}
                </p>
                <span className="rl-text-link">Discover</span>
              </div>
            </Link>
          ))}
        </section>
      )}

      <section id="collections" className="rl-collections">
        <header className="rl-collections__head">
          <p className="eyebrow">The Collection</p>
          <h2 className="rl-collections__title">Curated Looks</h2>
          <p className="rl-collections__intro">
            Filter by aesthetic — from heritage workwear to quiet minimalism.
          </p>
        </header>

        <div className="filters-bar" aria-label="Style filters">
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
                className={`wall-card ${i % 5 === 0 ? 'wall-card--feature' : ''}`}
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
                    <span className="wall-cta">View Look</span>
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
