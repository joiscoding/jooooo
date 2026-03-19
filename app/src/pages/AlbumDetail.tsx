import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, X, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAlbum,
  removeLookFromAlbum,
  addLinkToAlbum,
  removeLinkFromAlbum,
  getAlbumLinks,
  type Album,
} from '../store/albums';
import { looks, STYLE_LABELS } from '../data/looks';

export default function AlbumDetail() {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | undefined>();
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  useEffect(() => {
    if (id) {
      setAlbum(getAlbum(id));
      setLinks(getAlbumLinks(id));
    }
  }, [id]);

  function refresh() {
    if (id) {
      setAlbum(getAlbum(id));
      setLinks(getAlbumLinks(id));
    }
  }

  function handleRemoveLook(lookId: string) {
    if (id) {
      removeLookFromAlbum(id, lookId);
      refresh();
    }
  }

  function handleAddLink() {
    if (!id || !newLink.trim()) return;
    let url = newLink.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    addLinkToAlbum(id, url);
    setNewLink('');
    setShowLinkInput(false);
    refresh();
  }

  function handleRemoveLink(link: string) {
    if (id) {
      removeLinkFromAlbum(id, link);
      refresh();
    }
  }

  if (!album) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 text-center">
        <p className="text-warm-500 text-sm">Album not found.</p>
        <Link to="/albums" className="btn-outline mt-6 inline-block">
          Back to Albums
        </Link>
      </div>
    );
  }

  const albumLooks = album.lookIds
    .map((lid) => looks.find((l) => l.id === lid))
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
      <Link
        to="/albums"
        className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-warm-500 hover:text-stone-925 transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        All Albums
      </Link>

      <div className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl">{album.name}</h1>
        <p className="text-xs text-warm-500 mt-1 tracking-wider">
          {album.lookIds.length}{' '}
          {album.lookIds.length === 1 ? 'look' : 'looks'}
          {links.length > 0 && ` · ${links.length} ${links.length === 1 ? 'link' : 'links'}`}
        </p>
      </div>

      {/* Saved Links */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs tracking-[0.2em] uppercase text-warm-500">
            Links
          </h2>
          {!showLinkInput && (
            <button
              onClick={() => setShowLinkInput(true)}
              className="flex items-center gap-1.5 text-xs text-warm-500 hover:text-stone-925 transition-colors"
            >
              <Plus size={14} />
              Add Link
            </button>
          )}
        </div>

        {showLinkInput && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 mb-4"
          >
            <input
              autoFocus
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
              placeholder="https://example.com"
              className="flex-1 max-w-md border border-warm-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-stone-925 transition-colors"
            />
            <button onClick={handleAddLink} className="btn-primary text-xs">
              Add
            </button>
            <button
              onClick={() => {
                setShowLinkInput(false);
                setNewLink('');
              }}
              className="px-3 py-2 text-warm-500 text-sm hover:text-stone-925 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}

        {links.length > 0 ? (
          <div className="space-y-2">
            {links.map((link) => (
              <div
                key={link}
                className="flex items-center gap-3 px-4 py-3 bg-warm-100 group"
              >
                <ExternalLink size={14} className="text-warm-400 shrink-0" />
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-warm-700 hover:text-stone-925 transition-colors truncate flex-1"
                >
                  {link}
                </a>
                <button
                  onClick={() => handleRemoveLink(link)}
                  className="text-warm-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove link"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          !showLinkInput && (
            <p className="text-warm-400 text-xs">
              No links yet. Add links to reference external content.
            </p>
          )
        )}
      </section>

      {/* Saved Looks */}
      <section>
        <h2 className="text-xs tracking-[0.2em] uppercase text-warm-500 mb-6">
          Saved Looks
        </h2>

        {albumLooks.length === 0 ? (
          <div className="text-center py-16 bg-warm-100">
            <p className="text-warm-500 text-sm mb-2">
              No looks in this album yet.
            </p>
            <Link
              to="/gallery"
              className="text-xs tracking-[0.15em] uppercase text-warm-500 hover:text-stone-925 transition-colors"
            >
              Browse Gallery
            </Link>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {albumLooks.map((look) =>
                look ? (
                  <motion.div
                    key={look.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative overflow-hidden bg-warm-200"
                  >
                    <Link to={`/look/${look.id}`}>
                      <img
                        src={look.image}
                        alt={look.title}
                        className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                        <p className="text-white text-sm font-medium">
                          {look.title}
                        </p>
                        <p className="text-warm-300 text-xs mt-0.5 tracking-wider uppercase">
                          {STYLE_LABELS[look.styleTag]}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleRemoveLook(look.id)}
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm text-warm-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      aria-label="Remove from album"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ) : null
              )}
            </div>
          </AnimatePresence>
        )}
      </section>
    </div>
  );
}
