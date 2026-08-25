import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HeroCarousel, type HeroSlide } from '../components/HeroCarousel';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER, STYLE_SHORT_LABELS } from '../types';

const HERO_COPY: Record<
  string,
  { kicker: string; title: string; copy: string; ctaLabel: string }
> = {
  'boardroom-soft': {
    kicker: 'Classic looks',
    title: 'Looks built for the workweek.',
    copy: 'Unstructured tailoring and quiet fabrics for days that run long.',
    ctaLabel: 'Shop classic',
  },
  'crosswalk-khaki': {
    kicker: 'Limited-time edit',
    title: 'Shop the urban must-haves.',
    copy: 'Street-ready layers, sneakers, and utility pieces for downtown days.',
    ctaLabel: 'Shop streetwear',
  },
  'track-recovery': {
    kicker: 'Athleisure',
    title: 'Power your downtime.',
    copy: 'Performance-inspired pieces that move from the gym to the commute.',
    ctaLabel: 'Shop athleisure',
  },
};

const HERO_IDS = ['boardroom-soft', 'crosswalk-khaki', 'track-recovery'] as const;

function isStyleTag(value: string | null): value is StyleTag {
  return STYLE_ORDER.includes(value as StyleTag);
}

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const tagParam = searchParams.get('tag');
  const filter: StyleTag | 'all' = isStyleTag(tagParam) ? tagParam : 'all';
  const query = (searchParams.get('q') ?? '').trim().toLowerCase();

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

  const categoryLooks = useMemo(() => {
    return STYLE_ORDER.map((tag) => looks.find((l) => l.tag === tag)).filter(
      (l): l is Look => Boolean(l),
    );
  }, [looks]);

  const slides: HeroSlide[] = useMemo(() => {
    return HERO_IDS.flatMap((id) => {
      const look = looks.find((l) => l.id === id);
      const copy = HERO_COPY[id];
      if (!look || !copy) return [];
      return [
        {
          id: look.id,
          image: look.hero,
          kicker: copy.kicker,
          title: copy.title,
          copy: copy.copy,
          ctaLabel: copy.ctaLabel,
          to: `/look/${look.id}`,
        },
      ];
    });
  }, [looks]);

  const filtered = useMemo(() => {
    return looks.filter((l) => {
      if (filter !== 'all' && l.tag !== filter) return false;
      if (!query) return true;
      const hay = `${l.title} ${l.occasion} ${l.season} ${l.keyItems.join(' ')} ${STYLE_LABELS[l.tag]}`.toLowerCase();
      return hay.includes(query);
    });
  }, [looks, filter, query]);

  function setFilter(next: StyleTag | 'all') {
    const nextParams = new URLSearchParams(searchParams);
    if (next === 'all') nextParams.delete('tag');
    else nextParams.set('tag', next);
    setSearchParams(nextParams, { replace: true });
    document.getElementById('must-haves')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  const mustHaveTitle =
    filter === 'all' ? 'Shop these must-haves' : `Shop ${STYLE_SHORT_LABELS[filter].toLowerCase()} looks`;

  return (
    <div className="home">
      <div className="promo-ribbon">
        <p>
          Save looks locally in albums — no account needed.{' '}
          <Link to="/albums">View albums</Link>
        </p>
      </div>

      <section className="category-rail" aria-label="Shop by style">
        <div className="category-rail-inner">
          <button
            type="button"
            className={filter === 'all' ? 'category-item current' : 'category-item'}
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            <span className="category-circle category-circle-all" aria-hidden="true">
              All
            </span>
            <span className="category-label">All looks</span>
          </button>
          {categoryLooks.map((look) => (
            <button
              key={look.tag}
              type="button"
              className={filter === look.tag ? 'category-item current' : 'category-item'}
              aria-pressed={filter === look.tag}
              onClick={() => setFilter(look.tag)}
            >
              <span className="category-circle">
                <img src={look.hero} alt="" />
              </span>
              <span className="category-label">{STYLE_SHORT_LABELS[look.tag]}</span>
            </button>
          ))}
          <Link to="/albums" className="category-item">
            <span className="category-circle category-circle-all" aria-hidden="true">
              Saved
            </span>
            <span className="category-label">Albums</span>
          </Link>
        </div>
      </section>

      <HeroCarousel slides={slides} />

      <section className="home-section" aria-labelledby="our-looks-heading">
        <div className="home-section-inner">
          <h2 id="our-looks-heading" className="section-title">
            Our looks
          </h2>
          <div className="product-tiles">
            {categoryLooks.map((look) => (
              <article key={look.tag} className="product-tile">
                <button
                  type="button"
                  className="product-tile-media"
                  onClick={() => setFilter(look.tag)}
                >
                  <img src={look.hero} alt="" />
                </button>
                <div className="product-tile-body">
                  <h3>{STYLE_SHORT_LABELS[look.tag]}</h3>
                  <p>{STYLE_LABELS[look.tag]}</p>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setFilter(look.tag)}
                  >
                    Shop
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section-tint" aria-labelledby="promo-heading">
        <div className="home-section-inner">
          <h2 id="promo-heading" className="visually-hidden">
            Featured offers
          </h2>
          <div className="promo-grid">
            <article className="promo-card">
              <div className="promo-card-copy">
                <p className="hero-kicker">Albums</p>
                <h3>Save the looks you want to wear.</h3>
                <p>Create named albums in this browser and add looks from any detail page.</p>
                <Link to="/albums" className="btn primary">
                  Open albums
                </Link>
              </div>
            </article>
            <article className="promo-card promo-card-photo">
              {looks[0] ? (
                <>
                  <img src={looks[0].hero} alt="" />
                  <div className="promo-card-overlay">
                    <p className="hero-kicker">New this season</p>
                    <h3>{looks[0].title}</h3>
                    <Link to={`/look/${looks[0].id}`} className="btn on-dark">
                      Shop now
                    </Link>
                  </div>
                </>
              ) : null}
            </article>
          </div>
        </div>
      </section>

      <section
        id="must-haves"
        className="home-section"
        aria-labelledby="must-haves-heading"
      >
        <div className="home-section-inner">
          <div className="section-head">
            <h2 id="must-haves-heading" className="section-title">
              {mustHaveTitle}
            </h2>
            {query ? (
              <p className="muted">
                Showing results for “{query}”
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete('q');
                    setSearchParams(next, { replace: true });
                  }}
                >
                  Clear search
                </button>
              </p>
            ) : null}
          </div>
          {filtered.length === 0 ? (
            <p className="empty-state">No looks in this filter.</p>
          ) : (
            <div className="must-have-grid">
              {filtered.map((look, i) => (
                <article key={look.id} className="must-have-card">
                  <Link to={`/look/${look.id}`} className="must-have-media">
                    <img
                      src={look.hero}
                      alt=""
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
                  </Link>
                  <div className="must-have-body">
                    <p className="must-have-tag">{STYLE_SHORT_LABELS[look.tag]}</p>
                    <h3>
                      <Link to={`/look/${look.id}`}>{look.title}</Link>
                    </h3>
                    <p className="must-have-meta">
                      {look.occasion} · {look.season}
                    </p>
                    <Link to={`/look/${look.id}`} className="text-link">
                      Shop
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
