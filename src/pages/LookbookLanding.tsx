import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LooksBrowser } from '../components/LooksBrowser';
import { fetchLooks } from '../data/fetchLooks';
import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

function pickFeatured(looks: Look[]): Look[] {
  const ath = looks.filter((l) => l.tag === 'athleisure');
  const byId = new Map(looks.map((l) => [l.id, l]));
  const order = ['track-recovery', 'morning-lap'];
  const picked: Look[] = [];
  for (const id of order) {
    const l = byId.get(id);
    if (l) picked.push(l);
  }
  for (const l of ath) {
    if (picked.length >= 3) break;
    if (!picked.some((p) => p.id === l.id)) picked.push(l);
  }
  return picked.slice(0, 3);
}

export function LookbookLanding() {
  const [looks, setLooks] = useState<Look[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchLooks().then((data) => {
      if (!cancelled) setLooks(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const featuredLooks = useMemo(() => pickFeatured(looks), [looks]);
  const heroLook = featuredLooks[0];

  return (
    <div className="lookbook-landing">
      <section className="abc-hero" aria-label="Hero">
        <div
          className="abc-hero-bg"
          style={
            heroLook
              ? { backgroundImage: `url(${heroLook.hero})` }
              : undefined
          }
        />
        <div className="abc-hero-scrim" aria-hidden />
        <div className="abc-hero-inner">
          <p className="abc-eyebrow">Men · Performance edit</p>
          <h1 className="abc-hero-title">
            Train hard.
            <span className="abc-hero-line2">Look sharper.</span>
          </h1>
          <p className="abc-hero-dek">
            Outfit-first looks inspired by club energy — built for the floor,
            the street, and everything after.
          </p>
          <div className="abc-hero-cta">
            <a className="btn btn-abc-primary" href="#looks">
              Shop the lookbook
            </a>
            <Link className="btn btn-abc-ghost" to="/albums">
              Albums
            </Link>
          </div>
        </div>
      </section>

      <section className="abc-stats" aria-label="Edit highlights">
        <div className="abc-stat">
          <span className="abc-stat-label">Season</span>
          <span className="abc-stat-value">SS26</span>
        </div>
        <div className="abc-stat">
          <span className="abc-stat-label">Focus</span>
          <span className="abc-stat-value">Athleisure</span>
        </div>
        <div className="abc-stat">
          <span className="abc-stat-label">Drop</span>
          <span className="abc-stat-value">Live now</span>
        </div>
      </section>

      <section className="abc-featured" aria-labelledby="abc-featured-heading">
        <div className="abc-section-head">
          <h2 id="abc-featured-heading" className="abc-section-title">
            Floor favorites
          </h2>
          <p className="abc-section-dek">
            Three moves from the training edit — tap through for full breakdowns.
          </p>
        </div>
        <ul className="abc-featured-grid">
          {featuredLooks.map((look) => (
            <li key={look.id}>
              <Link to={`/look/${look.id}`} className="abc-featured-card">
                <div className="abc-featured-img-wrap">
                  <img src={look.hero} alt="" className="abc-featured-img" />
                </div>
                <div className="abc-featured-meta">
                  <span className="abc-featured-tag">
                    {STYLE_LABELS[look.tag]}
                  </span>
                  <span className="abc-featured-name">{look.title}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="looks" className="abc-lookbook-zone">
        <div className="abc-section-head abc-lookbook-head">
          <h2 className="abc-section-title">The lookbook</h2>
          <p className="abc-section-dek">
            Filter by vibe — every look is shoppable as a full outfit story.
          </p>
        </div>
        <LooksBrowser />
      </section>
    </div>
  );
}
