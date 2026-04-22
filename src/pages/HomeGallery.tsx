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

  const heroLook = looks[0];
  const heroImage = heroLook?.hero ?? '';

  if (loading) {
    return (
      <div className="page-loading page-loading--editorial">
        <p className="zara-loader-line" aria-hidden="true" />
        <p className="zara-loader-text">Loading</p>
      </div>
    );
  }

  return (
    <div className="home home--editorial">
      {heroImage ? (
        <section className="home-hero-editorial" aria-label="Season campaign">
          <div className="home-hero-editorial-media">
            <img
              src={heroImage}
              alt=""
              className="home-hero-editorial-img"
              fetchPriority="high"
            />
            <div className="home-hero-editorial-shade" aria-hidden="true" />
          </div>
          <div className="home-hero-editorial-copy">
            <p className="home-hero-editorial-kicker">Collection</p>
            <h1 className="home-hero-editorial-title">
              {heroLook ? (
                <>{heroLook.title}</>
              ) : (
                <>Men · Lookbook</>
              )}
            </h1>
            <p className="home-hero-editorial-sub">Spring–Summer</p>
            {heroLook && (
              <Link
                to={`/look/${heroLook.id}`}
                className="home-hero-cta"
              >
                View look
              </Link>
            )}
          </div>
        </section>
      ) : null}

      <div className="home-editorial-body">
        <section
          className="home-categories"
          aria-label="Categories"
        >
          <p className="home-categories-label">Shop by edit</p>
          <ul className="home-categories-list">
            <li>
              <button
                type="button"
                className={
                  filter === 'all'
                    ? 'home-category is-active'
                    : 'home-category'
                }
                onClick={() => setFilter('all')}
              >
                All
              </button>
            </li>
            {STYLE_ORDER.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className={
                    filter === tag ? 'home-category is-active' : 'home-category'
                  }
                  onClick={() => setFilter(tag)}
                >
                  {STYLE_LABELS[tag].split(' / ')[0]}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {filtered.length === 0 ? (
          <p className="empty-state home-empty">No looks in this edit.</p>
        ) : (
          <section
            className="home-lookbook"
            aria-label="Lookbook"
          >
            <header className="home-lookbook-head">
              <h2 className="home-lookbook-title">The edit</h2>
            </header>
            <div className="gallery-wall gallery-wall--editorial">
              {filtered.map((look, i) => (
                <Link
                  key={look.id}
                  to={`/look/${look.id}`}
                  className="wall-tile"
                >
                  <div className="wall-tile-media">
                    <img
                      src={look.hero}
                      alt=""
                      className="wall-tile-img"
                      loading={i < 6 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="wall-tile-cap">
                    <span className="wall-tile-cat">
                      {STYLE_LABELS[look.tag].split(' / ')[0]}
                    </span>
                    <span className="wall-tile-name">{look.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
