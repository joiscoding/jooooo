import { createElement as h, useEffect, useState } from 'react';
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
    return h(
      'div',
      { className: 'page-narrow' },
      h('p', { className: 'muted' }, 'Album not found.'),
      h(Link, { to: '/albums' }, '← Albums')
    );
  }

  return h(
    'div',
    { className: 'album-detail-page' },
    h(Link, { to: '/albums', className: 'back-link' }, '← Albums'),
    h(
      'header',
      { className: 'page-head' },
      h('h1', { className: 'page-title' }, album.name),
      h('p', { className: 'muted' }, `${album.lookIds.length} saved look(s)`)
    ),
    album.lookIds.length === 0
      ? h('p', { className: 'empty-state' }, 'Empty album. Add looks from the gallery or look pages.')
      : h(
          'ul',
          { className: 'album-looks-grid' },
          album.lookIds.map((id) => {
            const look = looksMap.get(id);

            if (!look) {
              return h(
                'li',
                { key: id, className: 'album-look-card missing' },
                h('p', null, 'Look removed from catalog'),
                h(
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

            return h(
              'li',
              { key: id, className: 'album-look-card' },
              h(
                Link,
                { to: `/look/${look.id}`, className: 'album-look-link' },
                h('img', {
                  key: `${look.id}-${look.hero}`,
                  src: look.hero,
                  alt: '',
                  className: 'album-look-img',
                }),
                h(
                  'div',
                  { className: 'album-look-meta' },
                  h('span', { className: 'wall-tag' }, STYLE_LABELS[look.tag]),
                  h('h2', { className: 'wall-title' }, look.title)
                )
              ),
              h(
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
