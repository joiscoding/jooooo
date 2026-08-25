import { createElement as h, useState, type FormEvent } from 'react';
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

  return h(
    'div',
    { className: 'page-narrow albums-page' },
    h(
      'header',
      { className: 'page-head' },
      h('h1', { className: 'page-title' }, 'Albums'),
      h('p', { className: 'muted' }, 'Saved locally in this browser — persists after refresh.')
    ),
    h(
      'form',
      { onSubmit: handleCreate, className: 'create-album-form' },
      h('input', {
        className: 'text-input',
        placeholder: 'New album name',
        value: name,
        onChange: (event) => setName(event.target.value),
        'aria-label': 'Album name',
      }),
      h('button', { type: 'submit', className: 'btn primary' }, 'Create')
    ),
    albums.length === 0
      ? h(
          'p',
          { className: 'empty-state' },
          'No albums yet. Create one above, or add a look from any look page.'
        )
      : h(
          'ul',
          { className: 'album-list' },
          albums.map((album) =>
            h(
              'li',
              { key: album.id, className: 'album-list-item' },
              h(
                Link,
                { to: `/albums/${album.id}`, className: 'album-link' },
                h('span', { className: 'album-name' }, album.name),
                h(
                  'span',
                  { className: 'album-count' },
                  `${album.lookIds.length} look${album.lookIds.length === 1 ? '' : 's'}`
                )
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'btn text-danger',
                  onClick: () => {
                    if (confirm(`Delete album “${album.name}”?`)) deleteAlbum(album.id);
                  },
                },
                'Delete'
              )
            )
          )
        )
  );
}
