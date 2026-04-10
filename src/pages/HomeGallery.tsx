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

  const activeLabel = filter === 'all' ? 'All looks' : STYLE_LABELS[filter];

  const totalKeyItems = useMemo(() => {
    return looks.reduce((sum, look) => sum + look.keyItems.length, 0);
  }, [looks]);

  const uniqueOccasions = useMemo(() => {
    return new Set(looks.map((look) => look.occasion)).size;
  }, [looks]);

  const leadLook = filtered[0] ?? looks[0];

  const spotlightLooks = useMemo(() => {
    const source = filtered.length >= 3 ? filtered : looks;
    return source.slice(0, 3);
  }, [filtered, looks]);

  const styleChannels = useMemo(() => {
    return STYLE_ORDER.flatMap((tag) => {
      const channelLooks = looks.filter((look) => look.tag === tag);
      const sample = channelLooks[0];
      if (!sample) {
        return [];
      }

      return [
        {
          tag,
          label: STYLE_LABELS[tag],
          count: channelLooks.length,
          sample,
        },
      ];
    });
  }, [looks]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home metro-home">
      <section className="metro-hero">
        <div className="metro-hero-copy">
          <p className="eyebrow metro-eyebrow">Style desk · Spring briefing</p>
          <h1 className="home-title metro-title">
            Style operations for men who dress with intent.
          </h1>
          <p className="metro-lede">
            A sharper front page for seasonal dressing: bold hierarchy,
            quick-start actions, compact facts and a stronger blue-and-amber
            brand rhythm.
          </p>
          <div className="metro-cta-row">
            <a href="#look-grid" className="metro-button metro-button-primary">
              Explore looks
            </a>
            <Link to="/albums" className="metro-button metro-button-secondary">
              Open albums
            </Link>
          </div>
        </div>

        {leadLook ? (
          <Link to={`/look/${leadLook.id}`} className="metro-hero-panel">
            <div className="metro-panel-top">
              <span className="metro-panel-label">Featured route</span>
              <span className="metro-panel-link">Review look</span>
            </div>
            <img
              src={leadLook.hero}
              alt={`${leadLook.title} featured look`}
              className="metro-panel-image"
            />
            <div className="metro-panel-body">
              <span className="metro-panel-tag">
                {STYLE_LABELS[leadLook.tag]}
              </span>
              <h2 className="metro-panel-title">{leadLook.title}</h2>
              <p className="metro-panel-copy">
                {leadLook.season} · {leadLook.occasion}
              </p>
            </div>
          </Link>
        ) : null}
      </section>

      <section className="metro-stat-strip" aria-label="Lookbook snapshot">
        <article className="metro-stat-card">
          <span className="metro-stat-value">{looks.length}</span>
          <p className="metro-stat-label">Looks online</p>
        </article>
        <article className="metro-stat-card">
          <span className="metro-stat-value">{STYLE_ORDER.length}</span>
          <p className="metro-stat-label">Style lanes</p>
        </article>
        <article className="metro-stat-card">
          <span className="metro-stat-value">{uniqueOccasions}</span>
          <p className="metro-stat-label">Occasions covered</p>
        </article>
        <article className="metro-stat-card">
          <span className="metro-stat-value">{totalKeyItems}</span>
          <p className="metro-stat-label">Key items indexed</p>
        </article>
      </section>

      <section className="metro-actions">
        <div className="section-intro">
          <p className="eyebrow">Quick start</p>
          <h2 className="metro-section-title">Move from headline to action.</h2>
        </div>
        <div className="metro-action-grid">
          <a href="#filters" className="metro-action-card">
            <span className="metro-action-kicker">Filter desk</span>
            <h3 className="metro-action-title">{activeLabel}</h3>
            <p className="metro-action-copy">
              Jump to the active assortment and refine the catalogue by style.
            </p>
          </a>
          {leadLook ? (
            <Link to={`/look/${leadLook.id}`} className="metro-action-card">
              <span className="metro-action-kicker">Featured look</span>
              <h3 className="metro-action-title">{leadLook.title}</h3>
              <p className="metro-action-copy">
                Open the leading story and inspect its key pieces in detail.
              </p>
            </Link>
          ) : null}
          <Link to="/albums" className="metro-action-card">
            <span className="metro-action-kicker">Planning board</span>
            <h3 className="metro-action-title">Albums workspace</h3>
            <p className="metro-action-copy">
              Save shortlists for fittings, shoots and future seasonal edits.
            </p>
          </Link>
        </div>
      </section>

      <section className="metro-channel-section">
        <div className="section-intro">
          <p className="eyebrow">Style lanes</p>
          <h2 className="metro-section-title">
            A clearer map of the full assortment.
          </h2>
        </div>
        <div className="metro-channel-grid">
          {styleChannels.map((channel) => (
            <Link
              key={channel.tag}
              to={`/look/${channel.sample.id}`}
              className="metro-channel-card"
            >
              <span className="metro-channel-count">
                {String(channel.count).padStart(2, '0')}
              </span>
              <h3 className="metro-channel-title">{channel.label}</h3>
              <p className="metro-channel-copy">
                Start with {channel.sample.title} for a quick read on this lane.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="metro-briefings">
        <div className="section-intro">
          <p className="eyebrow">Editorial briefings</p>
          <h2 className="metro-section-title">
            Current stories pulled from the floor.
          </h2>
        </div>
        <div className="metro-briefing-grid">
          {spotlightLooks.map((look, index) => (
            <Link
              key={look.id}
              to={`/look/${look.id}`}
              className="metro-briefing-card"
            >
              <img
                src={look.hero}
                alt={`${look.title} editorial preview`}
                className="metro-briefing-image"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="metro-briefing-body">
                <span className="metro-briefing-kicker">
                  {STYLE_LABELS[look.tag]}
                </span>
                <h3 className="metro-briefing-title">{look.title}</h3>
                <p className="metro-briefing-copy">
                  {look.occasion} · {look.season}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="filters" className="filters-shell" aria-label="Style filters">
        <div className="section-intro">
          <p className="eyebrow">Catalogue controls</p>
          <h2 className="metro-section-title">Filter the active range.</h2>
        </div>
        <div className="filters-bar">
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
        <p className="filters-summary">
          {filtered.length} looks currently visible in {activeLabel}.
        </p>
      </section>

      <section className="gallery-section">
        <div className="section-intro gallery-head">
          <p className="eyebrow">Assortment view</p>
          <h2 className="metro-section-title">The full look catalogue.</h2>
          <p className="metro-section-copy">
            Browse the complete grid or narrow the selection above to focus on
            one style lane at a time.
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div id="look-grid" className="gallery-wall metro-gallery">
            {filtered.map((look, i) => {
              return (
                <Link
                  key={look.id}
                  to={`/look/${look.id}`}
                  className="wall-card metro-card"
                >
                  <div className="wall-card-inner metro-card-inner">
                    <img
                      key={`${look.id}-${look.hero}`}
                      src={look.hero}
                      alt={`${look.title} look`}
                      className="wall-img metro-wall-img"
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
                    <div className="metro-card-body">
                      <span className="metro-card-index">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="wall-tag metro-card-tag">
                        {STYLE_LABELS[look.tag]}
                      </span>
                      <h2 className="wall-title metro-card-title">
                        {look.title}
                      </h2>
                      <p className="metro-card-copy">
                        {look.occasion} · {look.season}
                      </p>
                      <ul className="metro-key-list">
                        {look.keyItems.slice(0, 2).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
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
