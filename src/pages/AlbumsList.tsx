import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAlbumsContext } from '../context/AlbumsContext';
import { useCatalogContext } from '../context/CatalogContext';

export function AlbumsList() {
  const { albums, createAlbum, deleteAlbum } = useAlbumsContext();
  const { loading, getLook } = useCatalogContext();
  const [name, setName] = useState('');

  const sortedAlbums = useMemo(
    () => [...albums].sort((left, right) => right.createdAt - left.createdAt),
    [albums]
  );

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    createAlbum(n);
    setName('');
  }

  return (
    <div className="albums-page">
      <header className="page-head wide">
        <div>
          <p className="eyebrow">Saved edits</p>
          <h1 className="page-title">Personal trunks</h1>
        </div>
        <p className="section-copy">
          Save looks into trunks that stay in this browser. Use them like seasonal
          mood boards for trips, events, or wardrobe planning.
        </p>
      </header>

      <form onSubmit={handleCreate} className="create-album-form editorial-panel">
        <input
          className="text-input"
          placeholder="New trunk name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Trunk name"
        />
        <button type="submit" className="btn primary">
          Create trunk
        </button>
      </form>

      {loading ? (
        <p className="empty-state">Loading saved trunks…</p>
      ) : sortedAlbums.length === 0 ? (
        <p className="empty-state">
          No trunks yet. Create one above, or save a look from any editorial page.
        </p>
      ) : (
        <div className="album-grid">
          {sortedAlbums.map((album) => {
            const coverLook = album.lookIds
              .map((lookId) => getLook(lookId))
              .find((look) => look !== null);
            const createdLabel = new Date(album.createdAt).toLocaleDateString(
              undefined,
              {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }
            );

            return (
              <article key={album.id} className="album-card">
                {coverLook ? (
                  <img
                    src={coverLook.hero}
                    alt={album.name}
                    className="album-card-image"
                  />
                ) : (
                  <div className="album-card-image album-card-placeholder" />
                )}
                <div className="album-card-body">
                  <div className="album-card-topline">
                    <span className="chip">Saved trunk</span>
                    <span className="album-created">{createdLabel}</span>
                  </div>
                  <Link to={`/albums/${album.id}`} className="album-card-link">
                    <h2 className="album-name">{album.name}</h2>
                  </Link>
                  <p className="album-card-copy">
                    {album.lookIds.length === 0
                      ? 'Empty for now. Add looks from the journal to begin building a point of view.'
                      : `${album.lookIds.length} saved look${album.lookIds.length === 1 ? '' : 's'} curated into one personal story.`}
                  </p>
                  <div className="album-card-actions">
                    <Link to={`/albums/${album.id}`} className="btn secondary">
                      Open trunk
                    </Link>
                    <button
                      type="button"
                      className="btn text-danger"
                      onClick={() => {
                        if (confirm(`Delete trunk "${album.name}"?`)) {
                          deleteAlbum(album.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
