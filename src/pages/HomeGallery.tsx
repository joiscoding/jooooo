import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const STYLE_DESCRIPTIONS: Record<StyleTag, string> = {
  minimal: 'Understated neutrals and clean silhouettes for everyday ease.',
  streetwear: 'Urban layers, sneakers, and graphic utility cues.',
  classic: 'Structured tailoring, prep influence, and dress-casual polish.',
  athleisure: 'Performance fabrics with relaxed, athletic comfort.',
  workwear: 'Durable heritage fabrics and utilitarian workwear roots.',
};

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

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

  const heroLooks = useMemo(() => looks.slice(0, 4), [looks]);

  useEffect(() => {
    if (heroLooks.length <= 1) return;
    const timer = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroLooks.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [heroLooks.length]);

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  const countsByTag = useMemo(() => {
    const counts = Object.fromEntries(
      STYLE_ORDER.map((tag) => [tag, 0]),
    ) as Record<StyleTag, number>;
    for (const look of looks) counts[look.tag] += 1;
    return counts;
  }, [looks]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  const activeHero = heroLooks[heroIndex];

  return (
    <div className="home">
      {activeHero && (
        <section className="hero-banner" aria-label="Featured looks">
          <div className="hero-banner-track">
            {heroLooks.map((look, i) => (
              <div
                key={look.id}
                className={
                  i === heroIndex
                    ? 'hero-slide is-active'
                    : 'hero-slide'
                }
                aria-hidden={i !== heroIndex}
              >
                <img src={look.hero} alt="" className="hero-slide-img" />
                <div className="hero-slide-overlay" />
              </div>
            ))}
          </div>
          <div className="hero-banner-content">
            <p className="hero-eyebrow">Seasonal edit · Men</p>
            <h1 className="hero-headline">{activeHero.title}</h1>
            <p className="hero-sub">
              {STYLE_LABELS[activeHero.tag]} — curated looks built for quiet
              confidence.
            </p>
            <div className="hero-actions">
              <Link to={`/look/${activeHero.id}`} className="btn primary">
                View look
              </Link>
              <button
                type="button"
                className="btn ghost-light"
                onClick={() => setFilter('all')}
              >
                Browse gallery
              </button>
            </div>
          </div>
          {heroLooks.length > 1 && (
            <div className="hero-dots" role="tablist" aria-label="Hero slides">
              {heroLooks.map((look, i) => (
                <button
                  key={look.id}
                  type="button"
                  role="tab"
                  aria-selected={i === heroIndex}
                  aria-label={`Slide ${i + 1}: ${look.title}`}
                  className={
                    i === heroIndex ? 'hero-dot is-active' : 'hero-dot'
                  }
                  onClick={() => setHeroIndex(i)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="pillars-section" aria-label="Style categories">
        <div className="section-inner">
          <div className="section-head">
            <h2 className="section-title">Explore by style</h2>
            <p className="section-lead">
              Five aesthetic pillars — filter the gallery or jump straight into a
              category.
            </p>
          </div>
          <div className="pillars-grid">
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                className={
                  filter === tag ? 'pillar-card is-active' : 'pillar-card'
                }
                onClick={() => setFilter(tag)}
              >
                <span className="pillar-icon" aria-hidden>
                  {tag.slice(0, 1).toUpperCase()}
                </span>
                <span className="pillar-name">{STYLE_LABELS[tag]}</span>
                <span className="pillar-desc">{STYLE_DESCRIPTIONS[tag]}</span>
                <span className="pillar-count">
                  {countsByTag[tag]} look{countsByTag[tag] === 1 ? '' : 's'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="news-section" aria-label="Recent updates">
        <div className="section-inner">
          <div className="section-head">
            <h2 className="section-title">Recent updates</h2>
            <p className="section-lead">
              New looks added to the seasonal edit.
            </p>
          </div>
          <ul className="news-list">
            {looks.slice(0, 5).map((look) => (
              <li key={look.id} className="news-item">
                <span className="news-date">{look.season}</span>
                <Link to={`/look/${look.id}`} className="news-link">
                  {look.title}
                </Link>
                <span className="news-tag">{STYLE_LABELS[look.tag]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gallery-section" aria-label="Look gallery">
        <div className="section-inner">
          <div className="gallery-section-head">
            <div>
              <h2 className="section-title">Latest looks</h2>
              <p className="section-lead">
                {filter === 'all'
                  ? 'Full seasonal gallery — image-led discovery.'
                  : `Showing ${STYLE_LABELS[filter]} looks.`}
              </p>
            </div>
            <div className="filters-bar" aria-label="Style filters">
              <button
                type="button"
                className={
                  filter === 'all' ? 'filter-pill active' : 'filter-pill'
                }
                onClick={() => setFilter('all')}
              >
                All
              </button>
              {STYLE_ORDER.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={
                    filter === tag ? 'filter-pill active' : 'filter-pill'
                  }
                  onClick={() => setFilter(tag)}
                >
                  {STYLE_LABELS[tag]}
                </button>
              ))}
            </div>
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
                      loading={i < 6 ? 'eager' : 'lazy'}
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
    </div>
  );
}
