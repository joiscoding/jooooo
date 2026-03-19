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
  const [heroSrc, setHeroSrc] = useState('');
  const [newAlbumName, setNewAlbumName] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchLooks().then((all) => {
      const found = all.find((l) => l.id === lookId) ?? null;
      setLook(found);
      if (found) setHeroSrc(found.hero);
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
      <div className="pdp-empty">
        <p>Look not found.</p>
        <Link to="/" className="text-link">Back to gallery</Link>
      </div>
    );
  }

  const images = [look.hero, ...look.gallery];

  function handleAddToExisting() {
    if (!selectedAlbumId || !look) return;
    addLookToAlbum(selectedAlbumId, look.id);
    setToast('Saved to album.');
  }

  function handleCreateAndAdd(e: FormEvent) {
    e.preventDefault();
    if (!look) return;
    const name = newAlbumName.trim();
    if (!name) return;
    const al = createAlbum(name);
    addLookToAlbum(al.id, look.id);
    setNewAlbumName('');
    setToast(`Created "${al.name}" and saved this look.`);
  }

  return (
    <article className="pdp">
      {/* Breadcrumb navigation */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Gallery</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-tag">{STYLE_LABELS[look.tag]}</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{look.title}</span>
      </nav>

      <div className="pdp-grid">
        {/* Image gallery */}
        <div className="pdp-gallery">
          <div className="pdp-hero-wrap">
            <img src={heroSrc} alt={look.title} className="pdp-hero" />
          </div>
          <div className="pdp-thumbs">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                className={`pdp-thumb ${heroSrc === src ? 'active' : ''}`}
                onClick={() => setHeroSrc(src)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="pdp-info">
          <span className="pdp-tag">{STYLE_LABELS[look.tag]}</span>
          <h1 className="pdp-title">{look.title}</h1>

          <div className="pdp-details">
            <div className="pdp-detail-row">
              <span className="pdp-detail-label">Season</span>
              <span className="pdp-detail-value">{look.season}</span>
            </div>
            <div className="pdp-detail-row">
              <span className="pdp-detail-label">Occasion</span>
              <span className="pdp-detail-value">{look.occasion}</span>
            </div>
          </div>

          <div className="pdp-key-items">
            <h2 className="pdp-section-title">Key Pieces</h2>
            <div className="pdp-items-list">
              {look.keyItems.map((item) => (
                <div key={item} className="pdp-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pdp-album-panel">
            <h2 className="pdp-section-title">Save to Album</h2>
            <div className="pdp-album-actions">
              <select
                className="pdp-select"
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                aria-label="Choose album"
              >
                <option value="">Select album&hellip;</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.lookIds.length})
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="pdp-btn pdp-btn-primary"
                disabled={!selectedAlbumId}
                onClick={handleAddToExisting}
              >
                Add to Album
              </button>
            </div>
            <form onSubmit={handleCreateAndAdd} className="pdp-new-album">
              <input
                className="pdp-input"
                placeholder="New album name"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                aria-label="New album name"
              />
              <button type="submit" className="pdp-btn pdp-btn-secondary">
                Create &amp; Add
              </button>
            </form>
            {toast && <p className="pdp-toast" role="status">{toast}</p>}
          </div>

          <Link to="/albums" className="pdp-albums-link">
            View All Albums &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
