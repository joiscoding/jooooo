import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

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
    const q = query.trim().toLowerCase();
    return looks.filter((look) => {
      const matchesFilter = filter === 'all' || look.tag === filter;
      if (!matchesFilter) return false;
      if (!q) return true;
      const searchable = [
        look.title,
        STYLE_LABELS[look.tag],
        look.season,
        look.occasion,
        ...look.keyItems,
      ]
        .join(' ')
        .toLowerCase();
      return searchable.includes(q);
    });
  }, [looks, filter, query]);

  function handleBrowseClick() {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleFeelingLucky() {
    const pool = filtered.length > 0 ? filtered : looks;
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    navigate(`/look/${pick.id}`);
  }

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
        <h1 className="google-wordmark" aria-label="Studio">
          <span className="g-blue">S</span>
          <span className="g-red">t</span>
          <span className="g-yellow">u</span>
          <span className="g-blue">d</span>
          <span className="g-green">i</span>
          <span className="g-red">o</span>
        </h1>

        <div className="search-box-wrap">
          <div className="search-bar" role="search">
            <span className="search-icon" aria-hidden="true">
              <svg
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path
                  fill="#9aa0a6"
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
            </span>
            <input
              type="search"
              className="search-input"
              placeholder="Search looks, styles, occasions, or key items…"
              aria-label="Search looks"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
            <span className="search-Visual-icons" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="3.2" fill="#4285f4" />
                <path
                  d="M9 3L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z"
                  fill="#9aa0a6"
                  fillOpacity="0.45"
                />
              </svg>
            </span>
          </div>

          <div className="hero-actions">
            <button
              type="button"
              className="google-btn"
              onClick={handleBrowseClick}
            >
              Lookbook Search
            </button>
            <button
              type="button"
              className="google-btn"
              onClick={handleFeelingLucky}
            >
              I&apos;m Feeling Stylish
            </button>
          </div>
        </div>
      </section>

      <div ref={resultsRef} className="results-toolbar">
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
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No looks match your current filter or search.</p>
          {(filter !== 'all' || query) && (
            <button
              type="button"
              className="google-btn"
              onClick={() => {
                setFilter('all');
                setQuery('');
              }}
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="gallery-wall">
          {filtered.map((look, i) => {
            return (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="wall-card"
                aria-label={look.title}
              >
                <div className="wall-card-inner">
                  <div className="wall-image-frame">
                    <img
                      key={`${look.id}-${look.hero}`}
                      src={look.hero}
                      alt={look.title}
                      className="wall-img"
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
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
