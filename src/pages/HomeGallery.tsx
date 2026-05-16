import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

function groupBySeason(looks: Look[]): { season: string; looks: Look[] }[] {
  const order: string[] = [];
  const buckets = new Map<string, Look[]>();
  for (const look of looks) {
    if (!buckets.has(look.season)) {
      order.push(look.season);
      buckets.set(look.season, []);
    }
    buckets.get(look.season)!.push(look);
  }
  return order.map((season) => ({
    season,
    looks: buckets.get(season)!,
  }));
}

function tagPillLabel(tag: StyleTag): string {
  switch (tag) {
    case 'minimal':
      return 'Minimal';
    case 'streetwear':
      return 'Street';
    case 'classic':
      return 'Classic';
    case 'athleisure':
      return 'Sport';
    case 'workwear':
      return 'Workwear';
    default: {
      const _exhaustive: never = tag;
      return _exhaustive;
    }
  }
}

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchLooks().then((data) => {
      if (!cancelled) {
        setLooks(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  const timeline = useMemo(() => groupBySeason(filtered), [filtered]);

  if (loading) {
    return (
      <div className="page-loading side-events-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home side-events" id="side-events">
      <header className="side-events-hero">
        <p className="side-events-kicker">Around the studio</p>
        <h1 className="side-events-title">Side looks</h1>
        <p className="side-events-lead">
          Come for the quiet edit, stay for the rotation. The season around the
          lookbook is packed with silhouettes, fabric notes, and pairings worth
          bookmarking — here&apos;s what&apos;s on rails right now.
        </p>
        <div className="side-events-cta-row">
          <Link className="side-events-calendar-link" to="/albums">
            Full albums index →
          </Link>
        </div>
        <p className="side-events-host-note">
          Curating a drop? Reach the studio on Slack and we&apos;ll add it to the
          wall.
        </p>
      </header>

      <section className="side-events-filters" aria-label="Style filters">
        <button
          type="button"
          className={
            filter === 'all' ? 'side-events-pill active' : 'side-events-pill'
          }
          onClick={() => setFilter('all')}
        >
          All looks
        </button>
        {STYLE_ORDER.map((tag) => (
          <button
            key={tag}
            type="button"
            className={
              filter === tag ? 'side-events-pill active' : 'side-events-pill'
            }
            onClick={() => setFilter(tag)}
          >
            {STYLE_LABELS[tag]}
          </button>
        ))}
      </section>

      {filtered.length === 0 ? (
        <p className="empty-state">No looks in this filter.</p>
      ) : (
        <div className="side-events-timeline">
          {timeline.map(({ season, looks: dayLooks }) => (
            <section key={season} className="side-events-day">
              <div className="side-events-day-label">
                <span className="side-events-day-date">{season}</span>
              </div>
              <ul className="side-events-day-list">
                {dayLooks.map((look) => (
                  <li key={look.id}>
                    <Link to={`/look/${look.id}`} className="side-events-card">
                      <div className="side-events-card-thumb">
                        <img src={look.hero} alt="" loading="lazy" />
                      </div>
                      <div className="side-events-card-body">
                        <span className="side-events-card-kind">
                          {tagPillLabel(look.tag)}
                        </span>
                        <h2 className="side-events-card-title">{look.title}</h2>
                        <p className="side-events-card-meta">
                          <span>{look.occasion}</span>
                          {look.keyItems[0] ? (
                            <>
                              <span className="side-events-meta-sep">·</span>
                              <span>{look.keyItems[0]}</span>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
