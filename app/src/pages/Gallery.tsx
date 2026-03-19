import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { looks, STYLE_LABELS, type StyleTag } from '../data/looks';
import AddToAlbumModal from '../components/AddToAlbumModal';
import { Plus } from 'lucide-react';

const STYLES = Object.entries(STYLE_LABELS) as [StyleTag, string][];

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = (searchParams.get('style') as StyleTag) || null;
  const [albumModal, setAlbumModal] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      activeFilter
        ? looks.filter((l) => l.styleTag === activeFilter)
        : looks,
    [activeFilter]
  );

  function setFilter(tag: StyleTag | null) {
    if (tag) {
      setSearchParams({ style: tag });
    } else {
      setSearchParams({});
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <div className="mb-10">
        <p className="text-xs tracking-[0.2em] uppercase text-warm-500 mb-2">
          Lookbooks
        </p>
        <h1 className="font-serif text-3xl md:text-4xl">Gallery</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${
            !activeFilter
              ? 'bg-stone-925 text-warm-50'
              : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
          }`}
        >
          All
        </button>
        {STYLES.map(([tag, label]) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${
              activeFilter === tag
                ? 'bg-stone-925 text-warm-50'
                : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Masonry-style grid */}
      <AnimatePresence mode="popLayout">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((look, i) => (
            <motion.div
              key={look.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="break-inside-avoid group relative overflow-hidden bg-warm-200"
            >
              <Link to={`/look/${look.id}`}>
                <img
                  src={look.image}
                  alt={look.title}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    look.aspectRatio === 'portrait'
                      ? 'aspect-[3/4]'
                      : look.aspectRatio === 'landscape'
                        ? 'aspect-[4/3]'
                        : 'aspect-square'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-base font-medium">
                    {look.title}
                  </p>
                  <p className="text-warm-300 text-xs mt-1 tracking-wider uppercase">
                    {STYLE_LABELS[look.styleTag]}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => setAlbumModal(look.id)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm text-stone-925 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                aria-label="Add to album"
              >
                <Plus size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-warm-500">
          <p className="text-sm">No looks found for this filter.</p>
        </div>
      )}

      {albumModal && (
        <AddToAlbumModal
          lookId={albumModal}
          onClose={() => setAlbumModal(null)}
        />
      )}
    </div>
  );
}
