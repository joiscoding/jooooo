import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

type Columns = 2 | 3 | 4;
const COLUMN_OPTIONS: Columns[] = [2, 3, 4];

/** Second frame shown on hover; falls back to nothing when the look has one image. */
function altImage(look: Look): string | undefined {
  return look.gallery.find((src) => src !== look.hero);
}

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [cols, setCols] = useState<Columns>(3);
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
      <div className="page-loading caps">
        <p>Loading</p>
      </div>
    );
  }

  return (
    <div className="home">
      {campaign && (
        <Link to={`/look/${campaign.id}`} className="campaign">
          <img
            src={campaign.hero}
            alt=""
            className="campaign-img"
            fetchPriority="high"
          />
          <div className="campaign-copy">
            <span className="caps">Men &middot; New season</span>
            <h1>The Edit</h1>
            <span className="caps campaign-cta">View look</span>
          </div>
        </Link>
      )}

      <div className="toolbar caps">
        <ul className="filters" aria-label="Style filters">
          <li>
            <button
              type="button"
              className={filter === 'all' ? 'filter-link active' : 'filter-link'}
              onClick={() => setFilter('all')}
            >
              View all
            </button>
          </li>
          {STYLE_ORDER.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                className={filter === tag ? 'filter-link active' : 'filter-link'}
                onClick={() => setFilter(tag)}
              >
                {STYLE_LABELS[tag]}
              </button>
            </li>
          ))}
        </ul>
        <div className="view-toggle" role="group" aria-label="Grid density">
          <span className="view-toggle-label">View</span>
          {COLUMN_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              className="view-btn"
              aria-pressed={cols === n}
              aria-label={`${n} columns`}
              onClick={() => setCols(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <p className="result-count caps">
        {filtered.length} {filtered.length === 1 ? 'look' : 'looks'}
      </p>

      {filtered.length === 0 ? (
        <p className="empty-state caps">No looks in this filter.</p>
      ) : (
        <div className="gallery-wall" data-cols={cols}>
          {filtered.map((look, i) => {
            const alt = altImage(look);
            return (
              <Link key={look.id} to={`/look/${look.id}`} className="wall-card">
                <div className="wall-frame">
                  <img
                    src={look.hero}
                    alt=""
                    className="wall-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                  {alt && (
                    <img src={alt} alt="" className="wall-img alt" loading="lazy" />
                  )}
                </div>
                <div className="wall-caption">
                  <h2 className="wall-title">{look.title}</h2>
                  <span className="wall-tag caps">{STYLE_LABELS[look.tag]}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
