import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ListEmptyState } from '../components/ListEmptyState';
import { clearStoredLooksAndReload, fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

export function HomeGallery() {
  const [searchParams] = useSearchParams();
  const demoNoLooks =
    import.meta.env.DEV && searchParams.get('emptyLooks') === '1';
  const filterNoMatchDemo =
    import.meta.env.DEV && searchParams.get('filterNoMatch') === '1';
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

  const catalog = demoNoLooks ? [] : looks;

  const filtered = useMemo(() => {
    if (filterNoMatchDemo) return [];
    if (filter === 'all') return catalog;
    return catalog.filter((l) => l.tag === filter);
  }, [catalog, filter, filterNoMatchDemo]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  if (catalog.length === 0) {
    return (
      <div className="home">
        <section className="home-hero">
          <p className="eyebrow">Men · Seasonal edit</p>
          <h1 className="home-title">
            Looks built for <em>quiet</em> confidence.
          </h1>
        </section>
        <ListEmptyState
          title="No looks in your lookbook"
          description="We couldn’t find any looks to show. If you cleared session storage, you can load the built-in sample set again."
          primary={{ label: 'Restore sample looks', onClick: clearStoredLooksAndReload }}
          secondary={{ label: 'View a sample look', to: '/look/crosswalk-khaki' }}
          aria-label="Gallery has no looks"
        />
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
        <ListEmptyState
          title="Nothing matches this style"
          description="Try a different filter or view all looks to see the full collection."
          primary={{ label: 'Show all looks', onClick: () => setFilter('all') }}
          secondary={{ label: 'Albums', to: '/albums' }}
          aria-label="No looks for this filter"
        />
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
