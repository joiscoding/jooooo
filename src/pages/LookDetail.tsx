import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import { useAlbumsContext } from '../context/AlbumsContext';
import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

export function LookDetail() {
  const { lookId } = useParams<{ lookId: string }>();
  const navigate = useNavigate();
  const { albums, createAlbum, addLookToAlbum } = useAlbumsContext();
  const [look, setLook] = useState<Look | null>(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchLooks().then((all) => {
      const found = all.find((l) => l.id === lookId) ?? null;
      setLook(found);
    });
  }, [lookId]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  if (!lookId) {
    navigate('/');
    return null;
  }

  if (!look) {
    return (
      <div className="page-narrow">
        <p className="muted">Look not found.</p>
        <Link to="/">Back to gallery</Link>
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
        ← Back
      </button>

      <div className="look-detail-grid">
        <div className="look-visual">
          <div className="look-hero-wrap">
            <img src={look.hero} alt={look.title} className="look-hero" />
          </div>
          {look.gallery.length > 0 && (
            <div className="look-thumbs">
              {images.map((src, i) => (
                <img key={i} src={src} alt={look.title} className="look-thumb" />
              ))}
            </div>
          )}
        </div>

        <div className="look-copy">
          <p className="eyebrow">{STYLE_LABELS[look.tag]}</p>
          <h1 className="look-detail-title">{look.title}</h1>
          <p className="look-detail-lede">
            Built for {look.occasion.toLowerCase()} moments, with an emphasis on{' '}
            {look.keyItems[0].toLowerCase()} and easy layering.
          </p>
          <dl className="look-facts">
            <div>
              <dt>Season</dt>
              <dd>{look.season}</dd>
            </div>
            <div>
              <dt>Occasion</dt>
              <dd>{look.occasion}</dd>
            </div>
          </dl>
          <div className="detail-benefits">
            <div className="detail-benefit-card">
              <span className="detail-benefit-label">Why it works</span>
              <p>Balanced proportions, quieter color, and one strong hero layer.</p>
            </div>
            <div className="detail-benefit-card">
              <span className="detail-benefit-label">Best for</span>
              <p>{look.season} dressing with enough polish for repeat wear.</p>
            </div>
          </div>
          <div className="key-items">
            <h2 className="h-small">Key items</h2>
            <ul className="key-items-list">
              {look.keyItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="album-panel">
            <h2 className="h-small">Add to album</h2>
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
                placeholder="New album name"
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
              View all albums →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
