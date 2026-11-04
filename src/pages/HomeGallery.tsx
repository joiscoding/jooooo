import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const WORDMARK_COLORS = [
  '#4285F4',
  '#EA4335',
  '#FBBC05',
  '#4285F4',
  '#34A853',
  '#EA4335',
];

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
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
    return looks.filter((l) => {
      const matchesTag = filter === 'all' || l.tag === filter;
      if (!matchesTag) return false;
      if (!q) return true;
      const haystack = [
        l.title,
        l.season,
        l.occasion,
        STYLE_LABELS[l.tag],
        ...l.keyItems,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [looks, filter, query]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  const handleRandomLook = () => {
    const pool = filtered.length > 0 ? filtered : looks;
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    navigate(`/look/${pick.id}`);
  };

  return (
    <div className="home">
      <section className="home-hero">
        <div className="google-brand" aria-label="Studio Lookbook">
          <div className="google-wordmark" aria-hidden="true">
            {'Studio'.split('').map((ch, idx) => (
              <span
                key={idx}
                style={{ color: WORDMARK_COLORS[idx % WORDMARK_COLORS.length] }}
              >
                {ch}
              </span>
            ))}
          </div>
          <span className="google-submark">Lookbook</span>
        </div>

        <p className="home-tagline">
          Men · Seasonal edit — Looks built for <em>quiet</em> confidence.
        </p>

        <div className="search-shell">
          <span className="search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="#9aa0a6"
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              />
            </svg>
          </span>
          <input
            type="search"
            className="search-bar-input"
            placeholder="Search looks, key items, seasons, or occasions…"
            aria-label="Search looks"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
          <span className="search-lens-dots" aria-hidden="true">
            <span className="dot dot-blue" />
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </span>
        </div>

        <div className="hero-actions">
          <button
            type="button"
            className="google-btn"
            onClick={() => {
              document
                .getElementById('looks-results')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Browse Lookbook
          </button>
          <button
            type="button"
            className="google-btn"
            onClick={handleRandomLook}
          >
            Surprise Look
          </button>
        </div>

        <div className="offered-in" aria-label="Style filters">
          <span className="offered-label">Lookbook edits:</span>
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
      </section>

      <section id="looks-results" className="results-section">
        <div className="results-meta-bar">
          <span>
            Showing {filtered.length} of {looks.length} curated looks
            {filter !== 'all' ? ` in ${STYLE_LABELS[filter]}` : ''}
            {query.trim() ? ` matching "${query.trim()}"` : ''}
          </span>
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
                    <div className="wall-img-wrap">
                      <img
                        key={`${look.id}-${look.hero}`}
                        src={look.hero}
                        alt=""
                        className="wall-img"
                        loading={i < 4 ? 'eager' : 'lazy'}
                      />
                    </div>
                    <div className="wall-meta">
                      <div className="wall-crumb">
                        <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                        <span className="wall-season">
                          · {look.season} · {look.occasion}
                        </span>
                      </div>
                      <h2 className="wall-title">{look.title}</h2>
                      <p className="wall-items">{look.keyItems.join(' · ')}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
