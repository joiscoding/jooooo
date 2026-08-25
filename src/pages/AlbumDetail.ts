import { createElement, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import { useAlbumsContext } from '../context/AlbumsContext';
import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

export function AlbumDetail() {
  const { albumId } = useParams<{ albumId: string }>();
  const { albums, removeLookFromAlbum } = useAlbumsContext();
  const [looksMap, setLooksMap] = useState<Map<string, Look>>(new Map());

  const album = albums.find((item) => item.id === albumId);

  useEffect(() => {
    fetchLooks().then((all) => {
      const map = new Map(all.map((look) => [look.id, look]));
      setLooksMap(map);
    });
  }, []);

  if (!albumId || !album) {
    return createElement(
      'div',
      { className: 'page-narrow' },
      createElement('p', { className: 'muted' }, 'Album not found.'),
      createElement(Link, { to: '/albums' }, '← Albums')
    );
  }

  return createElement(
    'div',
    { className: 'album-detail-page' },
    createElement(Link, { to: '/albums', className: 'back-link' }, '← Albums'),
    createElement(
      'header',
      { className: 'page-head' },
      createElement('h1', { className: 'page-title' }, album.name),
      createElement('p', { className: 'muted' }, `${album.lookIds.length} saved look(s)`)
    ),
    album.lookIds.length === 0
      ? createElement(
          'p',
          { className: 'empty-state' },
          'Empty album. Add looks from the gallery or look pages.'
        )
      : createElement(
          'ul',
          { className: 'album-looks-grid' },
          ...album.lookIds.map((id) => {
            const look = looksMap.get(id);
            if (!look) {
              return createElement(
                'li',
                { key: id, className: 'album-look-card missing' },
                createElement('p', null, 'Look removed from catalog'),
                createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'btn text-danger',
                    onClick: () => removeLookFromAlbum(album.id, id),
                  },
                  'Remove from album'
                )
              );
            }

            return createElement(
              'li',
              { key: id, className: 'album-look-card' },
              createElement(
                Link,
                { to: `/look/${look.id}`, className: 'album-look-link' },
                createElement('img', {
                  key: `${look.id}-${look.hero}`,
                  src: look.hero,
                  alt: '',
                  className: 'album-look-img',
                }),
                createElement(
                  'div',
                  { className: 'album-look-meta' },
                  createElement('span', { className: 'wall-tag' }, STYLE_LABELS[look.tag]),
                  createElement('h2', { className: 'wall-title' }, look.title)
                )
              ),
              createElement(
                'button',
                {
                  type: 'button',
                  className: 'btn remove-from-album',
                  onClick: () => removeLookFromAlbum(album.id, id),
                },
                'Remove'
              )
            );
          })
        )
  );
}
