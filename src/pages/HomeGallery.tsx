import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

function isStyleTag(value: string | null): value is StyleTag {
  return value !== null && (STYLE_ORDER as string[]).includes(value);
}

function toSentenceList(items: string[]): string {
  const lower = items.map((item) => item.toLowerCase());
  if (lower.length < 2) return lower.join('');
  return `${lower.slice(0, -1).join(', ')} and ${lower[lower.length - 1]}`;
}

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const styleParam = searchParams.get('style');
  const filter: StyleTag | 'all' = isStyleTag(styleParam) ? styleParam : 'all';

  // A style in the URL (e.g. from a footer link) means the visitor asked for
  // the wall, not the top of the page.
  const pendingScroll = useRef(isStyleTag(styleParam));

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
    if (loading || !pendingScroll.current) return;
    pendingScroll.current = false;
    document.getElementById('gallery')?.scrollIntoView();
  }, [loading]);

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  const featured = useMemo(
    () => looks.find((l) => l.tag === 'minimal') ?? looks[0],
    [looks]
  );

  function selectFilter(next: StyleTag | 'all') {
    setSearchParams(next === 'all' ? {} : { style: next }, { replace: true });
  }

  if (loading) {
    return (
      <div className="wrap">
        <p className="page-loading">Loading the lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="hero wrap">
        <div className="hero-grid">
          <h1 className="hero-title">
            A menswear{' '}
            <a className="ilink" href="#gallery">
              lookbook
            </a>{' '}
            built on restraint, not volume.
          </h1>
          <div className="hero-side">
            <p className="lede">
              {looks.length} outfits across {STYLE_ORDER.length} aesthetics,
              photographed for reference rather than checkout. Read a look, note
              what it is built from, and keep the ones worth returning to.
            </p>
            <div className="hero-actions">
              <a className="btn primary" href="#gallery">
                Browse the gallery
              </a>
              <Link className="btn ghost" to="/albums">
                See albums
              </Link>
            </div>
          </div>
        </div>
      </section>

      {featured && (
        <section className="wrap">
          <article className="feature-card">
            <div className="feature-copy">
              <p className="eyebrow">Featured edit · {featured.season}</p>
              <h2 className="feature-title">{featured.title}</h2>
              <p className="feature-body">
                {STYLE_LABELS[featured.tag]}, cut for{' '}
                {featured.occasion.toLowerCase()} and built around{' '}
                {toSentenceList(featured.keyItems)}.
              </p>
              <dl className="feature-meta">
                <div>
                  <dt>Season</dt>
                  <dd>{featured.season}</dd>
                </div>
                <div>
                  <dt>Occasion</dt>
                  <dd>{featured.occasion}</dd>
                </div>
                <div>
                  <dt>Aesthetic</dt>
                  <dd>{STYLE_LABELS[featured.tag]}</dd>
                </div>
              </dl>
              <Link className="ilink feature-link" to={`/look/${featured.id}`}>
                See the full look →
              </Link>
            </div>
            <div className="feature-visual">
              <img src={featured.hero} alt="" />
            </div>
          </article>
        </section>
      )}

      <section className="wrap section-gap">
        <div className="section-head">
          <h2 className="section-title">Start here</h2>
        </div>
        <div className="note-grid">
          <div className="note-card">
            <h3>The wall</h3>
            <p>
              Every look sits on one offset wall rather than a catalogue grid,
              so the photography sets the pace.
            </p>
            <a className="ilink" href="#gallery">
              Jump to the wall →
            </a>
          </div>
          <div className="note-card">
            <h3>Five aesthetics</h3>
            <p>
              Minimal, streetwear, classic, athleisure and workwear. One tag per
              look, no fifty-facet filter panel.
            </p>
            <Link className="ilink" to="/?style=minimal">
              Start with minimal →
            </Link>
          </div>
          <div className="note-card">
            <h3>Albums</h3>
            <p>
              Save looks into named albums. They live in this browser, so they
              survive a refresh without an account.
            </p>
            <Link className="ilink" to="/albums">
              Open albums →
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap section-gap" id="gallery">
        <div className="section-head">
          <h2 className="section-title">The wall</h2>
          <p className="section-count">
            {filter === 'all'
              ? `${looks.length} looks`
              : `${filtered.length} of ${looks.length} looks`}
          </p>
        </div>

        <div className="filters-bar" aria-label="Style filters">
          <button
            type="button"
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => selectFilter('all')}
          >
            All looks
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'filter-btn active' : 'filter-btn'}
              onClick={() => selectFilter(tag)}
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
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="look-card"
              >
                <img
                  src={look.hero}
                  alt=""
                  className="look-card-img"
                  loading={i < 3 ? 'eager' : 'lazy'}
                />
                <div className="look-card-body">
                  <p className="eyebrow">{STYLE_LABELS[look.tag]}</p>
                  <h3 className="look-card-title">{look.title}</h3>
                  <span className="look-card-cta">View look →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="band-dark">
        <div className="wrap band-inner">
          <div>
            <p className="eyebrow">Keep what you find</p>
            <h2 className="band-title">
              Albums are the point. Everything else is browsing.
            </h2>
          </div>
          <div>
            <p className="band-body">
              Create as many as you like — seasonal, occasion-based, or one
              running list. Albums are stored locally in this browser, with no
              account and no sync.
            </p>
            <div className="band-actions">
              <Link className="btn clay" to="/albums">
                Start an album
              </Link>
              <a className="btn ghost" href="#gallery">
                Back to the wall
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
