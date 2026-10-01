import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import { useAlbumsContext } from '../context/AlbumsContext';
import { LookCard, pickHoverImage } from '../components/LookCard';
import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

const RELATED_LIMIT = 4;

export function LookDetail() {
  const { lookId } = useParams<{ lookId: string }>();
  const navigate = useNavigate();
  const { albums, createAlbum, addLookToAlbum } = useAlbumsContext();
  const [allLooks, setAllLooks] = useState<Look[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchLooks().then(setAllLooks);
  }, []);

  // Reset gallery position and scroll when moving between looks.
  useEffect(() => {
    setActiveImage(0);
    window.scrollTo({ top: 0 });
  }, [lookId]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const look = useMemo(
    () => allLooks.find((l) => l.id === lookId) ?? null,
    [allLooks, lookId]
  );

  const related = useMemo(() => {
    if (!look) return [];
    return allLooks
      .filter((l) => l.tag === look.tag && l.id !== look.id)
      .slice(0, RELATED_LIMIT);
  }, [allLooks, look]);

  if (!lookId) {
    navigate('/');
    return null;
  }

  if (allLooks.length === 0) {
    return (
      <div className="page-loading">
        <p className="muted">Loading look…</p>
      </div>
    );
  }

  if (!look) {
    return (
      <div className="page-narrow">
        <p className="muted">Look not found.</p>
        <Link to="/">Back to looks</Link>
      </div>
    );
  }

  const images = Array.from(new Set([look.hero, ...look.gallery]));
  const current = images[Math.min(activeImage, images.length - 1)];

  function handleAddToExisting() {
    if (!selectedAlbumId || !look) return;
    addLookToAlbum(selectedAlbumId, look.id);
    const name = albums.find((a) => a.id === selectedAlbumId)?.name;
    setToast(name ? `Saved to “${name}”.` : 'Saved to album.');
  }

  function handleCreateAndAdd(e: FormEvent) {
    e.preventDefault();
    const name = newAlbumName.trim();
    if (!name || !look) return;
    const al = createAlbum(name);
    addLookToAlbum(al.id, look.id);
    setSelectedAlbumId(al.id);
    setNewAlbumName('');
    setToast(`Created “${al.name}” and saved this look.`);
  }

  return (
    <article className="pdp-page">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="pdp">
        <div className="pdp-media">
          {images.length > 1 && (
            <div className="pdp-thumbs" role="group" aria-label="Look photos">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={i === activeImage ? 'pdp-thumb active' : 'pdp-thumb'}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Photo ${i + 1} of ${images.length}`}
                  aria-pressed={i === activeImage}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          <div className="pdp-hero-wrap">
            <img key={current} src={current} alt="" className="pdp-hero" />
          </div>
        </div>

        <div className="pdp-info">
          <p className="eyebrow">{STYLE_LABELS[look.tag]}</p>
          <h1 className="pdp-title">{look.title}</h1>
          <p className="pdp-designed">
            Designed for: <strong>{look.occasion}</strong>
          </p>

          <section className="save-box" aria-labelledby="save-title">
            <h2 id="save-title" className="h-small">
              Save this look
            </h2>
            <div className="save-row">
              <select
                className="select-input"
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                aria-label="Choose album"
              >
                <option value="">
                  {albums.length === 0 ? 'No albums yet' : 'Choose an album'}
                </option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.lookIds.length})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn primary block"
              disabled={!selectedAlbumId}
              onClick={handleAddToExisting}
            >
              Add to album
            </button>
            <form onSubmit={handleCreateAndAdd} className="save-new">
              <input
                className="text-input"
                placeholder="Or start a new album"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                aria-label="New album name"
              />
              <button type="submit" className="btn ghost">
                Create &amp; add
              </button>
            </form>
            <p className="toast" role="status" aria-live="polite">
              {toast}
            </p>
          </section>

          {look.story && (
            <section className="why-block" aria-labelledby="why-title">
              <h2 id="why-title" className="block-title">
                Why this look works
              </h2>
              <p>{look.story}</p>
            </section>
          )}

          <section className="features" aria-labelledby="features-title">
            <h2 id="features-title" className="block-title">
              Features
            </h2>
            <dl className="feature-list">
              <div className="feature-row">
                <dt>Season</dt>
                <dd>{look.season}</dd>
              </div>
              <div className="feature-row">
                <dt>Occasion</dt>
                <dd>{look.occasion}</dd>
              </div>
              <div className="feature-row">
                <dt>Key items</dt>
                <dd>
                  <ul className="feature-items">
                    {look.keyItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related" aria-labelledby="related-title">
          <div className="section-head">
            <h2 id="related-title" className="section-title">
              More in {STYLE_LABELS[look.tag]}
            </h2>
            <Link to="/" className="text-link">
              All looks
            </Link>
          </div>
          <div className="related-grid">
            {related.map((l) => (
              <LookCard
                key={l.id}
                look={l}
                hoverImage={pickHoverImage(l, allLooks)}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
