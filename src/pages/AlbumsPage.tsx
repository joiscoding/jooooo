import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlbums } from '../context/AlbumsContext';

export function AlbumsPage() {
  const { albums, createAlbum } = useAlbums();
  const [name, setName] = useState('');

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createAlbum(name.trim());
    setName('');
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <h1 className="font-display text-4xl sm:text-5xl text-ink">Albums</h1>
      <p className="mt-4 text-stone text-sm max-w-lg leading-relaxed">
        Saved locally in your browser. Add looks from a look page, and attach
        reference links on each album.
      </p>

      <form
        onSubmit={handleCreate}
        className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-end max-w-xl"
      >
        <label className="flex-1 flex flex-col gap-1 text-xs text-stone uppercase tracking-widest">
          New album
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="mt-1 border border-mist bg-paper text-ink text-sm px-3 py-2.5 normal-case tracking-normal"
          />
        </label>
        <button
          type="submit"
          className="px-6 py-2.5 bg-ink text-paper text-xs uppercase tracking-widest"
        >
          Create
        </button>
      </form>

      <ul className="mt-14 space-y-6">
        {albums.length === 0 ? (
          <li className="text-stone text-sm">No albums yet.</li>
        ) : (
          albums.map((a) => (
            <li key={a.id} className="border-b border-mist pb-6">
              <Link
                to={`/albums/${a.id}`}
                className="font-display text-2xl text-ink no-underline hover:opacity-70"
              >
                {a.name}
              </Link>
              <p className="text-stone text-xs uppercase tracking-widest mt-2">
                {a.lookIds.length} look{a.lookIds.length === 1 ? '' : 's'} ·{' '}
                {a.links.length} link{a.links.length === 1 ? '' : 's'}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
