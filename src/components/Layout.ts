import { createElement as h, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return h(
    'div',
    { className: 'layout' },
    h(
      'header',
      { className: 'site-header' },
      h(
        Link,
        { to: '/', className: 'logo' },
        h('span', { className: 'logo-mark', 'aria-hidden': true }, 'S'),
        h('span', { className: 'logo-word' }, 'Studio Lookbook')
      ),
      h(
        'nav',
        { className: 'nav' },
        h(
          Link,
          {
            to: '/',
            className: pathname === '/' ? 'nav-link active' : 'nav-link',
          },
          'Gallery'
        ),
        h(
          Link,
          {
            to: '/albums',
            className: isAlbums ? 'nav-link active' : 'nav-link',
          },
          'Albums'
        )
      )
    ),
    h('main', { className: 'main' }, children),
    h(
      'footer',
      { className: 'site-footer' },
      h(
        'div',
        null,
        h(Link, { to: '/', className: 'footer-brand' }, 'Studio Lookbook'),
        h('p', null, 'Modern style, designed to last.')
      ),
      h(
        'div',
        { className: 'footer-links' },
        h(Link, { to: '/' }, 'Gallery'),
        h(Link, { to: '/albums' }, 'Albums'),
        h(
          'a',
          {
            href: 'https://unsplash.com',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          'Photos via Unsplash'
        )
      )
    )
  );
}
