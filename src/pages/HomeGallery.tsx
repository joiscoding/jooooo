import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const ANNOUNCEMENT_DATES = [
  'January 7, 2026',
  'December 18, 2025',
  'November 22, 2025',
  'October 30, 2025',
  'September 14, 2025',
  'August 20, 2025',
];

function formatAnnouncementDate(index: number): string {
  return ANNOUNCEMENT_DATES[index % ANNOUNCEMENT_DATES.length];
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

  const featured = useMemo(() => looks.slice(0, 4), [looks]);
  const announcements = useMemo(() => looks.slice(0, 6), [looks]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const look of looks) {
      counts[look.tag] = (counts[look.tag] ?? 0) + 1;
    }
    return counts;
  }, [looks]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home home-ir">
      <section className="ir-ticker" aria-label="Collection metrics">
        <div className="ir-ticker-inner">
          <div className="ticker-symbol">
            <span className="ticker-code">SLBK</span>
            <span className="ticker-exchange">Studio Lookbook Index</span>
          </div>
          <div className="ticker-stats">
            <div className="ticker-stat">
              <span className="ticker-label">Total Looks</span>
              <span className="ticker-value">{looks.length}</span>
            </div>
            <div className="ticker-stat">
              <span className="ticker-label">Style Categories</span>
              <span className="ticker-value">{STYLE_ORDER.length}</span>
            </div>
            <div className="ticker-stat">
              <span className="ticker-label">Season</span>
              <span className="ticker-value">SS26</span>
            </div>
            <div className="ticker-stat ticker-stat--change">
              <span className="ticker-label">Status</span>
              <span className="ticker-value ticker-up">Active</span>
            </div>
          </div>
        </div>
      </section>

      <div className="ir-body">
        <div className="ir-main">
          <section className="ir-section" id="about">
            <h2 className="ir-section-title">Corporate Profile</h2>
            <div className="ir-profile">
              <p>
                Studio Lookbook (SLBK) is a curated men&apos;s style platform
                focused on quiet confidence and seasonal edits. The collection
                spans five core style pillars — minimal, streetwear, classic,
                athleisure, and workwear — with each look documented as a
                complete outfit narrative.
              </p>
              <p>
                With a design philosophy rooted in lasting modern style, Studio
                Lookbook has established a strategic layout where editorial
                curation and personal albums serve as its pillars, with
                seasonal drops and style filters as new starting points for
                discovery.
              </p>
            </div>
          </section>

          <section className="ir-section" id="announcements">
            <h2 className="ir-section-title">Announcements</h2>
            <ul className="ir-announcements">
              {announcements.map((look, i) => (
                <li key={look.id} className="ir-announcement">
                  <time className="ir-announcement-date" dateTime="2026-01-07">
                    {formatAnnouncementDate(i)}
                  </time>
                  <Link to={`/look/${look.id}`} className="ir-announcement-link">
                    New Look Release — {look.title} ({STYLE_LABELS[look.tag]})
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/albums" className="ir-view-all">
              View all announcements →
            </Link>
          </section>

          <section className="ir-section" id="featured">
            <h2 className="ir-section-title">Featured Items</h2>
            <div className="ir-featured-grid">
              {featured.map((look) => (
                <Link
                  key={look.id}
                  to={`/look/${look.id}`}
                  className="ir-featured-card"
                >
                  <div className="ir-featured-img-wrap">
                    <img
                      src={look.hero}
                      alt=""
                      className="ir-featured-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="ir-featured-meta">
                    <span className="ir-featured-tag">
                      {STYLE_LABELS[look.tag]}
                    </span>
                    <h3 className="ir-featured-title">{look.title}</h3>
                    <span className="ir-featured-occasion">{look.occasion}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="ir-section" id="gallery">
            <h2 className="ir-section-title">Look Gallery</h2>
            <div className="ir-filters" aria-label="Style filters">
              <button
                type="button"
                className={
                  filter === 'all' ? 'ir-filter-btn active' : 'ir-filter-btn'
                }
                onClick={() => setFilter('all')}
              >
                All ({looks.length})
              </button>
              {STYLE_ORDER.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={
                    filter === tag ? 'ir-filter-btn active' : 'ir-filter-btn'
                  }
                  onClick={() => setFilter(tag)}
                >
                  {STYLE_LABELS[tag]} ({tagCounts[tag] ?? 0})
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="empty-state">No looks in this filter.</p>
            ) : (
              <div className="ir-gallery-table">
                <div className="ir-gallery-header">
                  <span>Date</span>
                  <span>Look</span>
                  <span>Style</span>
                  <span>Occasion</span>
                </div>
                {filtered.map((look, i) => (
                  <Link
                    key={look.id}
                    to={`/look/${look.id}`}
                    className="ir-gallery-row"
                  >
                    <span className="ir-gallery-date">
                      {formatAnnouncementDate(i)}
                    </span>
                    <span className="ir-gallery-title">{look.title}</span>
                    <span className="ir-gallery-tag">
                      {STYLE_LABELS[look.tag]}
                    </span>
                    <span className="ir-gallery-occasion">{look.occasion}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="ir-sidebar">
          <section className="ir-sidebar-block" id="collections">
            <h3 className="ir-sidebar-title">Quick Links</h3>
            <ul className="ir-quick-links">
              <li>
                <Link to="/albums">My Albums</Link>
              </li>
              <li>
                <a href="#about">Corporate Profile</a>
              </li>
              <li>
                <a href="#announcements">Latest Announcements</a>
              </li>
              <li>
                <a href="#featured">Featured Looks</a>
              </li>
              <li>
                <a href="#gallery">Full Gallery</a>
              </li>
            </ul>
          </section>

          <section className="ir-sidebar-block">
            <h3 className="ir-sidebar-title">Style Breakdown</h3>
            <ul className="ir-breakdown">
              {STYLE_ORDER.map((tag) => (
                <li key={tag}>
                  <span>{STYLE_LABELS[tag]}</span>
                  <span className="ir-breakdown-count">
                    {tagCounts[tag] ?? 0}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="ir-sidebar-block ir-contact">
            <h3 className="ir-sidebar-title">Investor Contact</h3>
            <dl className="ir-contact-list">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:ir@studio-lookbook.demo">ir@studio-lookbook.demo</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>(555) 240-5000</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>
                  Suite 3208, 32/F, Tower 5
                  <br />
                  The Gateway, Harbour City
                  <br />
                  Tsim Sha Tsui, Kowloon
                </dd>
              </div>
            </dl>
          </section>

          <section className="ir-sidebar-block">
            <h3 className="ir-sidebar-title">Past Events</h3>
            <ul className="ir-events">
              <li>
                <time>March 25, 2026</time>
                <span>SS26 Collection Launch Call</span>
              </li>
              <li>
                <time>December 18, 2025</time>
                <span>FW25 Season Review</span>
              </li>
              <li>
                <time>September 14, 2025</time>
                <span>Q3 Style Trends Briefing</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
