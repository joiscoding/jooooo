import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

function staggerClass(index: number): string {
  const mod = index % 6;
  if (mod === 0 || mod === 3) return 'wall-card--tall';
  if (mod === 2 || mod === 5) return 'wall-card--wide';
  return '';
}

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
      <div className="page-loading page-loading--lineman">
        <p className="muted">LOADING_LOOKBOOK…</p>
      </div>
    );
  }

  return (
    <div className="home home--lineman">
      <section className="lineman-hero" aria-labelledby="lineman-hero-title">
        <div className="lineman-hero__bg" aria-hidden="true" />
        <div className="lineman-hero__grid" aria-hidden="true" />
        <div className="lineman-hero__content">
          <p className="eyebrow lineman-eyebrow">
            <span className="lineman-eyebrow__dot" aria-hidden="true" />
            Live field · Men&apos;s lookbook
          </p>
          <h1 id="lineman-hero-title" className="lineman-hero__title">
            BUILT FOR THE <span className="lineman-hero__title-accent">LINE</span>
          </h1>
          <p className="lineman-hero__lede">
            Utility layers, clear voltage, no noise—outfit notes from the
            field. Scroll to the look wall or filter by run.
          </p>
          <p className="lineman-hero__meta">
            <span className="lineman-hero__meta-item">
              {looks.length} circuits connected
            </span>
            <span className="lineman-hero__meta-sep" aria-hidden="true">
              |
            </span>
            <span className="lineman-hero__meta-item">
              5 style channels
            </span>
          </p>
        </div>
        <a href="#look-wall" className="lineman-hero__scroll">
          To look wall
        </a>
      </section>

      <div className="lineman-main-wrap" id="look-wall">
        <div className="lineman-loco-bar" aria-hidden="true">
          <span className="lineman-loco-bar__strip" />
          <span className="lineman-loco-bar__strip" />
        </div>

        <div className="lineman-canvas">
          <section
            className="lineman-ribbon"
            aria-label="Collection notes"
          >
            <h2 className="lineman-ribbon__h">LOOKS · GALLERY</h2>
            <p className="lineman-ribbon__sub">
              Filter by line—staggered wall, same rhythm as the spec.
            </p>
          </section>

          <section className="filters-bar filters-bar--lineman" aria-label="Style filters">
            <button
              type="button"
              className={
                filter === 'all' ? 'filter-pill active' : 'filter-pill'
              }
              onClick={() => setFilter('all')}
            >
              All runs
            </button>
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                className={
                  filter === tag ? 'filter-pill active' : 'filter-pill'
                }
                onClick={() => setFilter(tag)}
              >
                {STYLE_LABELS[tag]}
              </button>
            ))}
          </section>

          {filtered.length === 0 ? (
            <p className="empty-state empty-state--lineman">No looks on this line.</p>
          ) : (
            <div className="gallery-wall gallery-wall--staggered">
              {filtered.map((look, i) => {
                return (
                  <Link
                    key={look.id}
                    to={`/look/${look.id}`}
                    className={`wall-card ${staggerClass(i)}`.trim()}
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
      </div>
    </div>
  );
}
