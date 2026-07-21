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
  const featured = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="oa-hero" aria-label="Introduction">
        <div className="oa-hero-media" aria-hidden="true">
          {heroLook ? (
            <img
              src={heroLook.hero}
              alt=""
              className="oa-hero-img"
              fetchPriority="high"
            />
          ) : null}
          <div className="oa-hero-wash" />
        </div>
        <div className="oa-hero-copy">
          <p className="oa-brand">Studio</p>
          <h1 className="oa-headline">Looks built for quiet confidence.</h1>
          <p className="oa-lede">
            An editorial men’s lookbook — filter by aesthetic, open a look, save
            it to an album.
          </p>
          <div className="oa-cta-group">
            <a href="#looks" className="btn-pill primary">
              Browse looks
            </a>
            <Link to="/albums" className="btn-pill ghost">
              Open albums
            </Link>
          </div>
        </div>
      </section>

      <section id="looks" className="looks-section" aria-label="Lookbook">
        <div className="looks-section-inner">
          <header className="looks-header">
            <h2 className="looks-title">Lookbook</h2>
            <p className="looks-sub">
              Five aesthetics. One calm grid for discovery.
            </p>
          </header>

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
            <>
              {featured.length > 0 && (
                <div
                  className={
                    featured.length === 1
                      ? 'editorial-grid solo'
                      : 'editorial-grid'
                  }
                >
                  <Link
                    to={`/look/${featured[0].id}`}
                    className="editorial-feature"
                  >
                    <img
                      src={featured[0].hero}
                      alt=""
                      className="editorial-img"
                      loading="eager"
                    />
                    <div className="editorial-meta">
                      <span className="wall-tag">
                        {STYLE_LABELS[featured[0].tag]}
                      </span>
                      <h3 className="wall-title">{featured[0].title}</h3>
                    </div>
                  </Link>
                  {featured.length > 1 && (
                    <div className="editorial-stack">
                      {featured.slice(1).map((look) => (
                        <Link
                          key={look.id}
                          to={`/look/${look.id}`}
                          className="editorial-card"
                        >
                          <img
                            src={look.hero}
                            alt=""
                            className="editorial-img"
                            loading="eager"
                          />
                          <div className="editorial-meta">
                            <span className="wall-tag">
                              {STYLE_LABELS[look.tag]}
                            </span>
                            <h3 className="wall-title">{look.title}</h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {rest.length > 0 && (
                <div className="gallery-wall">
                  {rest.map((look, i) => (
                    <Link
                      key={look.id}
                      to={`/look/${look.id}`}
                      className="wall-card"
                    >
                      <div className="wall-card-inner">
                        <img
                          src={look.hero}
                          alt=""
                          className="wall-img"
                          loading={i < 4 ? 'eager' : 'lazy'}
                        />
                        <div className="wall-meta">
                          <span className="wall-tag">
                            {STYLE_LABELS[look.tag]}
                          </span>
                          <h2 className="wall-title">{look.title}</h2>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
