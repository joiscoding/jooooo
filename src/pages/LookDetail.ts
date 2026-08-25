import { createElement as h, useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
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
      const found = all.find((l) => l.id === lookId) ?? null;
      setLook(found);
    });
  }, [lookId]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  if (!lookId) {
    navigate('/');
    return null;
  }

  if (!look) {
    return h(
      'div',
      { className: 'page-narrow' },
      h('p', { className: 'muted' }, 'Look not found.'),
      h(Link, { to: '/' }, 'Back to gallery')
    );
  }

  const current_look = look;
  const images = [current_look.hero, ...current_look.gallery];

  function handleAddToExisting() {
    if (!selectedAlbumId) return;
    addLookToAlbum(selectedAlbumId, current_look.id);
    setToast('Saved to album.');
  }

  function handleCreateAndAdd(e: FormEvent) {
    e.preventDefault();
    const name = newAlbumName.trim();
    if (!name) return;
    const al = createAlbum(name);
    addLookToAlbum(al.id, current_look.id);
    setNewAlbumName('');
    setToast(`Created “${al.name}” and saved this look.`);
  }

  return h(
    'article',
    { className: 'look-detail' },
    h(
      'button',
      { type: 'button', className: 'back-link', onClick: () => navigate(-1) },
      '← Back'
    ),
    h(
      'div',
      { className: 'look-detail-grid' },
      h(
        'div',
        { className: 'look-visual' },
        h(
          'div',
          { className: 'look-hero-wrap' },
          h('img', {
            key: current_look.hero,
            src: current_look.hero,
            alt: '',
            className: 'look-hero',
          })
        ),
        current_look.gallery.length > 0
          ? h(
              'div',
              { className: 'look-thumbs' },
              images.map((src, index) =>
                h('img', { key: index, src, alt: '', className: 'look-thumb' })
              )
            )
          : null
      ),
      h(
        'div',
        { className: 'look-copy' },
        h('p', { className: 'eyebrow' }, STYLE_LABELS[current_look.tag]),
        h('h1', { className: 'look-detail-title' }, current_look.title),
        h(
          'dl',
          { className: 'look-facts' },
          h('div', null, h('dt', null, 'Season'), h('dd', null, current_look.season)),
          h('div', null, h('dt', null, 'Occasion'), h('dd', null, current_look.occasion))
        ),
        h(
          'div',
          { className: 'key-items' },
          h('h2', { className: 'h-small' }, 'Key items'),
          h(
            'ul',
            null,
            current_look.keyItems.map((item) => h('li', { key: item }, item))
          )
        ),
        h(
          'div',
          { className: 'album-panel' },
          h('h2', { className: 'h-small' }, 'Add to album'),
          h(
            'div',
            { className: 'album-row' },
            h(
              'select',
              {
                className: 'select-input',
                value: selectedAlbumId,
                onChange: (event: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedAlbumId(event.target.value),
                'aria-label': 'Choose album',
              },
              h('option', { value: '' }, 'Select album…'),
              albums.map((album) =>
                h(
                  'option',
                  { key: album.id, value: album.id },
                  `${album.name} (${album.lookIds.length})`
                )
              )
            ),
            h(
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
          h(
            'form',
            { onSubmit: handleCreateAndAdd, className: 'album-new' },
            h('input', {
              className: 'text-input',
              placeholder: 'New album name',
              value: newAlbumName,
              onChange: (event: ChangeEvent<HTMLInputElement>) =>
                setNewAlbumName(event.target.value),
              'aria-label': 'New album name',
            }),
            h('button', { type: 'submit', className: 'btn ghost' }, 'Create & add')
          ),
          toast ? h('p', { className: 'toast', role: 'status' }, toast) : null,
          h(Link, { to: '/albums', className: 'inline-link' }, 'View all albums →')
        )
      )
    )
  );
}
