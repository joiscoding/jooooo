import { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import {
  getAlbums,
  createAlbum,
  addLookToAlbum,
  type Album,
} from '../store/albums';

interface Props {
  lookId: string;
  onClose: () => void;
}

export default function AddToAlbumModal({ lookId, onClose }: Props) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [newName, setNewName] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  useEffect(() => {
    setAlbums(getAlbums());
  }, []);

  function handleAdd(albumId: string) {
    addLookToAlbum(albumId, lookId);
    setAlbums(getAlbums());
    setJustAdded(albumId);
    setTimeout(() => setJustAdded(null), 1200);
  }

  function handleCreate() {
    if (!newName.trim()) return;
    const album = createAlbum(newName);
    addLookToAlbum(album.id, lookId);
    setAlbums(getAlbums());
    setNewName('');
    setShowNew(false);
    setJustAdded(album.id);
    setTimeout(() => setJustAdded(null), 1200);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-warm-50 w-full max-w-md mx-4 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-warm-500 hover:text-stone-925 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h3 className="text-xs tracking-[0.2em] uppercase mb-6">
          Add to Album
        </h3>

        {albums.length === 0 && !showNew && (
          <p className="text-warm-500 text-sm mb-4">
            No albums yet. Create one to get started.
          </p>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto mb-6">
          {albums.map((album) => {
            const alreadyIn = album.lookIds.includes(lookId);
            const added = justAdded === album.id;
            return (
              <button
                key={album.id}
                onClick={() => !alreadyIn && handleAdd(album.id)}
                disabled={alreadyIn}
                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                  alreadyIn
                    ? 'bg-warm-100 text-warm-400'
                    : 'hover:bg-warm-100 text-stone-925'
                }`}
              >
                <span className="text-sm">{album.name}</span>
                {alreadyIn && !added && (
                  <span className="text-xs text-warm-400">Added</span>
                )}
                {added && <Check size={16} className="text-green-600" />}
              </button>
            );
          })}
        </div>

        {showNew ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Album name"
              className="flex-1 border border-warm-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-stone-925 transition-colors"
            />
            <button onClick={handleCreate} className="btn-primary text-xs">
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 text-sm text-warm-600 hover:text-stone-925 transition-colors"
          >
            <Plus size={16} />
            Create new album
          </button>
        )}
      </div>
    </div>
  );
}
