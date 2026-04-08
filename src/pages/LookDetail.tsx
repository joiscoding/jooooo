import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LookCard } from '../components/EditorialCard';
import { useAlbumsContext } from '../context/AlbumsContext';
import { useCatalogContext } from '../context/CatalogContext';
import { STYLE_LABELS } from '../types';

export function LookDetail() {
  const { lookId } = useParams<{ lookId: string }>();
  const navigate = useNavigate();
  const { albums, createAlbum, addLookToAlbum } = useAlbumsContext();
  const { loading, getLook, getCollection, getLooksForCollection } = useCatalogContext();
  const [newAlbumName, setNewAlbumName] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const look = lookId ? getLook(lookId) : null;
  const collection = look ? getCollection(look.collectionSlug) : null;
  const relatedLooks = useMemo(() => {
    if (!look) {
      return [];
    }

    return getLooksForCollection(look.collectionSlug).filter(
      (candidate) => candidate.id !== look.id
    );
  }, [getLooksForCollection, look]);

  if (!lookId) {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="page-narrow">
        <p className="muted">Loading the editorial look…</p>
      </div>
    );
  }

  if (!look) {
    return (
      <div className="page-narrow">
        <p className="muted">Look not found.</p>
        <Link to="/">Back to journal</Link>
      </div>
    );
  }

  const images = [look.hero, ...look.gallery];

  function handleAddToExisting() {
    if (!selectedAlbumId) return;
    addLookToAlbum(selectedAlbumId, look.id);
    setToast('Saved to album.');
  }

  function handleCreateAndAdd(e: FormEvent) {
    e.preventDefault();
    const name = newAlbumName.trim();
    if (!name) return;
    const al = createAlbum(name);
    addLookToAlbum(al.id, look.id);
    setNewAlbumName('');
    setToast(`Created “${al.name}” and saved this look.`);
  }

  return (
    <article className="look-detail">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← Back to journal
      </button>

      <header className="detail-header">
        <div>
          <p className="eyebrow">{STYLE_LABELS[look.tag]}</p>
          <h1 className="look-detail-title">{look.title}</h1>
          <p className="detail-subtitle">{look.subtitle}</p>
        </div>
        <div className="detail-quote-block">
          <span className="chip">Collection note</span>
          <p>{look.featuredQuote}</p>
        </div>
      </header>

      <div className="look-detail-grid">
        <div className="look-visual">
          <div className="look-hero-wrap">
            <img src={look.hero} alt={look.title} className="look-hero" />
          </div>
          <div className="look-thumbs">
            {images.map((src, i) => (
              <img
                key={`${src}-${i}`}
                src={src}
                alt={`${look.title} view ${i + 1}`}
                className="look-thumb"
              />
            ))}
          </div>
        </div>

        <div className="look-copy">
          <dl className="look-facts">
            <div>
              <dt>Season</dt>
              <dd>{look.season}</dd>
            </div>
            <div>
              <dt>Occasion</dt>
              <dd>{look.occasion}</dd>
            </div>
            <div>
              <dt>Setting</dt>
              <dd>{look.setting}</dd>
            </div>
            <div>
              <dt>Palette</dt>
              <dd>{look.palette.join(' / ')}</dd>
            </div>
          </dl>

          <section className="story-section">
            <h2 className="section-title">The story</h2>
            <div className="story-grid">
              {look.story.map((beat) => (
                <article key={beat.heading} className="story-card">
                  <h3>{beat.heading}</h3>
                  <p>{beat.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="merch-section">
            <div className="section-head compact">
              <div>
                <p className="eyebrow">Shop the look</p>
                <h2 className="section-title">Wardrobe breakdown</h2>
              </div>
            </div>
            <div className="merch-grid">
              {look.merchandising.map((item) => (
                <article key={`${item.category}-${item.label}`} className="merch-card">
                  <span className="chip">{item.category}</span>
                  <h3>{item.label}</h3>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>
            <div className="key-items">
              <h2 className="h-small">Key items</h2>
              <ul>
                {look.keyItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <div className="album-panel">
            <div className="section-head compact">
              <div>
                <p className="eyebrow">Save for later</p>
                <h2 className="section-title">Add this look to a trunk</h2>
              </div>
            </div>
            <div className="album-row">
              <select
                className="select-input"
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                aria-label="Choose album"
              >
                <option value="">Select album…</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.lookIds.length})
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn primary"
                disabled={!selectedAlbumId}
                onClick={handleAddToExisting}
              >
                Add
              </button>
            </div>
            <form onSubmit={handleCreateAndAdd} className="album-new">
              <input
                className="text-input"
                placeholder="New trunk name"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                aria-label="New album name"
              />
              <button type="submit" className="btn ghost">
                Create &amp; add
              </button>
            </form>
            {toast && <p className="toast" role="status">{toast}</p>}
            <Link to="/albums" className="inline-link">
              View all trunks →
            </Link>
          </div>
        </div>
      </div>

      {collection && (
        <section className="look-collection-callout">
          <div className="section-head">
            <div>
              <p className="eyebrow">{collection.eyebrow}</p>
              <h2 className="section-title">{collection.title}</h2>
            </div>
            <p className="section-copy">{collection.description}</p>
          </div>
          <p className="collection-tone-banner">{collection.tone}</p>
        </section>
      )}

      {relatedLooks.length > 0 && (
        <section className="related-looks">
          <div className="section-head">
            <div>
              <p className="eyebrow">Continue the story</p>
              <h2 className="section-title">More from this chapter</h2>
            </div>
            <p className="section-copy">
              Adjacent looks carry the same mood with different textures,
              settings, and levels of polish.
            </p>
          </div>
          <div className="card-rail">
            {relatedLooks.slice(0, 3).map((candidate) => (
              <LookCard key={candidate.id} look={candidate} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
