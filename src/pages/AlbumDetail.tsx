import { Link, useParams } from 'react-router-dom';
import { LookCard } from '../components/EditorialCard';
import { useAlbumsContext } from '../context/AlbumsContext';
import { useCatalogContext } from '../context/CatalogContext';

export function AlbumDetail() {
  const { albumId } = useParams<{ albumId: string }>();
  const { albums, removeLookFromAlbum } = useAlbumsContext();
  const { loading, getLook } = useCatalogContext();

  const album = albums.find((a) => a.id === albumId);

  if (!albumId || !album) {
    return (
      <div className="page-narrow">
        <p className="muted">Album not found.</p>
        <Link to="/albums">← Trunks</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-narrow">
        <p className="muted">Loading trunk…</p>
      </div>
    );
  }

  const lookEntries = album.lookIds.map((id) => ({
    id,
    look: getLook(id),
  }));
  const savedLooks = lookEntries.filter(
    (entry): entry is { id: string; look: NonNullable<typeof entry.look> } =>
      entry.look !== null
  );
  const missingLookIds = lookEntries
    .filter((entry) => entry.look === null)
    .map((entry) => entry.id);
  const createdLabel = new Date(album.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="album-detail-page">
      <Link to="/albums" className="back-link">
        ← All trunks
      </Link>
      <header className="page-head wide">
        <div>
          <p className="eyebrow">Saved trunk</p>
          <h1 className="page-title">{album.name}</h1>
        </div>
        <p className="section-copy">
          Created {createdLabel}. {album.lookIds.length} saved look
          {album.lookIds.length === 1 ? '' : 's'} arranged into one personal edit.
        </p>
      </header>

      {album.lookIds.length === 0 ? (
        <p className="empty-state">
          Empty trunk. Add looks from the journal or from any editorial page.
        </p>
      ) : (
        <>
          <section className="album-editorial-note editorial-panel">
            <p className="eyebrow">Editorial summary</p>
            <p className="album-editorial-copy">
              This trunk mixes city tailoring, relaxed sporting cues, and
              heritage textures into one saved reference point for future
              dressing decisions.
            </p>
          </section>

          <div className="album-detail-grid">
            {savedLooks.map(({ id, look }) => (
              <article key={id} className="album-detail-card-wrap">
                <LookCard look={look} />
                <button
                  type="button"
                  className="btn secondary remove-inline"
                  onClick={() => removeLookFromAlbum(album.id, id)}
                >
                  Remove from trunk
                </button>
              </article>
            ))}
          </div>

          {missingLookIds.length > 0 && (
            <section className="missing-looks-list editorial-panel">
              <p className="eyebrow">Unavailable looks</p>
              <ul>
                {missingLookIds.map((id) => (
                  <li key={id}>
                    <span>Catalog item removed.</span>
                    <button
                      type="button"
                      className="btn text-danger"
                      onClick={() => removeLookFromAlbum(album.id, id)}
                    >
                      Clear entry
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
