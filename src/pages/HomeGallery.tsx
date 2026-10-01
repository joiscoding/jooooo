import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchLooks } from '../data/fetchLooks';
import { LookCard } from '../components/LookCard';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER, STYLE_SHORT_LABELS } from '../types';

type Filter = StyleTag | 'all';

const HERO_LOOK_ID = 'track-recovery';

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const galleryRef = useRef<HTMLElement>(null);

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

  // One representative look per style for the browse tiles.
  const styleTiles = useMemo(
    () =>
      STYLE_ORDER.map((tag) => {
        const inTag = looks.filter((l) => l.tag === tag);
        return { tag, cover: inTag[0]?.hero, count: inTag.length };
      }).filter((t) => t.cover),
    [looks]
  );

  const heroLook = looks.find((l) => l.id === HERO_LOOK_ID) ?? looks[0];

  function chooseFilter(next: Filter) {
    setFilter(next);
    galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      {heroLook && (
        <section className="campaign-hero" aria-labelledby="campaign-title">
          <img
            src={heroLook.hero}
            alt=""
            className="campaign-img"
            loading="eager"
          />
          <div className="campaign-copy">
            <p className="eyebrow light">Men · New for the season</p>
            <h1 id="campaign-title" className="campaign-title">
              Made for the way <em>you</em> move.
            </h1>
            <p className="campaign-lede">
              {looks.length} looks across five styles — from quiet neutrals to
              trail-ready layers.
            </p>
            <div className="campaign-actions">
              <button
                type="button"
                className="btn light"
                onClick={() => chooseFilter('all')}
              >
                Explore all looks
              </button>
              <button
                type="button"
                className="btn outline-light"
                onClick={() => chooseFilter('athleisure')}
              >
                Athleisure edit
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="browse" aria-labelledby="browse-title">
        <div className="section-head">
          <h2 id="browse-title" className="section-title">
            Browse by style
          </h2>
          <p className="section-note">Five edits. Pick your pace.</p>
        </div>
        <div className="style-rail">
          {styleTiles.map(({ tag, cover, count }) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'style-tile active' : 'style-tile'}
              onClick={() => chooseFilter(tag)}
              aria-pressed={filter === tag}
            >
              <span className="style-tile-media">
                <img src={cover} alt="" loading="lazy" />
              </span>
              <span className="style-tile-name">{STYLE_SHORT_LABELS[tag]}</span>
              <span className="style-tile-count">
                {count} look{count === 1 ? '' : 's'}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section
        className="gallery"
        ref={galleryRef}
        aria-labelledby="gallery-title"
      >
        <div className="section-head">
          <h2 id="gallery-title" className="section-title">
            {filter === 'all' ? 'All looks' : STYLE_LABELS[filter]}
            <span className="section-count">{filtered.length}</span>
          </h2>
          {filter !== 'all' && (
            <button
              type="button"
              className="text-link"
              onClick={() => setFilter('all')}
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="filters-bar" role="group" aria-label="Style filters">
          <button
            type="button"
            className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'filter-pill active' : 'filter-pill'}
              aria-pressed={filter === tag}
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
              <LookCard key={look.id} look={look} eager={i < 3} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
