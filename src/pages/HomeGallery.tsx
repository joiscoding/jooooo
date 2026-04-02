import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const VALID_TAGS = new Set<StyleTag>(STYLE_ORDER);

function pickLook(looks: Look[], predicate: (l: Look) => boolean): Look | undefined {
  return looks.find(predicate);
}

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

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
    const tag = searchParams.get('tag');
    if (tag && VALID_TAGS.has(tag as StyleTag)) {
      setFilter(tag as StyleTag);
    } else if (!tag) {
      setFilter('all');
    }
  }, [searchParams]);

  const setFilterAndUrl = (next: StyleTag | 'all') => {
    setFilter(next);
    if (next === 'all') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ tag: next }, { replace: true });
    }
  };

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  const campaignLook = useMemo(
    () =>
      pickLook(looks, (l) => l.tag === 'classic') ??
      pickLook(looks, (l) => l.tag === 'minimal') ??
      looks[0],
    [looks]
  );

  const featureStories = useMemo(() => {
    const heritage =
      pickLook(looks, (l) => l.tag === 'workwear') ?? looks[0];
    const tailored =
      pickLook(looks, (l) => l.id === 'boardroom-soft') ??
      pickLook(looks, (l) => l.tag === 'classic') ??
      looks[0];
    const motion =
      pickLook(looks, (l) => l.tag === 'streetwear') ??
      pickLook(looks, (l) => l.tag === 'athleisure') ??
      looks[0];
    return [
      {
        look: heritage,
        kicker: 'Heritage',
        headline: 'Icons that age with you',
        sub: 'Workwear weight, quiet confidence.',
      },
      {
        look: tailored,
        kicker: 'Tailoring',
        headline: 'Sophisticated sportswear',
        sub: 'Structure without stiffness.',
      },
      {
        look: motion,
        kicker: 'In motion',
        headline: 'Street & sport energy',
        sub: 'Ease for the city and the weekend.',
      },
    ].filter((s) => s.look);
  }, [looks]);

  const categoryChips: { tag: StyleTag; label: string }[] = [
    { tag: 'classic', label: 'Classic' },
    { tag: 'minimal', label: 'Refined casual' },
    { tag: 'athleisure', label: 'Sport' },
    { tag: 'streetwear', label: 'Urban' },
    { tag: 'workwear', label: 'Heritage' },
  ];

  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home home-rl">
      {campaignLook && (
        <section className="rl-hero rl-fullbleed" aria-label="Campaign">
          <div className="rl-hero-media">
            <img
              src={campaignLook.hero}
              alt=""
              className="rl-hero-img"
              fetchPriority="high"
            />
            <div className="rl-hero-scrim" aria-hidden />
          </div>
          <div className="rl-hero-copy">
            <p className="rl-hero-eyebrow">Men · Seasonal edit</p>
            <h1 className="rl-hero-title">
              Timeless ease, <em>American</em> sport.
            </h1>
            <p className="rl-hero-lede">
              Polished charm and relaxed energy—looks for work, travel, and
              weekends away.
            </p>
            <div className="rl-hero-cta">
              <button type="button" className="rl-btn rl-btn-light" onClick={scrollToCollection}>
                Shop the edit
              </button>
              <Link to={`/look/${campaignLook.id}`} className="rl-btn rl-btn-ghost-light">
                View featured look
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="home-inner">
        <section className="rl-features" aria-labelledby="rl-features-heading">
          <h2 id="rl-features-heading" className="visually-hidden">
            Featured stories
          </h2>
          <div className="rl-feature-grid">
            {featureStories.map(({ look, kicker, headline, sub }) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="rl-feature-card"
              >
                <div className="rl-feature-media">
                  <img src={look.hero} alt="" className="rl-feature-img" loading="lazy" />
                  <div className="rl-feature-scrim" aria-hidden />
                </div>
                <div className="rl-feature-copy">
                  <span className="rl-feature-kicker">{kicker}</span>
                  <h3 className="rl-feature-headline">{headline}</h3>
                  <p className="rl-feature-sub">{sub}</p>
                  <span className="rl-feature-shop">Shop now</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rl-shop-strip" aria-label="Shop by category">
          <p className="rl-shop-strip-label">Shop by category</p>
          <div className="rl-shop-strip-track">
            {categoryChips.map(({ tag, label }) => (
              <button
                key={tag}
                type="button"
                className="rl-category-chip"
                onClick={() => {
                  setFilterAndUrl(tag);
                  scrollToCollection();
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section id="collection" className="rl-collection">
          <header className="rl-collection-head">
            <h2 className="rl-collection-title">The collection</h2>
            <p className="rl-collection-dek">
              Every look in the edit—filter by mood.
            </p>
          </header>

          <div className="filters-bar" aria-label="Style filters">
            <button
              type="button"
              className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setFilterAndUrl('all')}
            >
              All looks
            </button>
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                className={filter === tag ? 'filter-pill active' : 'filter-pill'}
                onClick={() => setFilterAndUrl(tag)}
              >
                {STYLE_LABELS[tag]}
              </button>
            ))}
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
                      <img
                        key={`${look.id}-${look.hero}`}
                        src={look.hero}
                        alt=""
                        className="wall-img"
                        loading={i < 4 ? 'eager' : 'lazy'}
                      />
                      <div className="wall-meta">
                        <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                        <h3 className="wall-title">{look.title}</h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
