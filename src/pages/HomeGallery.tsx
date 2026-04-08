import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CollectionCard, LookCard } from '../components/EditorialCard';
import { useCatalogContext } from '../context/CatalogContext';
import type { StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

export function HomeGallery() {
  const { catalog, looks, collections, featuredLook, loading, getLook } =
    useCatalogContext();
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      {featuredLook && (
        <section className="hero-banner">
          <div className="hero-copy">
            <p className="eyebrow">{catalog?.seasonLabel ?? 'Seasonal journal'}</p>
            <h1 className="home-title">An American-country editorial, retuned for the city.</h1>
            <p className="hero-summary">
              {catalog?.marketNote ?? featuredLook.subtitle}
            </p>
            <div className="hero-actions">
              <Link to={`/look/${featuredLook.id}`} className="btn primary">
                View featured look
              </Link>
              <Link to="/albums" className="btn secondary">
                Open albums
              </Link>
            </div>
          </div>
          <Link to={`/look/${featuredLook.id}`} className="hero-image-link">
            <img
              src={featuredLook.hero}
              alt={featuredLook.title}
              className="hero-image"
            />
          </Link>
          <aside className="hero-note">
            <span className="chip">Featured look</span>
            <h2>{featuredLook.title}</h2>
            <p>{featuredLook.featuredQuote}</p>
            <ul className="hero-palette" aria-label="Color palette">
              {featuredLook.palette.map((tone) => (
                <li key={tone}>{tone}</li>
              ))}
            </ul>
          </aside>
        </section>
      )}

      <section className="collections-grid" aria-label="Editorial chapters">
        {collections.map((collection) => {
          const coverLook = getLook(collection.coverLookId);
          if (!coverLook) {
            return null;
          }

          return (
            <CollectionCard
              key={collection.slug}
              collection={collection}
              coverLook={coverLook}
            />
          );
        })}
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

      <section className="chapter-rails" aria-label="Curated chapters">
        {collections.slice(0, 3).map((collection) => {
          const collectionLooks = looks.filter(
            (look) => look.collectionSlug === collection.slug
          );

          return (
            <section key={collection.slug} className="chapter-rail">
              <div className="section-head">
                <div>
                  <p className="eyebrow">{collection.eyebrow}</p>
                  <h2 className="section-title">{collection.title}</h2>
                </div>
                <p className="section-copy">{collection.description}</p>
              </div>
              <div className="card-rail">
                {collectionLooks.slice(0, 3).map((look) => (
                  <LookCard key={look.id} look={look} />
                ))}
              </div>
            </section>
          );
        })}
      </section>

      {filtered.length === 0 ? (
        <p className="empty-state">No looks in this filter.</p>
      ) : (
        <section className="filtered-grid-section">
          <div className="section-head">
            <div>
              <p className="eyebrow">All looks</p>
              <h2 className="section-title">Edited by mood, rather than by product type.</h2>
            </div>
            <p className="section-copy">
              Use the five filters to move between minimal dressing, sporting
              layers, workwear heritage, and tailored city looks.
            </p>
          </div>
          <div className="filtered-grid">
            {filtered.map((look) => (
              <LookCard key={look.id} look={look} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
