import { createElement, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return createElement(
    'div',
    { className: 'layout' },
    createElement(
      'header',
      { className: 'site-header' },
      createElement(
        Link,
        { to: '/', className: 'logo' },
        createElement(
          'span',
          { className: 'logo-mark', 'aria-hidden': 'true' },
          createElement('span'),
          createElement('span')
        ),
        createElement('span', null, 'Studio Lookbook')
      ),
      createElement(
        'nav',
        { className: 'nav', 'aria-label': 'Primary navigation' },
        createElement(
          Link,
          {
            to: '/',
            className: pathname === '/' ? 'nav-link active' : 'nav-link',
            'aria-current': pathname === '/' ? 'page' : undefined,
          },
          'Explore'
        ),
        createElement(
          Link,
          {
            to: '/albums',
            className: isAlbums ? 'nav-link nav-link-primary active' : 'nav-link nav-link-primary',
            'aria-current': isAlbums ? 'page' : undefined,
          },
          'Albums'
        )
      )
    ),
    createElement('main', { className: isHome ? 'main home-main' : 'main' }, children),
    createElement(
      'footer',
      { className: 'site-footer' },
      createElement(
        'div',
        null,
        createElement(Link, { to: '/', className: 'footer-brand' }, 'Studio Lookbook'),
        createElement('p', null, 'Modern menswear, edited for everyday life.')
      ),
      createElement(
        'div',
        { className: 'footer-links' },
        createElement(Link, { to: '/' }, 'Explore'),
        createElement(Link, { to: '/albums' }, 'Albums'),
        createElement(
          'a',
          { href: 'https://unsplash.com', target: '_blank', rel: 'noopener noreferrer' },
          'Photography'
        )
      )
    )
  );
}
