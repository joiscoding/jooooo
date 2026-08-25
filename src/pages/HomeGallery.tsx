import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import { useAlbumsContext } from '../context/AlbumsContext';
import { HeroCarousel, type HeroSlide } from '../components/home/HeroCarousel';
import {
  StyleCircles,
  type StyleCircle,
} from '../components/home/StyleCircles';
import { LookRail } from '../components/home/LookRail';
import { LookCard } from '../components/home/LookCard';
import { PromoDuo, type Promo } from '../components/home/PromoDuo';
import {
  EditorialTiles,
  type EditorialTile,
} from '../components/home/EditorialTiles';
import { SupportStrip } from '../components/home/SupportStrip';
import { SignupBand } from '../components/home/SignupBand';
import type { Look, StyleTag } from '../types';
import { isStyleTag, STYLE_LABELS, STYLE_ORDER } from '../types';

/** One-click saves land here, mirroring an add-to-cart flow. */
const QUICK_ALBUM = 'My looks';

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { albums, createAlbum, addLookToAlbum } = useAlbumsContext();

  const styleParam = searchParams.get('style');
  const filter: StyleTag | 'all' = isStyleTag(styleParam) ? styleParam : 'all';
  const query = (searchParams.get('q') ?? '').trim();

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
    if (!toast) return;
    const t = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const savedIds = useMemo(
    () => new Set(albums.flatMap((a) => a.lookIds)),
    [albums]
  );

  const filtered = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return looks.filter((look) => {
      if (filter !== 'all' && look.tag !== filter) return false;
      if (terms.length === 0) return true;
      const haystack = [
        look.title,
        STYLE_LABELS[look.tag],
        look.season,
        look.occasion,
        ...look.keyItems,
      ]
        .join(' ')
        .toLowerCase();
      // Seed copy is singular ("service boot"), so a plural query still has to match.
      return terms.every(
        (term) =>
          haystack.includes(term) ||
          (term.endsWith('s') && haystack.includes(term.slice(0, -1)))
      );
    });
  }, [looks, filter, query]);

  const deals = useMemo(
    () =>
      looks
        .filter((l) => l.wasPriceUsd && l.priceUsd)
        .sort(
          (a, b) =>
            (b.wasPriceUsd! - b.priceUsd!) - (a.wasPriceUsd! - a.priceUsd!)
        )
        .slice(0, 8),
    [looks]
  );

  const newIn = useMemo(() => looks.slice().reverse().slice(0, 8), [looks]);

  const heroSlides: HeroSlide[] = useMemo(() => {
    if (looks.length === 0) return [];
    const pick = (id: string, fallback: number) =>
      looks.find((l) => l.id === id) ?? looks[fallback % looks.length];
    const tailoring = pick('boardroom-soft', 0);
    const street = pick('crosswalk-khaki', 1);
    const work = pick('utility-grain', 2);
    return [
      {
        id: 'hero-tailoring',
        eyebrow: 'New season · Autumn edit',
        headline: 'Tailoring that moves with you.',
        copy: 'Unstructured jackets, soft shoulders and trousers cut for a full day on your feet.',
        offer: 'Save up to 25% on the tailoring edit',
        ctaTo: `/look/${tailoring.id}`,
        ctaLabel: 'Shop the look',
        secondaryTo: '/?style=classic#gallery',
        secondaryLabel: 'See all classic looks',
        image: tailoring.hero,
        theme: 'blue',
      },
      {
        id: 'hero-street',
        eyebrow: 'Best seller',
        headline: 'Layers for the long commute.',
        copy: 'Boxy overshirts, relaxed chinos and sneakers that survive the walk home.',
        offer: 'Bundle three pieces, save 20%',
        ctaTo: `/look/${street.id}`,
        ctaLabel: 'Shop the look',
        secondaryTo: '/?style=streetwear#gallery',
        secondaryLabel: 'See all streetwear looks',
        image: street.hero,
        theme: 'ink',
      },
      {
        id: 'hero-work',
        eyebrow: 'Built to last',
        headline: 'Workwear with a two-year guarantee.',
        copy: 'Heavy canvas, triple-stitched seams and boots that take a resole.',
        offer: 'Free shipping and free 30-day returns',
        ctaTo: `/look/${work.id}`,
        ctaLabel: 'Shop the look',
        secondaryTo: '/?style=workwear#gallery',
        secondaryLabel: 'See all workwear looks',
        image: work.hero,
        theme: 'sand',
      },
    ];
  }, [looks]);

  const circles: StyleCircle[] = useMemo(() => {
    const imageFor = (tag: StyleTag) =>
      looks.find((l) => l.tag === tag)?.hero ?? looks[0]?.hero ?? '';
    return [
      { value: 'all', label: 'All looks', image: looks[0]?.hero ?? '' },
      ...STYLE_ORDER.map((tag) => ({
        value: tag,
        label: STYLE_LABELS[tag].split(' / ')[0],
        image: imageFor(tag),
      })),
    ];
  }, [looks]);

  const promos: Promo[] = useMemo(() => {
    const first = (tag: StyleTag) => looks.find((l) => l.tag === tag);
    return [
      {
        id: 'promo-workwear',
        kicker: 'Heritage',
        title: 'Workwear, built for weather',
        copy: 'Canvas, denim and service boots from the winter edit.',
        ctaLabel: 'Shop workwear',
        ctaTo: '/?style=workwear#gallery',
        image: first('workwear')?.hero ?? '',
      },
      {
        id: 'promo-athleisure',
        kicker: 'Performance',
        title: 'Athleisure, upgraded',
        copy: 'Technical knits and tapered joggers you can travel in.',
        ctaLabel: 'Shop athleisure',
        ctaTo: '/?style=athleisure#gallery',
        image: first('athleisure')?.hero ?? '',
      },
    ];
  }, [looks]);

  const tiles: EditorialTile[] = useMemo(() => {
    const at = (i: number) => looks[i % Math.max(looks.length, 1)]?.hero ?? '';
    return [
      {
        id: 'tile-fit',
        title: 'Fit and sizing guide',
        copy: 'How our relaxed, regular and tapered cuts actually measure up.',
        linkLabel: 'Read the guide',
        linkTo: '/#support',
        image: at(4),
      },
      {
        id: 'tile-albums',
        title: 'Build an album',
        copy: 'Save looks into named albums and pick them up on your next visit.',
        linkLabel: 'Go to albums',
        linkTo: '/albums',
        image: at(7),
      },
      {
        id: 'tile-care',
        title: 'Materials and care',
        copy: 'What the fabrics are, where they come from and how to keep them.',
        linkLabel: 'Learn more',
        linkTo: '/#support',
        image: at(9),
      },
    ];
  }, [looks]);

  function applyStyle(next: StyleTag | 'all', scroll: boolean) {
    const params = new URLSearchParams(searchParams);
    if (next === 'all') params.delete('style');
    else params.set('style', next);
    setSearchParams(params);
    if (scroll) {
      requestAnimationFrame(() =>
        document.getElementById('gallery')?.scrollIntoView({ block: 'start' })
      );
    }
  }

  function clearSearch() {
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    setSearchParams(params);
  }

  function handleSave(look: Look) {
    const album = albums.find((a) => a.name === QUICK_ALBUM) ?? createAlbum(QUICK_ALBUM);
    if (album.lookIds.includes(look.id)) {
      setToast(`“${look.title}” is already in ${QUICK_ALBUM}.`);
      return;
    }
    addLookToAlbum(album.id, look.id);
    setToast(`“${look.title}” saved to ${QUICK_ALBUM}.`);
  }

  if (loading) {
    return (
      <div className="hp-container page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <HeroCarousel slides={heroSlides} />

      <StyleCircles
        circles={circles}
        active={filter}
        onSelect={(value) => applyStyle(value, true)}
      />

      <LookRail
        id="deals"
        eyebrow="Ends Sunday"
        title="Deals of the week"
        seeAllTo="/#gallery"
        seeAllLabel="See all deals"
        looks={deals}
        savedIds={savedIds}
        onSave={handleSave}
      />

      <PromoDuo promos={promos} />

      <LookRail
        id="new-in"
        eyebrow="Just landed"
        title="New this season"
        seeAllTo="/#gallery"
        seeAllLabel="See all new looks"
        looks={newIn}
        savedIds={savedIds}
        onSave={handleSave}
      />

      <section className="hp-section" id="gallery" aria-labelledby="gallery-h">
        <div className="hp-container">
          <div className="hp-section-head">
            <div>
              <p className="hp-section-eyebrow">Men · Seasonal edit</p>
              <h2 id="gallery-h" className="hp-section-title">
                {query ? `Results for “${query}”` : 'Shop all looks'}
              </h2>
            </div>
            <p className="hp-result-count">
              {filtered.length} of {looks.length} looks
              {query && (
                <button
                  type="button"
                  className="hp-clear-btn"
                  onClick={clearSearch}
                >
                  Clear search
                </button>
              )}
            </p>
          </div>

          <div className="filters-bar" aria-label="Style filters" role="group">
            <button
              type="button"
              className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
              aria-pressed={filter === 'all'}
              onClick={() => applyStyle('all', false)}
            >
              All looks
            </button>
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                className={filter === tag ? 'filter-pill active' : 'filter-pill'}
                aria-pressed={filter === tag}
                onClick={() => applyStyle(tag, false)}
              >
                {STYLE_LABELS[tag]}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="empty-state">
              No looks match that filter.{' '}
              <button
                type="button"
                className="hp-clear-btn"
                onClick={() => applyStyle('all', false)}
              >
                Reset filters
              </button>
            </p>
          ) : (
            <ul className="hp-card-grid">
              {filtered.map((look, i) => (
                <LookCard
                  key={look.id}
                  look={look}
                  saved={savedIds.has(look.id)}
                  onSave={handleSave}
                  eager={i < 4}
                />
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="hp-section" aria-labelledby="wall-h">
        <div className="hp-container">
          <div className="hp-section-head">
            <div>
              <p className="hp-section-eyebrow">Shot on location</p>
              <h2 id="wall-h" className="hp-section-title">
                From the lookbook
              </h2>
            </div>
            <Link to="/#gallery" className="hp-see-all">
              Browse the full gallery
              <span aria-hidden>&nbsp;›</span>
            </Link>
          </div>
          <div className="gallery-wall">
            {looks.slice(0, 6).map((look) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="wall-card"
              >
                <div className="wall-card-inner">
                  <img src={look.hero} alt="" className="wall-img" loading="lazy" />
                  <div className="wall-meta">
                    <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                    <h3 className="wall-title">{look.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <EditorialTiles tiles={tiles} />

      <SupportStrip />

      <SignupBand />

      {toast && (
        <div className="hp-toast" role="status">
          <p>{toast}</p>
          <Link to="/albums" className="hp-toast-link">
            View albums
            <span aria-hidden>&nbsp;›</span>
          </Link>
        </div>
      )}
    </div>
  );
}
