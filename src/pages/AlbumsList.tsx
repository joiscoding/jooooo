import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ListEmptyState } from '../components/ListEmptyState';
import { useAlbumsContext } from '../context/AlbumsContext';

export function AlbumsList() {
  const { albums, createAlbum, deleteAlbum } = useAlbumsContext();
  const [name, setName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    createAlbum(n);
    setName('');
  }

  return (
    <div className="page-narrow albums-page">
      <header className="page-head">
        <h1 className="page-title">Albums</h1>
        <p className="muted">
          Saved locally in this browser — persists after refresh.
        </p>
      </header>

      <form onSubmit={handleCreate} className="create-album-form">
        <input
          ref={nameInputRef}
          className="text-input"
          placeholder="New album name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Album name"
        />
        <button type="submit" className="btn primary">
          Create
        </button>
      </form>

      {albums.length === 0 ? (
        <ListEmptyState
          title="No albums yet"
          description="Create one with the form above, or save a look from any look page — it can land in a new album in one step."
          primaryAction={{
            type: 'button',
            onClick: () => nameInputRef.current?.focus(),
            label: 'Name your first album',
          }}
          secondaryAction={{
            type: 'router',
            to: '/',
            label: 'Browse the gallery',
            variant: 'ghost',
          }}
        />
      ) : (
        <ul className="album-list">
          {albums.map((a) => (
            <li key={a.id} className="album-list-item">
              <Link to={`/albums/${a.id}`} className="album-link">
                <span className="album-name">{a.name}</span>
                <span className="album-count">
                  {a.lookIds.length} look{a.lookIds.length === 1 ? '' : 's'}
                </span>
              </Link>
              <button
                type="button"
                className="btn text-danger"
                onClick={() => {
                  if (confirm(`Delete album “${a.name}”?`)) deleteAlbum(a.id);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
