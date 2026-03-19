import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAlbumsContext } from '../context/AlbumsContext';

export function AlbumsList() {
  const { albums, createAlbum, deleteAlbum } = useAlbumsContext();
  const [name, setName] = useState('');

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    createAlbum(n);
    setName('');
  }

  return (
    <div className="albums-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Gallery</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Albums</span>
      </nav>

      <header className="albums-header">
        <h1 className="albums-title">Your Albums</h1>
        <p className="albums-subtitle">
          Curate your favorite looks. Saved locally in your browser.
        </p>
      </header>

      <form onSubmit={handleCreate} className="albums-create-form">
        <input
          className="albums-input"
          placeholder="Create a new album..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Album name"
        />
        <button type="submit" className="albums-create-btn">
          Create Album
        </button>
      </form>

      {albums.length === 0 ? (
        <div className="albums-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <p>No albums yet</p>
          <span>Create one above, or save a look from the gallery.</span>
        </div>
      ) : (
        <ul className="albums-grid">
          {albums.map((a) => (
            <li key={a.id} className="album-card">
              <Link to={`/albums/${a.id}`} className="album-card-link">
                <div className="album-card-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="album-card-name">{a.name}</h3>
                <span className="album-card-count">
                  {a.lookIds.length} look{a.lookIds.length === 1 ? '' : 's'}
                </span>
              </Link>
              <button
                type="button"
                className="album-card-delete"
                onClick={() => {
                  if (confirm(`Delete album "${a.name}"?`)) deleteAlbum(a.id);
                }}
                aria-label={`Delete album ${a.name}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
