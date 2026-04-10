import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListEmptyState } from '../components/ListEmptyState';
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

  const hasAnyLooks = looks.length > 0;

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="home-hero">
        <p className="eyebrow">Men · Seasonal edit</p>
        <h1 className="home-title">
          Looks built for <em>quiet</em> confidence.
        </h1>
      </section>

      <section className="filters-bar" aria-label="Style filters">
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
      </section>

      {filtered.length === 0 ? (
        hasAnyLooks && filter !== 'all' ? (
          <ListEmptyState
            title="Nothing matches this filter"
            description={`Try “All looks” or pick another style — there’s nothing tagged “${STYLE_LABELS[filter]}” right now.`}
            primaryAction={{
              label: 'Show all looks',
              onClick: () => setFilter('all'),
              variant: 'primary',
            }}
            secondaryAction={{
              label: 'Save looks to an album',
              to: '/albums',
              variant: 'ghost',
            }}
          />
        ) : (
          <ListEmptyState
            title="No looks to show yet"
            description="Looks load from the bundled catalog by default. If you cleared data or use a custom source, add looks or restore the seed set to fill the gallery."
            primaryAction={{
              label: 'Refresh this page',
              onClick: () => window.location.reload(),
              variant: 'primary',
            }}
            secondaryAction={{
              label: 'Organize albums',
              to: '/albums',
              variant: 'ghost',
            }}
          />
        )
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
                    <h2 className="wall-title">{look.title}</h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
