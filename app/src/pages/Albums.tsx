import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAlbums,
  createAlbum,
  deleteAlbum,
  type Album,
} from '../store/albums';
import { looks } from '../data/looks';

export default function Albums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    setAlbums(getAlbums());
  }, []);

  function handleCreate() {
    if (!newName.trim()) return;
    createAlbum(newName);
    setAlbums(getAlbums());
    setNewName('');
    setShowCreate(false);
  }

  function handleDelete(id: string) {
    deleteAlbum(id);
    setAlbums(getAlbums());
  }

  function getCoverImage(album: Album): string | null {
    if (album.lookIds.length === 0) return null;
    const look = looks.find((l) => l.id === album.lookIds[0]);
    return look?.image ?? null;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-warm-500 mb-2">
            Your Collection
          </p>
          <h1 className="font-serif text-3xl md:text-4xl">Albums</h1>
        </div>
        {!showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="btn-outline flex items-center gap-2"
          >
            <Plus size={14} />
            New Album
          </button>
        )}
      </div>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-8"
        >
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Album name"
            className="flex-1 max-w-sm border border-warm-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-stone-925 transition-colors"
          />
          <button onClick={handleCreate} className="btn-primary">
            Create
          </button>
          <button
            onClick={() => {
              setShowCreate(false);
              setNewName('');
            }}
            className="px-4 py-2.5 text-warm-500 text-sm hover:text-stone-925 transition-colors"
          >
            Cancel
          </button>
        </motion.div>
      )}

      {albums.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen size={48} className="mx-auto text-warm-300 mb-4" />
          <p className="text-warm-500 text-sm mb-2">No albums yet</p>
          <p className="text-warm-400 text-xs">
            Create an album and start saving looks you love.
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => {
              const cover = getCoverImage(album);
              return (
                <motion.div
                  key={album.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative"
                >
                  <Link
                    to={`/albums/${album.id}`}
                    className="block overflow-hidden bg-warm-200"
                  >
                    {cover ? (
                      <img
                        src={cover}
                        alt={album.name}
                        className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] flex items-center justify-center bg-warm-100">
                        <FolderOpen
                          size={40}
                          className="text-warm-300"
                        />
                      </div>
                    )}
                  </Link>
                  <div className="mt-3 flex items-start justify-between">
                    <Link to={`/albums/${album.id}`}>
                      <p className="text-sm font-medium">{album.name}</p>
                      <p className="text-xs text-warm-500 mt-0.5">
                        {album.lookIds.length}{' '}
                        {album.lookIds.length === 1 ? 'look' : 'looks'}
                      </p>
                    </Link>
                    <button
                      onClick={() => handleDelete(album.id)}
                      className="p-1.5 text-warm-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Delete album"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
