import { createElement, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAlbumsContext } from '../context/AlbumsContext';

export function AlbumsList() {
  const { albums, createAlbum, deleteAlbum } = useAlbumsContext();
  const [name, setName] = useState('');

  function handleCreate(event: FormEvent) {
    event.preventDefault();
    const trimmed_name = name.trim();
    if (!trimmed_name) return;
    createAlbum(trimmed_name);
    setName('');
  }

  return createElement(
    'div',
    { className: 'page-narrow albums-page' },
    createElement(
      'header',
      { className: 'page-head' },
      createElement('h1', { className: 'page-title' }, 'Albums'),
      createElement('p', { className: 'muted' }, 'Saved locally in this browser — persists after refresh.')
    ),
    createElement(
      'form',
      { onSubmit: handleCreate, className: 'create-album-form' },
      createElement('input', {
        className: 'text-input',
        placeholder: 'New album name',
        value: name,
        onChange: (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value),
        'aria-label': 'Album name',
      }),
      createElement('button', { type: 'submit', className: 'btn primary' }, 'Create')
    ),
    albums.length === 0
      ? createElement(
          'p',
          { className: 'empty-state' },
          'No albums yet. Create one above, or add a look from any look page.'
        )
      : createElement(
          'ul',
          { className: 'album-list' },
          ...albums.map((album) =>
            createElement(
              'li',
              { key: album.id, className: 'album-list-item' },
              createElement(
                Link,
                { to: `/albums/${album.id}`, className: 'album-link' },
                createElement('span', { className: 'album-name' }, album.name),
                createElement(
                  'span',
                  { className: 'album-count' },
                  `${album.lookIds.length} look${album.lookIds.length === 1 ? '' : 's'}`
                )
              ),
              createElement(
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
