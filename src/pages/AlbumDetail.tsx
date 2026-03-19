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
      <div className="pdp-empty">
        <p>Album not found.</p>
        <Link to="/albums" className="text-link">&larr; Back to Albums</Link>
      </div>
    );
  }

  return (
    <div className="album-detail-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Gallery</Link>
        <span className="breadcrumb-sep">/</span>
        <Link to="/albums">Albums</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{album.name}</span>
      </nav>

      <header className="albums-header">
        <h1 className="albums-title">{album.name}</h1>
        <p className="albums-subtitle">
          {album.lookIds.length} saved look{album.lookIds.length === 1 ? '' : 's'}
        </p>
      </header>

      {album.lookIds.length === 0 ? (
        <div className="albums-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p>No looks saved yet</p>
          <span>Browse the <Link to="/">gallery</Link> to find looks you love.</span>
        </div>
      ) : (
        <div className="product-grid">
          {album.lookIds.map((id) => {
            const look = looksMap.get(id);
            if (!look) {
              return (
                <div key={id} className="product-card product-card-missing">
                  <p>Look removed from catalog</p>
                  <button
                    type="button"
                    className="pdp-btn pdp-btn-secondary"
                    onClick={() => removeLookFromAlbum(album.id, id)}
                  >
                    Remove
                  </button>
                </div>
              );
            }
            return (
              <div key={id} className="product-card">
                <Link to={`/look/${look.id}`} className="product-card-link">
                  <div className="product-img-wrap">
                    <img src={look.hero} alt={look.title} className="product-img" loading="lazy" />
                  </div>
                  <div className="product-info">
                    <span className="product-tag">{STYLE_LABELS[look.tag]}</span>
                    <h3 className="product-name">{look.title}</h3>
                    <p className="product-meta">{look.season} &middot; {look.occasion}</p>
                  </div>
                </Link>
                <button
                  type="button"
                  className="album-remove-btn"
                  onClick={() => removeLookFromAlbum(album.id, id)}
                  aria-label={`Remove ${look.title} from album`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
