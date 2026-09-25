import { createElement as h } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');
  const galleryActive = pathname === '/' || pathname.startsWith('/look');

  return h(
    'div',
    { className: isHome ? 'layout layout-home' : 'layout' },
    h(
      'header',
      { className: 'site-header' },
      h(
        'div',
        { className: 'nav-bar' },
        h(
          Link,
          { to: '/', className: 'logo', 'aria-label': 'Lookbook home' },
          h('span', { className: 'logo-word' }, 'lookbook'),
          h(
            'svg',
            {
              className: 'logo-smile',
              viewBox: '0 0 72 14',
              'aria-hidden': 'true',
            },
            h('path', {
              d: 'M2 3c16 10 52 10 68 0',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '3',
              strokeLinecap: 'round',
            })
          )
        ),
        h(
          'nav',
          { className: 'nav', 'aria-label': 'Primary' },
          h(
            Link,
            {
              to: '/',
              className: galleryActive ? 'nav-link active' : 'nav-link',
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
        ),
        h(
          'div',
          { className: 'nav-actions' },
          h(Link, { to: '/albums', className: 'nav-text' }, 'Your albums'),
          isHome
            ? h('a', { href: '#looks', className: 'nav-cta' }, 'Explore looks')
            : h(Link, { to: '/', className: 'nav-cta' }, 'Explore looks')
        )
      )
    ),
    h('main', { className: 'main' }, children),
    h(
      'footer',
      { className: 'site-footer' },
      h(
        'div',
        { className: 'footer-grid' },
        h(
          'div',
          null,
          h('p', { className: 'footer-brand' }, 'lookbook'),
          h(
            'p',
            null,
            'Men’s seasonal edits. Save looks into albums in this browser.'
          )
        ),
        h(
          'div',
          null,
          h('p', { className: 'footer-heading' }, 'Explore'),
          h(Link, { to: '/' }, 'Gallery'),
          h(Link, { to: '/albums' }, 'Albums')
        ),
        h(
          'div',
          null,
          h('p', { className: 'footer-heading' }, 'Styles'),
          h('span', null, 'Minimal'),
          h('span', null, 'Streetwear'),
          h('span', null, 'Classic'),
          h('span', null, 'Athleisure'),
          h('span', null, 'Workwear')
        ),
        h(
          'div',
          null,
          h('p', { className: 'footer-heading' }, 'About'),
          h(
            'p',
            null,
            'Demo photos via ',
            h(
              'a',
              {
                href: 'https://unsplash.com',
                target: '_blank',
                rel: 'noopener noreferrer',
              },
              'Unsplash'
            ),
            '.'
          )
        )
      ),
      h(
        'div',
        { className: 'footer-base' },
        h('p', null, 'Demo lookbook. Modern style, designed to last.')
      )
    )
  );
}
