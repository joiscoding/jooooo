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

  const campaign = looks[0];

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      {campaign && (
        <section className="campaign-hero" aria-label="Seasonal campaign">
          <div className="campaign-hero-media">
            <img
              src={campaign.hero}
              alt=""
              className="campaign-hero-img"
              loading="eager"
            />
          </div>
          <div className="campaign-hero-copy">
            <p className="campaign-brand">Studio</p>
            <h1 className="campaign-title">House Codes</h1>
            <p className="campaign-deck">
              Men's looks edited with quiet luxury - silhouette first, season
              second.
            </p>
            <a href="#lookbook" className="campaign-cta">
              Explore the lookbook
            </a>
          </div>
        </section>
      )}

      <section id="lookbook" className="lookbook" aria-label="Lookbook">
        <header className="lookbook-head">
          <h2 className="lookbook-title">The collection</h2>
          <p className="lookbook-deck">
            Five aesthetics. One house language.
          </p>
        </header>

        <div className="filters-bar" aria-label="Style filters" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            className={filter === 'all' ? 'filter-link active' : 'filter-link'}
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
              className={filter === tag ? 'filter-link active' : 'filter-link'}
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
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
              >
                <div className="wall-card-media">
                  <img
                    key={`${look.id}-${look.hero}`}
                    src={look.hero}
                    alt=""
                    className="wall-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                </div>
                <div className="wall-meta">
                  <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                  <h3 className="wall-title">{look.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
