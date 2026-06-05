import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const TICKER_WORDS = [
  'SS26',
  'Soft Tailoring',
  'Languid Layers',
  'Undone Polish',
  'Pajama Dressing',
  'Tomato · Butter · Cobalt',
  'Volume on the Shoulder',
  'Flip-Flop Chic',
  'Lived-in Linen',
  'Polished Boho',
  'Heritage Workwear',
  'Quiet Confidence',
];

const MANIFESTO: Array<{ num: string; title: string; body: string }> = [
  {
    num: '01 — On Volume',
    title: 'Soft on the shoulder.',
    body:
      'A relaxed line at the jacket, a longer drop at the trouser. SS26 trades structure for ease, with silhouettes that move with you rather than around you.',
  },
  {
    num: '02 — On Colour',
    title: 'Warm against neutral.',
    body:
      'Tomato, butter, cobalt and faded pink — used like punctuation on a foundation of stone, sand and graphite. Photography does the loud work.',
  },
  {
    num: '03 — On Pace',
    title: 'Slow, then sharp.',
    body:
      'Lived-in fabrics, intentional creases, an evening worth of unhurry. Dressed-up moments edited down to the essentials, never overstyled.',
  },
];

function pad(n: number) {
  return n.toString().padStart(2, '0');
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

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: looks.length };
    for (const tag of STYLE_ORDER) {
      map[tag] = looks.filter((l) => l.tag === tag).length;
    }
    return map;
  }, [looks]);

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  const featured = looks[0];
  const featuredThumbs = useMemo(() => looks.slice(1, 3), [looks]);

  if (loading) {
    return (
      <div className="page-loading">
        <p>Loading SS26 lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* ============== HERO ============== */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-inner">
          <div>
            <p className="eyebrow">
              <span className="marker" aria-hidden="true" />
              Spring / Summer 2026 · The Languid Edit
            </p>
            <h1 id="hero-heading" className="hero-display">
              Soft <span className="italic">power,</span>
              <br />
              <span className="accent">undone.</span>
            </h1>
          </div>
          <div>
            <p className="hero-lede">
              An editorial study in soft tailoring, lived-in texture and the
              quiet confidence of dressing without trying.
            </p>
            <dl className="hero-meta">
              <dt>Volume</dt>
              <dd>04 · Issue 26</dd>
              <dt>Looks</dt>
              <dd>{pad(looks.length)} editorial</dd>
              <dt>Palette</dt>
              <dd>Stone · Tomato · Cobalt</dd>
              <dt>Tempo</dt>
              <dd>Slow, deliberate</dd>
            </dl>
            <div className="hero-cta-row">
              <a href="#index" className="btn-link solid">
                Browse the index
              </a>
              <Link to="/albums" className="btn-link">
                My albums
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============== TICKER ============== */}
      <div
        className="ticker"
        aria-label="Season key words"
      >
        <div className="ticker-track">
          {[...TICKER_WORDS, ...TICKER_WORDS].map((w, i) => (
            <span key={`${w}-${i}`}>{w}</span>
          ))}
        </div>
      </div>

      {/* ============== FEATURED CAMPAIGN ============== */}
      {featured && (
        <section className="campaign" aria-labelledby="campaign-heading">
          <div className="campaign-inner">
            <Link to={`/look/${featured.id}`} className="campaign-figure">
              <span className="figure-num">No. 01 — Cover Look</span>
              <img src={featured.hero} alt={featured.title} loading="eager" />
            </Link>
            <aside className="campaign-aside">
              <div>
                <p className="eyebrow">Cover · {STYLE_LABELS[featured.tag]}</p>
                <h2 id="campaign-heading" className="campaign-title">
                  <em>{featured.title}.</em>{' '}
                  Tailoring at the lower volume.
                </h2>
                <p className="campaign-body">
                  The season opens with a long, unhurried line — fabric that
                  falls instead of holds, colour borrowed from stone and
                  evening light. Worn for {featured.occasion.toLowerCase()},
                  styled like an afterthought.
                </p>
                <ul className="campaign-tags">
                  {featured.keyItems.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
                <Link
                  to={`/look/${featured.id}`}
                  className="btn-link"
                >
                  Open the look →
                </Link>
              </div>

              {featuredThumbs.length > 0 && (
                <div className="campaign-thumb-row">
                  {featuredThumbs.map((look, idx) => (
                    <Link
                      key={look.id}
                      to={`/look/${look.id}`}
                      className="campaign-thumb"
                    >
                      <img src={look.hero} alt={look.title} loading="lazy" />
                      <span className="thumb-label">
                        No. {pad(idx + 2)} · {look.title}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </section>
      )}

      {/* ============== MANIFESTO ============== */}
      <section className="manifesto" aria-label="Editorial notes">
        <div className="manifesto-inner">
          {MANIFESTO.map((m) => (
            <article key={m.num} className="manifesto-block">
              <span className="num">{m.num}</span>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ============== STYLE INDEX + FILTERS ============== */}
      <section
        className="style-index"
        id="index"
        aria-labelledby="index-heading"
      >
        <div className="style-index-inner">
          <div className="style-index-head">
            <h2 id="index-heading" className="style-index-title">
              The Index.
            </h2>
            <span className="style-index-meta">
              {pad(filtered.length)} / {pad(looks.length)} looks
            </span>
          </div>
          <div
            className="filters-bar"
            role="tablist"
            aria-label="Style filters"
          >
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setFilter('all')}
            >
              All <span className="count">· {pad(counts.all ?? 0)}</span>
            </button>
            {STYLE_ORDER.map((tag, i) => (
              <button
                key={tag}
                type="button"
                role="tab"
                aria-selected={filter === tag}
                className={
                  filter === tag ? 'filter-pill active' : 'filter-pill'
                }
                onClick={() => setFilter(tag)}
              >
                {pad(i + 1)} {STYLE_LABELS[tag]}{' '}
                <span className="count">· {pad(counts[tag] ?? 0)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============== GALLERY WALL ============== */}
      <section className="gallery-section" aria-label="Looks gallery">
        <div className="gallery-section-inner">
          {filtered.length === 0 ? (
            <p className="empty-state">No looks in this filter.</p>
          ) : (
            <div
              className={
                filtered.length < 6 ? 'gallery-wall compact' : 'gallery-wall'
              }
            >
              {filtered.map((look, i) => (
                <Link
                  key={look.id}
                  to={`/look/${look.id}`}
                  className="wall-card"
                  aria-label={`${look.title} — ${STYLE_LABELS[look.tag]}`}
                >
                  <div className="wall-card-inner">
                    <img
                      key={`${look.id}-${look.hero}`}
                      src={look.hero}
                      alt=""
                      className="wall-img"
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
                    <span className="wall-num">N° {pad(i + 1)}</span>
                    <div className="wall-meta">
                      <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                      <h3 className="wall-title">{look.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
