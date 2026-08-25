import { createElement, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import { useAlbumsContext } from '../context/AlbumsContext';
import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

export function LookDetail() {
  const { lookId } = useParams<{ lookId: string }>();
  const navigate = useNavigate();
  const { albums, createAlbum, addLookToAlbum } = useAlbumsContext();
  const [look, setLook] = useState<Look | null>(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchLooks().then((all) => {
      const found = all.find((item) => item.id === lookId) ?? null;
      setLook(found);
    });
  }, [lookId]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!lookId) {
    navigate('/');
    return null;
  }

  if (!look) {
    return createElement(
      'div',
      { className: 'page-narrow' },
      createElement('p', { className: 'muted' }, 'Look not found.'),
      createElement(Link, { to: '/' }, 'Back to gallery')
    );
  }

  const images = [look.hero, ...look.gallery];

  function handleAddToExisting() {
    if (!selectedAlbumId || !look) return;
    addLookToAlbum(selectedAlbumId, look.id);
    setToast('Saved to album.');
  }

  function handleCreateAndAdd(event: FormEvent) {
    event.preventDefault();
    if (!look) return;
    const name = newAlbumName.trim();
    if (!name) return;
    const album = createAlbum(name);
    addLookToAlbum(album.id, look.id);
    setNewAlbumName('');
    setToast(`Created “${album.name}” and saved this look.`);
  }

  return createElement(
    'article',
    { className: 'look-detail' },
    createElement(
      'button',
      { type: 'button', className: 'back-link', onClick: () => navigate(-1) },
      '← Back'
    ),
    createElement(
      'div',
      { className: 'look-detail-grid' },
      createElement(
        'div',
        { className: 'look-visual' },
        createElement(
          'div',
          { className: 'look-hero-wrap' },
          createElement('img', {
            key: look.hero,
            src: look.hero,
            alt: '',
            className: 'look-hero',
          })
        ),
        look.gallery.length > 0
          ? createElement(
              'div',
              { className: 'look-thumbs' },
              ...images.map((src, index) =>
                createElement('img', {
                  key: index,
                  src,
                  alt: '',
                  className: 'look-thumb',
                })
              )
            )
          : null
      ),
      createElement(
        'div',
        { className: 'look-copy' },
        createElement('p', { className: 'eyebrow' }, STYLE_LABELS[look.tag]),
        createElement('h1', { className: 'look-detail-title' }, look.title),
        createElement(
          'dl',
          { className: 'look-facts' },
          createElement(
            'div',
            null,
            createElement('dt', null, 'Season'),
            createElement('dd', null, look.season)
          ),
          createElement(
            'div',
            null,
            createElement('dt', null, 'Occasion'),
            createElement('dd', null, look.occasion)
          )
        ),
        createElement(
          'div',
          { className: 'key-items' },
          createElement('h2', { className: 'h-small' }, 'Key items'),
          createElement(
            'ul',
            null,
            ...look.keyItems.map((item) => createElement('li', { key: item }, item))
          )
        ),
        createElement(
          'div',
          { className: 'album-panel' },
          createElement('h2', { className: 'h-small' }, 'Add to album'),
          createElement(
            'div',
            { className: 'album-row' },
            createElement(
              'select',
              {
                className: 'select-input',
                value: selectedAlbumId,
                onChange: (event: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedAlbumId(event.target.value),
                'aria-label': 'Choose album',
              },
              createElement('option', { value: '' }, 'Select album…'),
              ...albums.map((album) =>
                createElement(
                  'option',
                  { key: album.id, value: album.id },
                  `${album.name} (${album.lookIds.length})`
                )
              )
            ),
            createElement(
              'button',
              {
                type: 'button',
                className: 'btn primary',
                disabled: !selectedAlbumId,
                onClick: handleAddToExisting,
              },
              'Add'
            )
          ),
          createElement(
            'form',
            { onSubmit: handleCreateAndAdd, className: 'album-new' },
            createElement('input', {
              className: 'text-input',
              placeholder: 'New album name',
              value: newAlbumName,
              onChange: (event: ChangeEvent<HTMLInputElement>) =>
                setNewAlbumName(event.target.value),
              'aria-label': 'New album name',
            }),
            createElement(
              'button',
              { type: 'submit', className: 'btn ghost' },
              'Create & add'
            )
          ),
          toast
            ? createElement('p', { className: 'toast', role: 'status' }, toast)
            : null,
          createElement(Link, { to: '/albums', className: 'inline-link' }, 'View all albums →')
        )
      )
    )
  );
}
