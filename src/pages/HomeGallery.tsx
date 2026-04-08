import { LooksBrowser } from '../components/LooksBrowser';

/** Gallery-only view (full grid + filters). */
export function HomeGallery() {
  return (
    <div className="home">
      <section className="home-hero">
        <p className="eyebrow">Men · Seasonal edit</p>
        <h1 className="home-title">
          Looks built for <em>quiet</em> confidence.
        </h1>
      </section>
      <LooksBrowser />
    </div>
  );
}
