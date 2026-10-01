import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import { useAlbumsContext } from '../context/AlbumsContext';
import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

export function AlbumDetail() {
  const { albumId } = useParams<{ albumId: string }>();
  const { albums, removeLookFromAlbum } = useAlbumsContext();
  const [looksMap, setLooksMap] = useState<Map<string, Look>>(new Map());

  const album = albums.find((a) => a.id === albumId);

  useEffect(() => {
    fetchLooks().then((all) => {
      const m = new Map(all.map((l) => [l.id, l]));
      setLooksMap(m);
    });
  }, []);

  if (!albumId || !album) {
    return (
      <div className="page-narrow caps">
        <p className="muted">Album not found.</p>
        <Link to="/albums" className="inline-link">
          Albums
        </Link>
      </div>
    );
  }

  return (
    <div className="album-detail-page">
      <Link to="/albums" className="back-link caps">
        Albums
      </Link>
      <header className="page-head">
        <h1 className="page-title">{album.name}</h1>
        <p className="muted caps">
          {album.lookIds.length} saved {album.lookIds.length === 1 ? 'look' : 'looks'}
        </p>
      </header>

      {album.lookIds.length === 0 ? (
        <p className="empty-state caps">
          Empty album. Save looks from the lookbook or any look page.
        </p>
      ) : (
        <ul className="album-looks-grid">
          {album.lookIds.map((id) => {
            const look = looksMap.get(id);
            if (!look) {
              return (
                <li key={id} className="album-look-card missing caps">
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
              <li key={id} className="album-look-card">
                <Link to={`/look/${look.id}`} className="wall-card">
                  <div className="wall-frame">
                    <img src={look.hero} alt="" className="wall-img" />
                  </div>
                  <div className="wall-caption">
                    <h2 className="wall-title">{look.title}</h2>
                    <span className="wall-tag caps">{STYLE_LABELS[look.tag]}</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="btn remove-from-album"
                  onClick={() => removeLookFromAlbum(album.id, id)}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
