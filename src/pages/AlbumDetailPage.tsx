import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAlbums } from '../context/AlbumsContext';
import { useLooks } from '../hooks/useLooks';
import type { StyleTag } from '../types';

const TAG_LABELS: Record<StyleTag, string> = {
  minimal: 'Minimal',
  streetwear: 'Streetwear',
  classic: 'Classic',
  athleisure: 'Athleisure',
  workwear: 'Workwear',
};

export function AlbumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { albums, removeLookFromAlbum, addLinkToAlbum, removeLinkFromAlbum, deleteAlbum } =
    useAlbums();
  const { looks, loading } = useLooks();
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const album = useMemo(
    () => albums.find((a) => a.id === id),
    [albums, id]
  );

  const albumLooks = useMemo(() => {
    if (!album) return [];
    return album.lookIds
      .map((lid) => looks.find((l) => l.id === lid))
      .filter((l): l is NonNullable<typeof l> => !!l);
  }, [album, looks]);

  if (!id) {
    return null;
  }

  if (!album) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-24">
        <p className="text-stone mb-4">Album not found.</p>
        <Link to="/albums" className="text-sm uppercase tracking-widest">
          ← Albums
        </Link>
      </div>
    );
  }

  const currentAlbum = album;

  function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    addLinkToAlbum(currentAlbum.id, linkTitle, linkUrl);
    setLinkTitle('');
    setLinkUrl('');
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <button
        type="button"
        onClick={() => navigate('/albums')}
        className="text-xs uppercase tracking-widest text-stone hover:text-ink mb-8 bg-transparent border-0 cursor-pointer p-0"
      >
        ← Albums
      </button>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl text-ink">
            {currentAlbum.name}
          </h1>
          <p className="text-stone text-sm mt-2">
            Looks and links saved in this browser only.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm('Delete this album?')) {
              deleteAlbum(currentAlbum.id);
              navigate('/albums');
            }
          }}
          className="text-xs uppercase tracking-widest text-stone hover:text-red-800 self-start sm:self-auto bg-transparent border border-mist px-4 py-2"
        >
          Delete album
        </button>
      </div>

      <section className="mt-14">
        <h2 className="text-xs uppercase tracking-widest text-stone mb-6">
          Links
        </h2>
        <form
          onSubmit={handleAddLink}
          className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 max-w-3xl mb-8"
        >
          <input
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
            placeholder="Label"
            className="border border-mist bg-paper text-sm px-3 py-2.5"
          />
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://…"
            type="url"
            inputMode="url"
            className="border border-mist bg-paper text-sm px-3 py-2.5"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-ink text-paper text-xs uppercase tracking-widest"
          >
            Add link
          </button>
        </form>
        {currentAlbum.links.length === 0 ? (
          <p className="text-stone text-sm">No links yet.</p>
        ) : (
          <ul className="space-y-3">
            {currentAlbum.links.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-center justify-between gap-3 text-sm border-b border-mist/80 pb-3"
              >
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink font-medium"
                >
                  {l.title}
                </a>
                <span className="text-stone text-xs truncate max-w-[200px] sm:max-w-md">
                  {l.url}
                </span>
                <button
                  type="button"
                  onClick={() => removeLinkFromAlbum(currentAlbum.id, l.id)}
                  className="text-xs uppercase tracking-widest text-stone hover:text-ink bg-transparent border-0 cursor-pointer"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16">
        <h2 className="text-xs uppercase tracking-widest text-stone mb-6">
          Looks in this album
        </h2>
        {loading ? (
          <p className="text-stone text-sm">Loading looks…</p>
        ) : albumLooks.length === 0 ? (
          <p className="text-stone text-sm">
            No looks yet.{' '}
            <Link to="/" className="text-ink">
              Browse the gallery
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {albumLooks.map((look) => (
              <article
                key={look.id}
                className="group bg-mist overflow-hidden"
              >
                <Link to={`/looks/${look.id}`} className="block aspect-[3/4]">
                  <img
                    src={look.heroImage}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </Link>
                <div className="p-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone">
                      {TAG_LABELS[look.primaryTag]}
                    </p>
                    <Link
                      to={`/looks/${look.id}`}
                      className="font-display text-base no-underline hover:underline"
                    >
                      {look.title}
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLookFromAlbum(currentAlbum.id, look.id)}
                    className="shrink-0 text-[10px] uppercase tracking-widest text-stone hover:text-ink bg-transparent border-0 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
