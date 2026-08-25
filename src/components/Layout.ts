import { createElement as h } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  function handleHomeNav() {
    if (!isHome) return;
    if (window.location.hash) {
      window.history.replaceState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return h(
    'div',
    { className: isHome ? 'layout layout--home' : 'layout' },
    h(
      'header',
      { className: 'site-header' },
      h(
        Link,
        { to: '/', className: 'logo', onClick: handleHomeNav },
        h('span', { className: 'logo-word' }, 'studio')
      ),
      h(
        'nav',
        { className: 'nav', 'aria-label': 'Primary' },
        h(
          Link,
          {
            to: '/',
            className: pathname === '/' ? 'nav-link active' : 'nav-link',
            'aria-current': pathname === '/' ? 'page' : undefined,
            onClick: handleHomeNav,
          },
          'Gallery'
        ),
        h(
          Link,
          {
            to: '/albums',
            className: isAlbums ? 'nav-cta active' : 'nav-cta',
            'aria-current': isAlbums ? 'page' : undefined,
          },
          'Albums'
        )
      )
    ),
    h('main', { className: isHome ? 'main main--flush' : 'main' }, children),
    h(
      'footer',
      { className: 'site-footer' },
      h(
        'div',
        { className: 'footer-grid' },
        h(
          'div',
          { className: 'footer-brand' },
          h('p', { className: 'footer-word' }, 'studio'),
          h('p', { className: 'muted' }, 'Men’s lookbook demo. Photos via Unsplash.')
        ),
        h(
          'div',
          null,
          h('p', { className: 'footer-heading' }, 'Product'),
          h(Link, { to: '/', onClick: handleHomeNav }, 'Gallery'),
          h(Link, { to: '/albums' }, 'Albums')
        ),
        h(
          'div',
          null,
          h('p', { className: 'footer-heading' }, 'Source'),
          h(
            'a',
            { href: 'https://unsplash.com', target: '_blank', rel: 'noopener noreferrer' },
            'Photos via Unsplash'
          ),
          h('span', { className: 'muted' }, 'Local albums only')
        )
      )
    )
  );
}
