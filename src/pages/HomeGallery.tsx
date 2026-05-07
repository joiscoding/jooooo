import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

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

  const leadLook = useMemo(() => {
    if (filter !== 'all') return filtered[0] ?? looks[0];
    return looks.find((look) => look.tag === 'classic') ?? looks[0];
  }, [filter, filtered, looks]);

  const editorialLooks = useMemo(() => {
    const source = filter === 'all' ? looks : filtered;
    if (!leadLook) return source.slice(0, 3);

    return [leadLook, ...source.filter((look) => look.id !== leadLook.id)].slice(
      0,
      3,
    );
  }, [filter, filtered, leadLook, looks]);

  const heroEyebrow =
    filter === 'all' ? 'Spring collection 2026' : `${STYLE_LABELS[filter]} edit`;
  const heroTitle =
    filter === 'all'
      ? 'The season opens with polished ease.'
      : 'A sharper mood for the current edit.';
  const leadItems = leadLook?.keyItems
    .slice(0, 2)
    .map((item) => item.toLowerCase())
    .join(' and ');
  const heroDescription =
    filter === 'all'
      ? 'Tailored layers, quiet textures, and off-duty pieces arranged with a more cinematic first impression.'
      : `Focused on ${leadLook?.occasion.toLowerCase() ?? 'everyday dressing'} with ${leadItems ?? 'clean layers'} leading the silhouette.`;
  const galleryIntro =
    filter === 'all'
      ? 'Begin with the campaign mood, then refine the story by attitude.'
      : `Showing ${filtered.length} look${filtered.length === 1 ? '' : 's'} in ${STYLE_LABELS[filter]}.`;

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      {leadLook && (
        <section className="home-hero">
          <div className="hero-visual">
            <img
              src={leadLook.hero}
              alt={`${leadLook.title} editorial look`}
              className="hero-image"
            />
            <div className="hero-copy">
              <p className="eyebrow">{heroEyebrow}</p>
              <h1 className="home-title">{heroTitle}</h1>
              <p className="hero-dek">{heroDescription}</p>
              <div className="hero-actions">
                <Link
                  to={`/look/${leadLook.id}`}
                  className="hero-link hero-link-primary"
                >
                  View {leadLook.title}
                </Link>
                <a href="#season-edit" className="hero-link hero-link-secondary">
                  Explore the edit
                </a>
              </div>
            </div>
          </div>

          <aside className="hero-aside">
            <p className="eyebrow">Editor&apos;s note</p>
            <h2 className="hero-aside-title">
              Built around {leadLook.occasion.toLowerCase()} dressing.
            </h2>
            <p className="hero-aside-copy">
              {leadLook.keyItems.join(' · ')} set the tone for the opening story.
            </p>
            <dl className="hero-facts">
              <div>
                <dt>Season</dt>
                <dd>{leadLook.season}</dd>
              </div>
              <div>
                <dt>Style</dt>
                <dd>{STYLE_LABELS[leadLook.tag]}</dd>
              </div>
              <div>
                <dt>Occasion</dt>
                <dd>{leadLook.occasion}</dd>
              </div>
            </dl>
          </aside>
        </section>
      )}

      {editorialLooks.length > 0 && (
        <section className="editorial-band" aria-label="Featured looks">
          <div className="section-copy-block">
            <p className="eyebrow">Collection notes</p>
            <h2 className="section-title">
              Heritage textures, tailored lines, softer pacing.
            </h2>
            <p className="section-copy">
              The landing page now opens like an editorial spread: darker
              imagery, more breathing room, and a cleaner hierarchy for the
              seasonal selection.
            </p>
          </div>

          <div className="editorial-grid">
            {editorialLooks.map((look, index) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className={
                  index === 0
                    ? 'editorial-card editorial-card-featured'
                    : 'editorial-card'
                }
              >
                <img
                  src={look.hero}
                  alt={`${look.title} featured look`}
                  className="editorial-image"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="editorial-meta">
                  <span className="editorial-kicker">
                    {STYLE_LABELS[look.tag]}
                  </span>
                  <h3>{look.title}</h3>
                  <p>
                    {look.season} · {look.occasion}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="collection-head" id="season-edit">
        <div>
          <p className="eyebrow">Season edit</p>
          <h2 className="section-title">
            Filter the story without losing the mood.
          </h2>
        </div>
        <p className="collection-count">
          <span>{String(filtered.length).padStart(2, '0')}</span>
          looks in the current edit
        </p>
      </section>

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

      {filtered.length === 0 ? (
        <p className="empty-state">No looks in this filter.</p>
      ) : (
        <section className="gallery-section">
          <div className="gallery-intro">
            <p className="gallery-note">{galleryIntro}</p>
          </div>

          <div className="gallery-wall">
            {filtered.map((look, i) => {
              return (
                <Link
                  key={look.id}
                  to={`/look/${look.id}`}
                  className={
                    i === 0 ? 'wall-card wall-card-featured' : 'wall-card'
                  }
                >
                  <div className="wall-card-inner">
                    <div className="wall-media">
                      <img
                        key={`${look.id}-${look.hero}`}
                        src={look.hero}
                        alt={`${look.title} look`}
                        className="wall-img"
                        loading={i < 4 ? 'eager' : 'lazy'}
                      />
                    </div>
                    <div className="gallery-meta">
                      <span className="gallery-kicker">
                        {STYLE_LABELS[look.tag]}
                      </span>
                      <h2 className="gallery-title">{look.title}</h2>
                      <p className="gallery-description">
                        {look.season} · {look.occasion}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
