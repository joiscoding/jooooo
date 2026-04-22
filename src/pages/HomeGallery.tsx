import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

function pickFeaturedLook(looks: Look[]): Look | undefined {
  if (looks.length === 0) return undefined;
  const ath = looks.find((l) => l.tag === 'athleisure');
  return ath ?? looks[0];
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

  const featured = useMemo(() => pickFeaturedLook(looks), [looks]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      {featured && (
        <section className="landing-hero" aria-labelledby="landing-hero-title">
          <div className="landing-hero__media">
            <img
              src={featured.hero}
              alt=""
              className="landing-hero__img"
              width={1920}
              height={1080}
              fetchPriority="high"
            />
            <div className="landing-hero__overlay" />
          </div>
          <div className="landing-hero__content">
            <p className="landing-hero__kicker">Studio · {featured.season}</p>
            <h1 id="landing-hero-title" className="landing-hero__title">
              Engineered to move. Built to last.
            </h1>
            <p className="landing-hero__lede">
              Technical layers, easy tailoring, and quiet confidence—wear it
              from warm-up to weekend.
            </p>
            <div className="landing-hero__ctas">
              <Link
                to={`/look/${featured.id}`}
                className="btn-cta btn-cta--primary"
              >
                Shop {featured.title}
              </Link>
              <a href="#shop-section" className="btn-cta btn-cta--ghost">
                Explore the edit
              </a>
            </div>
          </div>
        </section>
      )}

      <div className="home-inner">
        <section
          className="landing-promise"
          aria-label="Our promise"
        >
          <ul className="landing-promise__list">
            <li>
              <span className="landing-promise__label">Quality</span>
              <span className="landing-promise__desc">Designed with longevity in mind</span>
            </li>
            <li>
              <span className="landing-promise__label">Performance</span>
              <span className="landing-promise__desc">Layering and movement, dialed in</span>
            </li>
            <li>
              <span className="landing-promise__label">Details</span>
              <span className="landing-promise__desc">Fabric, fit, and finish—considered</span>
            </li>
          </ul>
        </section>

        <section id="shop-section" className="landing-shop" aria-labelledby="shop-heading">
          <div className="landing-shop__head">
            <h2 id="shop-heading" className="section-title">
              Shop the edit
            </h2>
            <p className="section-sub">
              Filter by vibe—curated looks you can build on.
            </p>
          </div>

          <div className="filters-bar" aria-label="Style filters">
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
          </div>

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
                        <h3 className="wall-title">{look.title}</h3>
                        <span className="wall-cta">View look</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
