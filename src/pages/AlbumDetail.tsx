import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import { useAlbumsContext } from '../context/AlbumsContext';
import type { Look } from '../types';
import { STYLE_LABELS } from '../types';
import { CopyLinkButton } from '../components/CopyLinkButton';
import { buildCanonicalUrl } from '../lib/canonicalUrl';

export function AlbumDetail() {
  const { albumId } = useParams<{ albumId: string }>();
  const { albums, removeLookFromAlbum } = useAlbumsContext();
  const [looksMap, setLooksMap] = useState<Map<string, Look>>(new Map());
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const album = albums.find((a) => a.id === albumId);

  useEffect(() => {
    fetchLooks().then((all) => {
      const m = new Map(all.map((l) => [l.id, l]));
      setLooksMap(m);
    });
  }, []);

  if (!albumId || !album) {
    return (
      <div className="page-narrow">
        <p className="muted">Album not found.</p>
        <Link to="/albums">← Albums</Link>
      </div>
    );
  }

  return (
    <div className="album-detail-page">
      <Link to="/albums" className="back-link">
        ← Albums
      </Link>
      <header className="page-head album-detail-head">
        <div>
          <h1 className="page-title">{album.name}</h1>
          <p className="muted">{album.lookIds.length} saved look(s)</p>
        </div>
        <CopyLinkButton
          url={buildCanonicalUrl(origin, `/albums/${album.id}`)}
          label="Copy album link"
          className="btn ghost copy-link-btn"
          stopPropagation={false}
        />
      </header>

      {album.lookIds.length === 0 ? (
        <p className="empty-state">
          Empty album. Add looks from the gallery or look pages.
        </p>
      ) : (
        <ul className="album-looks-grid">
          {album.lookIds.map((id) => {
            const look = looksMap.get(id);
            if (!look) {
              return (
                <li key={id} className="album-look-card missing">
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
                <Link to={`/look/${look.id}`} className="album-look-link">
                  <img
                    key={`${look.id}-${look.hero}`}
                    src={look.hero}
                    alt=""
                    className="album-look-img"
                  />
                  <div className="album-look-meta">
                    <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                    <h2 className="wall-title">{look.title}</h2>
                  </div>
                </Link>
                <CopyLinkButton
                  url={buildCanonicalUrl(origin, `/look/${look.id}`)}
                  label="Copy look link"
                  className="btn copy-link-btn copy-link-btn--album-card"
                />
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
