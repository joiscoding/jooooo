import type { FormEvent, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { loadLooks } from './data/lookService'
import { loadAlbums, saveAlbums } from './lib/albumStorage'
import { STYLE_TAGS } from './types'
import type { Album, Look, StyleTagId } from './types'

type SaveRequest = {
  look: Look
  albumId?: string
  albumName?: string
  albumNote?: string
}

const galleryLayouts = [
  'gallery-card--hero',
  'gallery-card--tall',
  'gallery-card--wide',
  'gallery-card--stack',
  'gallery-card--standard',
  'gallery-card--tall',
]

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function getStyleTag(styleTagId: StyleTagId) {
  return STYLE_TAGS.find((tag) => tag.id === styleTagId) ?? STYLE_TAGS[0]
}

function isStyleTagId(value: string | null): value is StyleTagId {
  return STYLE_TAGS.some((tag) => tag.id === value)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function normalizeName(value: string) {
  return value.trim().toLowerCase()
}

function toSafeUrl(value: string) {
  try {
    const parsed = new URL(value)

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }
}

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname, location.search])

  return null
}

function SiteHeader({
  albumCount,
  savedLookCount,
}: {
  albumCount: number
  savedLookCount: number
}) {
  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <span className="brand__name">Quiet Fold</span>
        <span className="brand__tagline">Men&apos;s lookbook gallery mock</span>
      </Link>

      <nav className="site-nav" aria-label="Primary">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
          end
        >
          Gallery
        </NavLink>
        <NavLink
          to="/albums"
          className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
        >
          Albums
        </NavLink>
      </nav>

      <div className="header-metrics" aria-label="Saved look stats">
        <span>{albumCount} albums</span>
        <span>{savedLookCount} saved looks</span>
      </div>
    </header>
  )
}

function SourceBanner({ endpoint }: { endpoint?: string }) {
  return (
    <div className="source-banner">
      <p>
        Running on curated seed looks because no MCP-backed feed is connected in this environment.
        {endpoint ? ` Remote endpoint "${endpoint}" fell back automatically.` : ''}
      </p>
    </div>
  )
}

function Toast({ message }: { message: string }) {
  if (!message) {
    return null
  }

  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  )
}

function EmptyState({
  title,
  copy,
  action,
}: {
  title: string
  copy: string
  action?: ReactNode
}) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{copy}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  )
}

function GalleryCard({
  look,
  layoutClass,
  onOpenSave,
}: {
  look: Look
  layoutClass: string
  onOpenSave: (look: Look) => void
}) {
  const styleTag = getStyleTag(look.styleTag)

  return (
    <article className={`gallery-card ${layoutClass}`}>
      <Link className="gallery-card__media" to={`/looks/${look.slug}`}>
        <img src={look.heroImage} alt={look.imageAlt} loading="lazy" />
      </Link>

      <div className="gallery-card__body">
        <div className="gallery-card__heading">
          <span className="tag-pill" style={{ borderColor: styleTag.accent }}>
            {styleTag.label}
          </span>
          <span className="muted-copy">{look.season}</span>
        </div>

        <div>
          <h3>{look.title}</h3>
          <p className="gallery-card__label">{look.label}</p>
        </div>

        <p className="gallery-card__summary">{look.summary}</p>

        <div className="gallery-card__meta">
          <span>{look.category}</span>
          <span>{look.occasion}</span>
        </div>

        <div className="gallery-card__actions">
          <Link className="text-link" to={`/looks/${look.slug}`}>
            Open look
          </Link>
          <button className="secondary-button" type="button" onClick={() => onOpenSave(look)}>
            Save to album
          </button>
        </div>
      </div>
    </article>
  )
}

function HomePage({
  looks,
  savedLookCount,
  albumCount,
  onOpenSave,
}: {
  looks: Look[]
  savedLookCount: number
  albumCount: number
  onOpenSave: (look: Look) => void
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeStyle = searchParams.get('style')
  const selectedTag = isStyleTagId(activeStyle) ? activeStyle : null
  const filteredLooks = selectedTag ? looks.filter((look) => look.styleTag === selectedTag) : looks
  const heroLook = looks[0]
  const supportingLooks = looks.slice(1, 3)

  return (
    <div className="page">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Modern style, designed to last</p>
          <h1>Editorial men&apos;s looks in a calm, offset gallery.</h1>
          <p className="hero-copy__lead">
            Quiet Fold is a clean MVP for lookbook-led browsing. Start from the staggered gallery,
            filter the mood, then save looks into browser-persistent albums with your own reference
            links.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#gallery">
              Browse gallery
            </a>
            <Link className="ghost-button" to="/albums">
              Open albums
            </Link>
          </div>

          <dl className="hero-stats">
            <div>
              <dt>Curated looks</dt>
              <dd>{looks.length}</dd>
            </div>
            <div>
              <dt>Style filters</dt>
              <dd>{STYLE_TAGS.length}</dd>
            </div>
            <div>
              <dt>Saved locally</dt>
              <dd>{savedLookCount}</dd>
            </div>
            <div>
              <dt>Albums built</dt>
              <dd>{albumCount}</dd>
            </div>
          </dl>
        </div>

        {heroLook ? (
          <div className="hero-feature">
            <div className="hero-feature__primary">
              <img src={heroLook.heroImage} alt={heroLook.imageAlt} />
            </div>

            <div className="hero-feature__panel">
              <div>
                <p className="eyebrow">Season highlight</p>
                <h2>{heroLook.title}</h2>
                <p>{heroLook.summary}</p>
              </div>

              <div className="hero-feature__supporting">
                {supportingLooks.map((look) => (
                  <Link key={look.id} className="supporting-look" to={`/looks/${look.slug}`}>
                    <img src={look.heroImage} alt={look.imageAlt} />
                    <div>
                      <strong>{look.title}</strong>
                      <span>{getStyleTag(look.styleTag).label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="section section--editorial">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Curated direction</p>
            <h2>Five aesthetic filters, one quiet visual language.</h2>
          </div>
          <p className="section-copy">
            Each look is tagged to one of the five required aesthetics, making the gallery easy to
            scan without turning it into a busy store grid.
          </p>
        </div>

        <div className="style-grid">
          {STYLE_TAGS.map((tag) => (
            <article key={tag.id} className="style-card">
              <span className="tag-pill" style={{ borderColor: tag.accent }}>
                {tag.label}
              </span>
              <p>{tag.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="gallery">
        <div className="section-heading section-heading--tight">
          <div>
            <p className="eyebrow">Offset gallery wall</p>
            <h2>Discover looks by mood.</h2>
          </div>

          <div className="filter-bar" aria-label="Style filters">
            <button
              className={selectedTag ? 'filter-chip' : 'filter-chip filter-chip--active'}
              type="button"
              onClick={() => setSearchParams({})}
            >
              All looks
            </button>
            {STYLE_TAGS.map((tag) => (
              <button
                key={tag.id}
                className={selectedTag === tag.id ? 'filter-chip filter-chip--active' : 'filter-chip'}
                type="button"
                onClick={() => setSearchParams({ style: tag.id })}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <div className="gallery-grid">
          {filteredLooks.map((look, index) => (
            <GalleryCard
              key={look.id}
              look={look}
              layoutClass={galleryLayouts[index % galleryLayouts.length]}
              onOpenSave={onOpenSave}
            />
          ))}
        </div>
      </section>

      <section className="section album-callout">
        <div>
          <p className="eyebrow">Album flow</p>
          <h2>Create named collections and save inspiration after refresh.</h2>
        </div>
        <p className="section-copy">
          Albums are persisted in localStorage for this browser, and each album can also store hand
          added links to product pages, editorials, or moodboards.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/albums">
            Build an album
          </Link>
          <button className="ghost-button" type="button" onClick={() => heroLook && onOpenSave(heroLook)}>
            Save the lead look
          </button>
        </div>
      </section>
    </div>
  )
}

function LookDetailPage({
  looks,
  albums,
  onOpenSave,
}: {
  looks: Look[]
  albums: Album[]
  onOpenSave: (look: Look) => void
}) {
  const params = useParams()
  const look = looks.find((entry) => entry.slug === params.slug)

  if (!look) {
    return (
      <EmptyState
        title="Look not found"
        copy="The requested look does not exist in this edit."
        action={
          <Link className="primary-button" to="/">
            Return to gallery
          </Link>
        }
      />
    )
  }

  const styleTag = getStyleTag(look.styleTag)
  const relatedLooks = looks.filter((entry) => entry.id !== look.id).slice(0, 3)
  const savedInAlbums = albums.filter((album) => album.lookIds.includes(look.id))

  return (
    <div className="page">
      <section className="look-detail">
        <div className="look-detail__media">
          <img className="look-detail__hero" src={look.heroImage} alt={look.imageAlt} />

          <div className="look-detail__gallery">
            {look.gallery.map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt={`${look.imageAlt} view ${index + 1}`} />
            ))}
          </div>
        </div>

        <div className="look-detail__content">
          <Link className="back-link" to="/">
            Back to gallery
          </Link>

          <span className="tag-pill" style={{ borderColor: styleTag.accent }}>
            {styleTag.label}
          </span>
          <h1>{look.title}</h1>
          <p className="look-detail__lead">{look.summary}</p>
          <p className="look-detail__description">{look.description}</p>

          <dl className="detail-grid">
            <div>
              <dt>Season</dt>
              <dd>{look.season}</dd>
            </div>
            <div>
              <dt>Occasion</dt>
              <dd>{look.occasion}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{look.category}</dd>
            </div>
            <div>
              <dt>Key direction</dt>
              <dd>{styleTag.description}</dd>
            </div>
          </dl>

          <div>
            <h2>Key items</h2>
            <ul className="key-item-list">
              {look.keyItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => onOpenSave(look)}>
              Add to album
            </button>
            <Link className="ghost-button" to="/albums">
              View albums
            </Link>
          </div>

          <div className="saved-context">
            <h2>Saved in</h2>
            {savedInAlbums.length ? (
              <div className="saved-context__links">
                {savedInAlbums.map((album) => (
                  <Link key={album.id} className="text-link" to={`/albums/${album.id}`}>
                    {album.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p>This look has not been saved yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading section-heading--tight">
          <div>
            <p className="eyebrow">More looks</p>
            <h2>Continue the edit.</h2>
          </div>
        </div>

        <div className="saved-look-grid">
          {relatedLooks.map((entry) => (
            <GalleryCard
              key={entry.id}
              look={entry}
              layoutClass="gallery-card--standard"
              onOpenSave={onOpenSave}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function AlbumsPage({
  albums,
  looksById,
  onCreateAlbum,
}: {
  albums: Album[]
  looksById: Map<string, Look>
  onCreateAlbum: (name: string, note: string) => Album | null
}) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('')
  const totalLinks = albums.reduce((sum, album) => sum + album.links.length, 0)
  const totalLooks = albums.reduce((sum, album) => sum + album.lookIds.length, 0)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const album = onCreateAlbum(name, note)

    if (!album) {
      setStatus('Add an album name before creating it.')
      return
    }

    setStatus(`Album "${album.name}" is ready.`)
    setName('')
    setNote('')
    navigate(`/albums/${album.id}`)
  }

  return (
    <div className="page">
      <section className="albums-hero">
        <div>
          <p className="eyebrow">Albums</p>
          <h1>Build collections that survive refresh.</h1>
          <p className="hero-copy__lead">
            Save any look into multiple named albums, then enrich each album with your own links for
            products, editorials, or moodboard references.
          </p>

          <dl className="hero-stats hero-stats--compact">
            <div>
              <dt>Albums</dt>
              <dd>{albums.length}</dd>
            </div>
            <div>
              <dt>Saved looks</dt>
              <dd>{totalLooks}</dd>
            </div>
            <div>
              <dt>Album links</dt>
              <dd>{totalLinks}</dd>
            </div>
          </dl>
        </div>

        <form className="album-form" onSubmit={handleSubmit}>
          <h2>Create a new album</h2>
          <label>
            Album name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Weekend uniform"
            />
          </label>
          <label>
            Short note
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Soft tailoring and tonal outerwear."
              rows={4}
            />
          </label>
          <button className="primary-button" type="submit">
            Create album
          </button>
          {status ? <p className="form-status">{status}</p> : null}
        </form>
      </section>

      <section className="section">
        <div className="section-heading section-heading--tight">
          <div>
            <p className="eyebrow">Saved collections</p>
            <h2>Open an album to manage links and saved looks.</h2>
          </div>
        </div>

        {albums.length ? (
          <div className="album-grid">
            {albums.map((album) => {
              const previewLooks = album.lookIds
                .map((lookId) => looksById.get(lookId))
                .filter((entry): entry is Look => Boolean(entry))
                .slice(0, 2)

              return (
                <article key={album.id} className="album-card">
                  <div className="album-card__preview">
                    {previewLooks.length ? (
                      previewLooks.map((look) => (
                        <img key={look.id} src={look.heroImage} alt={look.imageAlt} loading="lazy" />
                      ))
                    ) : (
                      <div className="album-card__placeholder">No looks saved yet</div>
                    )}
                  </div>

                  <div className="album-card__body">
                    <div>
                      <h3>{album.name}</h3>
                      <p>{album.note || 'Curate a mix of looks and external references here.'}</p>
                    </div>

                    <div className="album-card__meta">
                      <span>{album.lookIds.length} looks</span>
                      <span>{album.links.length} links</span>
                      <span>Updated {formatDate(album.updatedAt)}</span>
                    </div>

                    <Link className="text-link" to={`/albums/${album.id}`}>
                      Open album
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <EmptyState
            title="No albums yet"
            copy="Create a named album to start saving looks and external reference links."
          />
        )}
      </section>
    </div>
  )
}

function AlbumDetailPage({
  albums,
  looksById,
  onAddAlbumLink,
  onRemoveAlbumLink,
  onRemoveLookFromAlbum,
}: {
  albums: Album[]
  looksById: Map<string, Look>
  onAddAlbumLink: (albumId: string, label: string, url: string) => string
  onRemoveAlbumLink: (albumId: string, linkId: string) => string
  onRemoveLookFromAlbum: (albumId: string, lookId: string) => string
}) {
  const params = useParams()
  const album = albums.find((entry) => entry.id === params.albumId)
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('')

  if (!album) {
    return (
      <EmptyState
        title="Album not found"
        copy="That collection does not exist in local storage."
        action={
          <Link className="primary-button" to="/albums">
            Back to albums
          </Link>
        }
      />
    )
  }

  const savedLooks = album.lookIds
    .map((lookId) => looksById.get(lookId))
    .filter((entry): entry is Look => Boolean(entry))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const message = onAddAlbumLink(album.id, label, url)
    setStatus(message)

    if (message.startsWith('Added')) {
      setLabel('')
      setUrl('')
    }
  }

  return (
    <div className="page">
      <section className="album-detail">
        <div className="album-detail__summary">
          <Link className="back-link" to="/albums">
            Back to albums
          </Link>
          <p className="eyebrow">Album detail</p>
          <h1>{album.name}</h1>
          <p className="hero-copy__lead">
            {album.note || 'Use this album to collect saved looks plus outside links that support the story.'}
          </p>

          <dl className="hero-stats hero-stats--compact">
            <div>
              <dt>Saved looks</dt>
              <dd>{savedLooks.length}</dd>
            </div>
            <div>
              <dt>Added links</dt>
              <dd>{album.links.length}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{formatDate(album.updatedAt)}</dd>
            </div>
          </dl>
        </div>

        <div className="album-detail__links">
          <form className="album-form" onSubmit={handleSubmit}>
            <h2>Add a link to this album</h2>
            <label>
              Link label
              <input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Campaign reference"
              />
            </label>
            <label>
              URL
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com/editorial"
              />
            </label>
            <button className="primary-button" type="submit">
              Add link
            </button>
            {status ? <p className="form-status">{status}</p> : null}
          </form>

          <div className="link-list">
            <div className="link-list__heading">
              <h2>Saved links</h2>
              <p>Store product pages, moodboards, or editorials next to the looks.</p>
            </div>

            {album.links.length ? (
              <ul>
                {album.links.map((link) => (
                  <li key={link.id}>
                    <div>
                      <strong>{link.label}</strong>
                      <a href={link.url} target="_blank" rel="noreferrer">
                        {link.url}
                      </a>
                    </div>
                    <button
                      className="inline-button"
                      type="button"
                      onClick={() => setStatus(onRemoveAlbumLink(album.id, link.id))}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-copy">No links added yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading section-heading--tight">
          <div>
            <p className="eyebrow">Saved looks</p>
            <h2>Everything stored in this album.</h2>
          </div>
        </div>

        {savedLooks.length ? (
          <div className="saved-look-grid">
            {savedLooks.map((look) => (
              <article key={look.id} className="saved-look-card">
                <img src={look.heroImage} alt={look.imageAlt} />
                <div className="saved-look-card__body">
                  <div>
                    <span className="tag-pill" style={{ borderColor: getStyleTag(look.styleTag).accent }}>
                      {getStyleTag(look.styleTag).label}
                    </span>
                    <h3>{look.title}</h3>
                    <p>{look.label}</p>
                  </div>

                  <div className="gallery-card__actions">
                    <Link className="text-link" to={`/looks/${look.slug}`}>
                      Open look
                    </Link>
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => setStatus(onRemoveLookFromAlbum(album.id, look.id))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No looks saved yet"
            copy="Save a look from the gallery or a detail page to populate this album."
            action={
              <Link className="primary-button" to="/">
                Browse looks
              </Link>
            }
          />
        )}
      </section>
    </div>
  )
}

function SaveToAlbumDialog({
  look,
  albums,
  onClose,
  onSave,
}: {
  look: Look | null
  albums: Album[]
  onClose: () => void
  onSave: (request: SaveRequest) => void
}) {
  const [mode, setMode] = useState<'existing' | 'new'>(albums.length ? 'existing' : 'new')
  const [selectedAlbumId, setSelectedAlbumId] = useState(albums[0]?.id ?? '')
  const [newAlbumName, setNewAlbumName] = useState('')
  const [newAlbumNote, setNewAlbumNote] = useState('')

  useEffect(() => {
    setMode(albums.length ? 'existing' : 'new')
    setSelectedAlbumId(albums[0]?.id ?? '')
    setNewAlbumName('')
    setNewAlbumNote('')
  }, [look, albums])

  useEffect(() => {
    if (!look) {
      return undefined
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [look, onClose])

  if (!look) {
    return null
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSave({
      look,
      albumId: mode === 'existing' ? selectedAlbumId : undefined,
      albumName: mode === 'new' ? newAlbumName : undefined,
      albumNote: mode === 'new' ? newAlbumNote : undefined,
    })
  }

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-look-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="dialog-close" type="button" onClick={onClose} aria-label="Close dialog">
          Close
        </button>

        <p className="eyebrow">{getStyleTag(look.styleTag).label}</p>
        <h2 id="save-look-title">Save {look.title}</h2>
        <p className="section-copy">
          Choose an existing album or create a new one. Albums persist in this browser using local
          storage.
        </p>

        <form className="dialog-form" onSubmit={handleSubmit}>
          {albums.length ? (
            <div className="mode-toggle" role="group" aria-label="Save mode">
              <button
                className={mode === 'existing' ? 'filter-chip filter-chip--active' : 'filter-chip'}
                type="button"
                onClick={() => setMode('existing')}
              >
                Existing album
              </button>
              <button
                className={mode === 'new' ? 'filter-chip filter-chip--active' : 'filter-chip'}
                type="button"
                onClick={() => setMode('new')}
              >
                Create new album
              </button>
            </div>
          ) : null}

          {mode === 'existing' && albums.length ? (
            <label>
              Album
              <select value={selectedAlbumId} onChange={(event) => setSelectedAlbumId(event.target.value)}>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.name} ({album.lookIds.length} looks)
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <>
              <label>
                Album name
                <input
                  value={newAlbumName}
                  onChange={(event) => setNewAlbumName(event.target.value)}
                  placeholder="Soft tailoring rotation"
                />
              </label>
              <label>
                Note
                <textarea
                  value={newAlbumNote}
                  onChange={(event) => setNewAlbumNote(event.target.value)}
                  placeholder="Neutral dressing with looser proportions."
                  rows={4}
                />
              </label>
            </>
          )}

          <button className="primary-button" type="submit">
            Save look
          </button>
        </form>
      </div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      copy="The page you requested is not available in this MVP."
      action={
        <Link className="primary-button" to="/">
          Return home
        </Link>
      }
    />
  )
}

function AppShell() {
  const [looks, setLooks] = useState<Look[]>([])
  const [albums, setAlbums] = useState<Album[]>(() => loadAlbums())
  const [isLoading, setIsLoading] = useState(true)
  const [lookSource, setLookSource] = useState<'remote' | 'seed'>('seed')
  const [endpoint, setEndpoint] = useState<string | undefined>()
  const [dialogLook, setDialogLook] = useState<Look | null>(null)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function hydrateLooks() {
      const result = await loadLooks()

      if (!isMounted) {
        return
      }

      setLooks(result.looks)
      setLookSource(result.source)
      setEndpoint(result.endpoint)
      setIsLoading(false)
    }

    void hydrateLooks()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    saveAlbums(albums)
  }, [albums])

  useEffect(() => {
    if (!toastMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage('')
    }, 3200)

    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  const orderedAlbums = useMemo(
    () => [...albums].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
    [albums],
  )
  const savedLookCount = useMemo(
    () => albums.reduce((sum, album) => sum + album.lookIds.length, 0),
    [albums],
  )
  const looksById = useMemo(() => new Map(looks.map((look) => [look.id, look])), [looks])

  function openSaveDialog(look: Look) {
    setDialogLook(look)
  }

  function closeSaveDialog() {
    setDialogLook(null)
  }

  function createAlbum(name: string, note: string) {
    const cleanName = name.trim()
    const cleanNote = note.trim()

    if (!cleanName) {
      return null
    }

    let resolvedAlbum: Album | null = null
    let reusedExisting = false

    setAlbums((current) => {
      const existingAlbum = current.find((album) => normalizeName(album.name) === normalizeName(cleanName))

      if (existingAlbum) {
        reusedExisting = true
        resolvedAlbum = existingAlbum
        return current
      }

      const timestamp = new Date().toISOString()
      const createdAlbum: Album = {
        id: createId('album'),
        name: cleanName,
        note: cleanNote,
        lookIds: [],
        links: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      resolvedAlbum = createdAlbum

      return [createdAlbum, ...current]
    })

    if (resolvedAlbum) {
      setToastMessage(
        reusedExisting
          ? `Album "${resolvedAlbum.name}" already exists.`
          : `Created album "${resolvedAlbum.name}".`,
      )
    }

    return resolvedAlbum
  }

  function handleSaveLook({ look, albumId, albumName, albumNote }: SaveRequest) {
    let targetAlbumName = ''
    let createdAlbum = false
    let alreadySaved = false
    let didSave = false
    const normalizedAlbumName = albumName?.trim()

    setAlbums((current) => {
      const nextAlbums = current.map((album) => ({
        ...album,
        lookIds: [...album.lookIds],
        links: [...album.links],
      }))

      let targetAlbum =
        nextAlbums.find((album) => album.id === albumId) ??
        (normalizedAlbumName
          ? nextAlbums.find((album) => normalizeName(album.name) === normalizeName(normalizedAlbumName))
          : undefined)

      if (!targetAlbum && normalizedAlbumName) {
        const timestamp = new Date().toISOString()
        targetAlbum = {
          id: createId('album'),
          name: normalizedAlbumName,
          note: albumNote?.trim() ?? '',
          lookIds: [],
          links: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        }
        nextAlbums.unshift(targetAlbum)
        createdAlbum = true
      }

      if (!targetAlbum) {
        return current
      }

      targetAlbumName = targetAlbum.name

      if (targetAlbum.lookIds.includes(look.id)) {
        alreadySaved = true
        return nextAlbums
      }

      targetAlbum.lookIds.unshift(look.id)
      targetAlbum.updatedAt = new Date().toISOString()
      didSave = true

      return nextAlbums
    })

    if (!targetAlbumName) {
      setToastMessage('Choose an album or create a new one first.')
      return
    }

    if (alreadySaved) {
      setToastMessage(`"${look.title}" is already in ${targetAlbumName}.`)
      closeSaveDialog()
      return
    }

    if (didSave) {
      setToastMessage(
        createdAlbum
          ? `Created "${targetAlbumName}" and saved "${look.title}".`
          : `Saved "${look.title}" to ${targetAlbumName}.`,
      )
      closeSaveDialog()
    }
  }

  function addAlbumLink(albumId: string, label: string, url: string) {
    const cleanLabel = label.trim()
    const safeUrl = toSafeUrl(url.trim())

    if (!cleanLabel) {
      return 'Add a short label for the link.'
    }

    if (!safeUrl) {
      return 'Enter a valid http or https URL.'
    }

    let albumName = ''
    let duplicate = false

    setAlbums((current) =>
      current.map((album) => {
        if (album.id !== albumId) {
          return album
        }

        albumName = album.name

        if (album.links.some((entry) => entry.url === safeUrl)) {
          duplicate = true
          return album
        }

        return {
          ...album,
          links: [{ id: createId('link'), label: cleanLabel, url: safeUrl }, ...album.links],
          updatedAt: new Date().toISOString(),
        }
      }),
    )

    const message = duplicate
      ? `That link is already saved in ${albumName}.`
      : `Added link to ${albumName}.`
    setToastMessage(message)
    return message
  }

  function removeAlbumLink(albumId: string, linkId: string) {
    let albumName = ''

    setAlbums((current) =>
      current.map((album) => {
        if (album.id !== albumId) {
          return album
        }

        albumName = album.name

        return {
          ...album,
          links: album.links.filter((link) => link.id !== linkId),
          updatedAt: new Date().toISOString(),
        }
      }),
    )

    const message = `Removed link from ${albumName}.`
    setToastMessage(message)
    return message
  }

  function removeLookFromAlbum(albumId: string, lookId: string) {
    let albumName = ''
    let removed = false

    setAlbums((current) =>
      current.map((album) => {
        if (album.id !== albumId) {
          return album
        }

        albumName = album.name

        if (!album.lookIds.includes(lookId)) {
          return album
        }

        removed = true

        return {
          ...album,
          lookIds: album.lookIds.filter((entry) => entry !== lookId),
          updatedAt: new Date().toISOString(),
        }
      }),
    )

    const lookTitle = looksById.get(lookId)?.title ?? 'Look'
    const message = removed
      ? `Removed "${lookTitle}" from ${albumName}.`
      : `"${lookTitle}" was not saved in ${albumName}.`

    setToastMessage(message)
    return message
  }

  return (
    <div className="site-shell">
      <SiteHeader albumCount={orderedAlbums.length} savedLookCount={savedLookCount} />
      {!isLoading && lookSource === 'seed' ? <SourceBanner endpoint={endpoint} /> : null}

      <main className="site-main">
        {isLoading ? (
          <div className="loading-state">
            <p className="eyebrow">Loading edit</p>
            <h1>Building the gallery...</h1>
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  looks={looks}
                  savedLookCount={savedLookCount}
                  albumCount={orderedAlbums.length}
                  onOpenSave={openSaveDialog}
                />
              }
            />
            <Route
              path="/looks/:slug"
              element={<LookDetailPage looks={looks} albums={orderedAlbums} onOpenSave={openSaveDialog} />}
            />
            <Route
              path="/albums"
              element={
                <AlbumsPage
                  albums={orderedAlbums}
                  looksById={looksById}
                  onCreateAlbum={createAlbum}
                />
              }
            />
            <Route
              path="/albums/:albumId"
              element={
                <AlbumDetailPage
                  albums={orderedAlbums}
                  looksById={looksById}
                  onAddAlbumLink={addAlbumLink}
                  onRemoveAlbumLink={removeAlbumLink}
                  onRemoveLookFromAlbum={removeLookFromAlbum}
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </main>

      <footer className="site-footer">
        <p>Quiet Fold is a frontend-only MVP. Albums are stored locally in this browser.</p>
      </footer>

      <SaveToAlbumDialog
        look={dialogLook}
        albums={orderedAlbums}
        onClose={closeSaveDialog}
        onSave={handleSaveLook}
      />
      <Toast message={toastMessage} />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppShell />
    </BrowserRouter>
  )
}

export default App
