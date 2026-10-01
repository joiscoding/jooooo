import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import { useAlbumsContext } from '../context/AlbumsContext';
import { LookCard, pickHoverImage } from '../components/LookCard';
import type { Look } from '../types';

export function AlbumDetail() {
  const { albumId } = useParams<{ albumId: string }>();
  const { albums, removeLookFromAlbum } = useAlbumsContext();
  const [allLooks, setAllLooks] = useState<Look[]>([]);

  const album = albums.find((a) => a.id === albumId);
  const looksMap = useMemo(
    () => new Map(allLooks.map((l) => [l.id, l])),
    [allLooks]
  );

  useEffect(() => {
    fetchLooks().then(setAllLooks);
  }, []);

  if (!albumId || !album) {
    return (
      <div className="page-narrow">
        <p className="muted">Album not found.</p>
        <Link to="/albums">← Albums</Link>
      </div>
    );
  }

  const count = album.lookIds.length;

  return (
    <div className="album-detail-page">
      <Link to="/albums" className="back-link">
        ← Albums
      </Link>
      <header className="page-head">
        <h1 className="page-title">{album.name}</h1>
        <p className="muted">
          {count} saved look{count === 1 ? '' : 's'}
        </p>
      </header>

      {count === 0 ? (
        <div className="empty-state">
          <p>Nothing saved here yet.</p>
          <Link to="/" className="btn primary">
            Browse looks
          </Link>
        </div>
      ) : (
        <ul className="album-looks-grid">
          {album.lookIds.map((id) => {
            const look = looksMap.get(id);
            if (!look) {
              return (
                <li key={id} className="album-look-missing">
                  <p>Look removed from catalog</p>
                  <button
                    type="button"
                    className="btn text-danger"
                    onClick={() => removeLookFromAlbum(album.id, id)}
                  >
                    Remove from album
                  </button>
                </li>
              );
            }
            return (
              <li key={id}>
                <LookCard
                  look={look}
                  hoverImage={pickHoverImage(look, allLooks)}
                  action={
                    <button
                      type="button"
                      className="btn remove-from-album"
                      onClick={() => removeLookFromAlbum(album.id, id)}
                    >
                      Remove
                    </button>
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
