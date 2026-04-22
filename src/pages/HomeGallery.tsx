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
      <div className="page-loading page-loading--retail">
        <p className="muted">Loading the edit…</p>
      </div>
    );
  }

  const heroLook = looks[0];

  return (
    <div className="home home--retail">
      {heroLook ? (
        <section className="home-hero-banner" aria-label="Campaign hero">
          <div className="home-hero-banner__media">
            <img
              src={heroLook.hero}
              alt=""
              className="home-hero-banner__img"
              width={1200}
              height={1500}
            />
          </div>
          <div className="home-hero-banner__copy">
            <p className="eyebrow">Men · New in</p>
            <h1 className="home-hero-banner__title">
              Spring <em>essentials</em>
            </h1>
            <p className="home-hero-banner__lede">
              Elevated layers, easy proportions — looks you can live in, styled
              like a high-street campaign.
            </p>
            <div className="home-hero-banner__ctas">
              <a className="btn btn--red" href="#lookbook-grid">
                Shop the edit
              </a>
              <Link className="btn btn--outline" to={`/look/${heroLook.id}`}>
                See featured look
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <div className="home-inner" id="lookbook-grid">
        <div className="section-head">
          <h2 className="section-title">The edit</h2>
          <p className="section-sub">Filter by style — tap a category to refine.</p>
        </div>

        <section className="filters-bar filters-bar--retail" aria-label="Style filters">
          <span className="filters-bar__label">Shop by style</span>
          <div className="filters-bar__pills">
            <button
              type="button"
              className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setFilter('all')}
            >
              View all
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
        </section>

        {filtered.length === 0 ? (
          <p className="empty-state">Nothing in this category right now.</p>
        ) : (
          <div className="gallery-wall gallery-wall--retail">
            {filtered.map((look, i) => {
              return (
                <Link
                  key={look.id}
                  to={`/look/${look.id}`}
                  className="wall-card wall-card--retail"
                >
                  <div className="wall-card-inner">
                    <div className="wall-img-wrap">
                      <img
                        key={`${look.id}-${look.hero}`}
                        src={look.hero}
                        alt=""
                        className="wall-img"
                        loading={i < 6 ? 'eager' : 'lazy'}
                      />
                    </div>
                    <div className="wall-meta wall-meta--below">
                      <h2 className="wall-title">{look.title}</h2>
                      <p className="wall-dummy-price">{look.season}</p>
                      <p className="wall-tagline">{STYLE_LABELS[look.tag]}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
