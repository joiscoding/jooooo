import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { looks } from '../data/looks';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import AddToAlbumModal from '../components/AddToAlbumModal';

const GALLERY_LAYOUT = [
  { col: 'col-span-2', row: 'row-span-2', idx: 0 },
  { col: 'col-span-1', row: 'row-span-1', idx: 1 },
  { col: 'col-span-1', row: 'row-span-2', idx: 2 },
  { col: 'col-span-1', row: 'row-span-1', idx: 3 },
  { col: 'col-span-1', row: 'row-span-1', idx: 4 },
  { col: 'col-span-2', row: 'row-span-1', idx: 5 },
  { col: 'col-span-1', row: 'row-span-2', idx: 6 },
  { col: 'col-span-1', row: 'row-span-1', idx: 7 },
];

export default function Home() {
  const [albumModal, setAlbumModal] = useState<string | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[85vh] flex items-end overflow-hidden bg-stone-925">
        <img
          src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1600&q=80"
          alt="Editorial fashion"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-10 pb-16 md:pb-24">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-tight max-w-2xl"
          >
            Modern Style,
            <br />
            Designed To Last
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="mt-4 text-warm-300 text-base md:text-lg max-w-md"
          >
            Curated lookbooks for the contemporary man. Discover outfits that
            speak with quiet confidence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/gallery"
              className="inline-flex items-center gap-3 mt-8 text-white text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity"
            >
              Explore Lookbooks
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Staggered Gallery Wall */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-warm-500 mb-2">
              Season Edit
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">
              The Lookbook Wall
            </h2>
          </div>
          <Link
            to="/gallery"
            className="hidden md:flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-warm-500 hover:text-stone-925 transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[240px] gap-3 md:gap-4">
          {GALLERY_LAYOUT.map(({ col, row, idx }) => {
            const look = looks[idx];
            if (!look) return null;
            return (
              <motion.div
                key={look.id}
                className={`${col} ${row} relative group cursor-pointer overflow-hidden bg-warm-200`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
              >
                <Link to={`/look/${look.id}`} className="block h-full">
                  <img
                    src={look.image}
                    alt={look.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-sm font-medium">
                      {look.title}
                    </p>
                    <p className="text-warm-300 text-xs mt-0.5 tracking-wider uppercase">
                      {look.styleTag}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setAlbumModal(look.id);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm text-stone-925 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white text-xs"
                  aria-label="Add to album"
                >
                  +
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="md:hidden mt-8 text-center">
          <Link to="/gallery" className="btn-outline inline-block">
            View All Looks
          </Link>
        </div>
      </section>

      {/* Style Categories Preview */}
      <section className="bg-warm-100 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs tracking-[0.2em] uppercase text-warm-500 mb-2">
            Discover
          </p>
          <h2 className="font-serif text-3xl md:text-4xl mb-10">
            Browse by Style
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                tag: 'minimal',
                label: 'Minimal',
                img: looks[0].image,
              },
              {
                tag: 'streetwear',
                label: 'Streetwear',
                img: looks[1].image,
              },
              {
                tag: 'classic',
                label: 'Classic',
                img: looks[2].image,
              },
              {
                tag: 'athleisure',
                label: 'Athleisure',
                img: looks[3].image,
              },
              {
                tag: 'workwear',
                label: 'Workwear',
                img: looks[4].image,
              },
            ].map(({ tag, label, img }) => (
              <Link
                key={tag}
                to={`/gallery?style=${tag}`}
                className="group relative h-64 lg:h-80 overflow-hidden bg-warm-200"
              >
                <img
                  src={img}
                  alt={label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75 group-hover:brightness-[0.6]"
                />
                <div className="absolute inset-0 flex items-end p-5">
                  <span className="text-white text-xs tracking-[0.2em] uppercase">
                    {label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {albumModal && (
        <AddToAlbumModal
          lookId={albumModal}
          onClose={() => setAlbumModal(null)}
        />
      )}
    </>
  );
}
