import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAlbums } from '../context/AlbumsContext';
import { useLooks } from '../hooks/useLooks';
import type { StyleTag } from '../types';

const TAG_LABELS: Record<StyleTag, string> = {
  minimal: 'Minimal / quiet',
  streetwear: 'Streetwear / urban',
  classic: 'Classic / tailored',
  athleisure: 'Athleisure / sporty',
  workwear: 'Workwear / heritage',
};

export function LookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { looks, loading } = useLooks();
  const {
    albums,
    createAlbum,
    addLookToAlbum,
    removeLookFromAlbum,
  } = useAlbums();
  const [newAlbumName, setNewAlbumName] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState('');

  const look = useMemo(
    () => looks.find((l) => l.id === id),
    [looks, id]
  );

  const galleryImages = useMemo(() => {
    if (!look) return [];
    const imgs = look.images?.length ? look.images : [look.heroImage];
    return [look.heroImage, ...imgs.filter((u) => u !== look.heroImage)];
  }, [look]);

  if (loading || !id) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-24 text-stone text-sm">
        Loading…
      </div>
    );
  }

  if (!look) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-24">
        <p className="text-stone mb-4">Look not found.</p>
        <Link to="/" className="text-sm uppercase tracking-widest">
          ← Back to gallery
        </Link>
      </div>
    );
  }

  const currentLook = look;
  const albumsContaining = albums.filter((a) =>
    a.lookIds.includes(currentLook.id)
  );

  function handleCreateAndAdd() {
    const name = newAlbumName.trim() || 'New album';
    const a = createAlbum(name);
    addLookToAlbum(a.id, currentLook.id);
    setNewAlbumName('');
    navigate(`/albums/${a.id}`);
  }

  function handleAddToSelected() {
    if (!selectedAlbumId) return;
    addLookToAlbum(selectedAlbumId, currentLook.id);
    setSelectedAlbumId('');
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-xs uppercase tracking-widest text-stone hover:text-ink mb-10 bg-transparent border-0 cursor-pointer p-0 underline-offset-4"
      >
        ← Back
      </button>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="space-y-3">
          {galleryImages.map((src, i) => (
            <figure
              key={`${src}-${i}`}
              className="overflow-hidden bg-mist aspect-[3/4] sm:aspect-[4/5]"
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </figure>
          ))}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-stone mb-3">
            {TAG_LABELS[currentLook.primaryTag]}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight">
            {currentLook.title}
          </h1>

          <dl className="mt-8 space-y-4 text-sm">
            {currentLook.season && (
              <div>
                <dt className="text-stone text-xs uppercase tracking-widest">
                  Season
                </dt>
                <dd className="mt-1">{currentLook.season}</dd>
              </div>
            )}
            {currentLook.occasion && (
              <div>
                <dt className="text-stone text-xs uppercase tracking-widest">
                  Occasion
                </dt>
                <dd className="mt-1">{currentLook.occasion}</dd>
              </div>
            )}
            {currentLook.keyItems && currentLook.keyItems.length > 0 && (
              <div>
                <dt className="text-stone text-xs uppercase tracking-widest">
                  Key items
                </dt>
                <dd className="mt-1">{currentLook.keyItems.join(' · ')}</dd>
              </div>
            )}
          </dl>

          <div className="mt-12 pt-10 border-t border-mist">
            <h2 className="text-xs uppercase tracking-widest text-stone mb-4">
              Add to album
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <label className="flex-1 flex flex-col gap-1 text-xs text-stone">
                Existing album
                <select
                  value={selectedAlbumId}
                  onChange={(e) => setSelectedAlbumId(e.target.value)}
                  className="mt-1 border border-mist bg-paper text-ink text-sm px-3 py-2.5"
                >
                  <option value="">Choose…</option>
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={handleAddToSelected}
                disabled={!selectedAlbumId}
                className="px-5 py-2.5 bg-ink text-paper text-xs uppercase tracking-widest disabled:opacity-40"
              >
                Save
              </button>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-end">
              <label className="flex-1 flex flex-col gap-1 text-xs text-stone">
                New album name
                <input
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder="e.g. Winter edits"
                  className="mt-1 border border-mist bg-paper text-ink text-sm px-3 py-2.5"
                />
              </label>
              <button
                type="button"
                onClick={handleCreateAndAdd}
                className="px-5 py-2.5 border border-ink text-ink text-xs uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors"
              >
                Create & add
              </button>
            </div>
          </div>

          {albumsContaining.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xs uppercase tracking-widest text-stone mb-3">
                In your albums
              </h3>
              <ul className="space-y-2">
                {albumsContaining.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <Link to={`/albums/${a.id}`} className="no-underline hover:underline">
                      {a.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeLookFromAlbum(a.id, currentLook.id)}
                      className="text-xs uppercase tracking-widest text-stone hover:text-ink bg-transparent border-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
