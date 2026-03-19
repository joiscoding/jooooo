import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLooks } from '../hooks/useLooks';
import type { StyleTag } from '../types';
import { STYLE_TAGS } from '../types';

const TAG_LABELS: Record<StyleTag, string> = {
  minimal: 'Minimal / quiet',
  streetwear: 'Streetwear / urban',
  classic: 'Classic / tailored',
  athleisure: 'Athleisure / sporty',
  workwear: 'Workwear / heritage',
};

/** Staggered sizes for editorial gallery wall */
const frameClasses = [
  'col-span-2 row-span-2 min-h-[280px] sm:min-h-[340px]',
  'col-span-1 row-span-1 min-h-[200px]',
  'col-span-1 row-span-2 min-h-[320px]',
  'col-span-2 row-span-1 min-h-[220px]',
  'col-span-1 row-span-1 min-h-[200px]',
  'col-span-1 row-span-1 min-h-[200px]',
  'col-span-2 row-span-1 min-h-[240px]',
  'col-span-1 row-span-2 min-h-[300px]',
  'col-span-1 row-span-1 min-h-[200px]',
  'col-span-2 row-span-2 min-h-[300px] sm:min-h-[360px]',
  'col-span-1 row-span-1 min-h-[200px]',
  'col-span-1 row-span-1 min-h-[200px]',
];

export function HomePage() {
  const { looks, loading, error } = useLooks();
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.primaryTag === filter);
  }, [looks, filter]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 text-stone text-sm tracking-wide">
        Loading lookbooks…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24 text-sm text-red-800">
        {error}
      </div>
    );
  }

  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-stone mb-4">
          Men’s lookbooks
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-tight max-w-2xl">
          Image-led discovery. Quiet, modern, built around the look.
        </h1>
        <p className="mt-6 text-stone max-w-xl text-sm sm:text-base leading-relaxed">
          Browse editorial outfits by aesthetic. Save looks to albums — stored
          in your browser for this demo.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-8">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
              filter === 'all'
                ? 'bg-ink text-paper border-ink'
                : 'bg-transparent text-stone border-mist hover:border-ink/30'
            }`}
          >
            All
          </button>
          {STYLE_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilter(tag)}
              className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                filter === tag
                  ? 'bg-ink text-paper border-ink'
                  : 'bg-transparent text-stone border-mist hover:border-ink/30'
              }`}
            >
              {TAG_LABELS[tag]}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
        {filtered.length === 0 ? (
          <p className="text-stone text-sm">No looks match this filter.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-fr">
            {filtered.map((look, i) => (
              <Link
                key={look.id}
                to={`/looks/${look.id}`}
                className={`group relative overflow-hidden bg-mist ${frameClasses[i % frameClasses.length]} animate-fade-up opacity-0`}
                style={{ animationDelay: `${Math.min(i * 60, 480)}ms` }}
              >
                <img
                  src={look.heroImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-paper">
                  <span className="text-[10px] uppercase tracking-widest text-paper/70">
                    {TAG_LABELS[look.primaryTag]}
                  </span>
                  <h2 className="font-display text-lg sm:text-xl mt-1 leading-snug">
                    {look.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
