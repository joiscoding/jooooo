import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const POINTS = [12, 8, 15, 5, 10, 20, 7, 18, 9, 14, 6, 11];

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [search, setSearch] = useState('');
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

  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>(
      '.header-search-input',
    );
    if (!input) return;

    const onInput = () => setSearch(input.value);
    input.addEventListener('input', onInput);
    return () => input.removeEventListener('input', onInput);
  }, [loading]);

  const filtered = useMemo(() => {
    let result = looks;
    if (filter !== 'all') {
      result = result.filter((l) => l.tag === filter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          STYLE_LABELS[l.tag].toLowerCase().includes(q) ||
          l.occasion.toLowerCase().includes(q) ||
          l.season.toLowerCase().includes(q),
      );
    }
    return result;
  }, [looks, filter, search]);

  const ranked = useMemo(() => looks.slice(0, 5), [looks]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="campaign-banner" aria-label="Season campaign">
        <div className="campaign-inner">
          <span className="campaign-badge">SUPER STYLE SALE</span>
          <h1 className="campaign-title">
            Shopping is <strong>entertainment</strong> — discover your next look
          </h1>
          <p className="campaign-sub">
            Earn up to <span className="campaign-points">20× style points</span>{' '}
            on trending edits. Free shipping on album saves this week.
          </p>
        </div>
      </section>

      <section className="category-tabs" aria-label="Style filters">
        <button
          type="button"
          className={filter === 'all' ? 'category-tab active' : 'category-tab'}
          onClick={() => setFilter('all')}
        >
          All looks
        </button>
        {STYLE_ORDER.map((tag) => (
          <button
            key={tag}
            type="button"
            className={filter === tag ? 'category-tab active' : 'category-tab'}
            onClick={() => setFilter(tag)}
          >
            {STYLE_LABELS[tag]}
          </button>
        ))}
      </section>

      <div className="home-layout">
        <div className="home-main">
          <section className="content-module" aria-labelledby="popular-heading">
            <div className="module-header">
              <h2 id="popular-heading" className="module-title">
                Popular looks ranking
              </h2>
              <span className="module-meta">{filtered.length} items</span>
            </div>

            {filtered.length === 0 ? (
              <p className="empty-state">No looks match this filter.</p>
            ) : (
              <div className="product-grid">
                {filtered.map((look, i) => (
                  <Link
                    key={look.id}
                    to={`/look/${look.id}`}
                    className="product-card"
                  >
                    <div className="product-rank">{i + 1}</div>
                    <div className="product-img-wrap">
                      <img
                        src={look.hero}
                        alt=""
                        className="product-img"
                        loading={i < 8 ? 'eager' : 'lazy'}
                      />
                    </div>
                    <div className="product-body">
                      <span className="product-tag">{STYLE_LABELS[look.tag]}</span>
                      <h3 className="product-title">{look.title}</h3>
                      <p className="product-occasion">{look.occasion}</p>
                      <div className="product-footer">
                        <span className="product-points">
                          {POINTS[i % POINTS.length]}× pts
                        </span>
                        <span className="product-cta">View look →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section
            className="content-module content-module--alt"
            aria-labelledby="categories-heading"
          >
            <h2 id="categories-heading" className="module-title">
              Shop by style category
            </h2>
            <div className="category-bento">
              {STYLE_ORDER.map((tag) => {
                const count = looks.filter((l) => l.tag === tag).length;
                const sample = looks.find((l) => l.tag === tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    className="category-tile"
                    onClick={() => setFilter(tag)}
                  >
                    {sample && (
                      <img
                        src={sample.hero}
                        alt=""
                        className="category-tile-img"
                      />
                    )}
                    <span className="category-tile-label">
                      {STYLE_LABELS[tag]}
                    </span>
                    <span className="category-tile-count">{count} looks</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="home-sidebar" aria-label="Sidebar">
          <section className="sidebar-module">
            <h2 className="sidebar-title">Today's ranking</h2>
            <ol className="ranking-list">
              {ranked.map((look, i) => (
                <li key={look.id} className="ranking-item">
                  <span
                    className={`ranking-num${i < 3 ? ' ranking-num--top' : ''}`}
                  >
                    {i + 1}
                  </span>
                  <Link to={`/look/${look.id}`} className="ranking-link">
                    <img
                      src={look.hero}
                      alt=""
                      className="ranking-thumb"
                    />
                    <span className="ranking-info">
                      <span className="ranking-name">{look.title}</span>
                      <span className="ranking-tag">{STYLE_LABELS[look.tag]}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section className="sidebar-module sidebar-module--promo">
            <p className="promo-eyebrow">Member benefit</p>
            <p className="promo-text">
              Save looks to albums and earn bonus style points on every collection.
            </p>
            <Link to="/albums" className="promo-btn">
              My albums
            </Link>
          </section>

          <section className="sidebar-module">
            <h2 className="sidebar-title">Quick links</h2>
            <ul className="quick-links">
              <li>
                <a href="#sale">Season sale</a>
              </li>
              <li>
                <a href="#new">New arrivals</a>
              </li>
              <li>
                <a href="#trending">Trending now</a>
              </li>
              <li>
                <Link to="/albums">Saved collections</Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
