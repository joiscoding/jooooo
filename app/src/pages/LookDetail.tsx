import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { looks, STYLE_LABELS } from '../data/looks';
import AddToAlbumModal from '../components/AddToAlbumModal';

export default function LookDetail() {
  const { id } = useParams<{ id: string }>();
  const look = looks.find((l) => l.id === id);
  const [showAlbumModal, setShowAlbumModal] = useState(false);

  if (!look) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 text-center">
        <p className="text-warm-500 text-sm">Look not found.</p>
        <Link to="/gallery" className="btn-outline mt-6 inline-block">
          Back to Gallery
        </Link>
      </div>
    );
  }

  const relatedLooks = looks
    .filter((l) => l.styleTag === look.styleTag && l.id !== look.id)
    .slice(0, 3);

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-warm-500 hover:text-stone-925 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-warm-200 overflow-hidden"
          >
            <img
              src={look.image}
              alt={look.title}
              className="w-full h-auto object-cover aspect-[3/4]"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-warm-500 mb-3">
              {STYLE_LABELS[look.styleTag]}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl mb-3">
              {look.title}
            </h1>
            {look.subtitle && (
              <p className="text-warm-600 text-lg leading-relaxed mb-8">
                {look.subtitle}
              </p>
            )}

            <div className="space-y-4 mb-10">
              {look.season && (
                <div className="flex gap-6">
                  <span className="text-xs tracking-[0.15em] uppercase text-warm-400 w-20">
                    Season
                  </span>
                  <span className="text-sm text-warm-700">{look.season}</span>
                </div>
              )}
              {look.occasion && (
                <div className="flex gap-6">
                  <span className="text-xs tracking-[0.15em] uppercase text-warm-400 w-20">
                    Occasion
                  </span>
                  <span className="text-sm text-warm-700">
                    {look.occasion}
                  </span>
                </div>
              )}
            </div>

            {look.keyItems && look.keyItems.length > 0 && (
              <div className="mb-10">
                <p className="text-xs tracking-[0.2em] uppercase text-warm-400 mb-4">
                  Key Pieces
                </p>
                <div className="flex flex-wrap gap-2">
                  {look.keyItems.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 bg-warm-100 text-warm-700 text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowAlbumModal(true)}
              className="btn-primary inline-flex items-center gap-3 self-start"
            >
              <Bookmark size={16} />
              Save to Album
            </button>
          </motion.div>
        </div>

        {/* Related Looks */}
        {relatedLooks.length > 0 && (
          <section className="mt-24">
            <h2 className="text-xs tracking-[0.2em] uppercase text-warm-500 mb-8">
              More in {STYLE_LABELS[look.styleTag]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedLooks.map((rl) => (
                <Link
                  key={rl.id}
                  to={`/look/${rl.id}`}
                  className="group relative overflow-hidden bg-warm-200"
                >
                  <img
                    src={rl.image}
                    alt={rl.title}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <p className="text-white text-sm font-medium">{rl.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {showAlbumModal && (
        <AddToAlbumModal
          lookId={look.id}
          onClose={() => setShowAlbumModal(false)}
        />
      )}
    </>
  );
}
