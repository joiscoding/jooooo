import { createElement, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAlbumsContext } from '../context/AlbumsContext';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { albums } = useAlbumsContext();

  return createElement(
    'div',
    { className: 'layout' },
    createElement(
      'header',
      { className: 'site-header' },
      createElement(
        'div',
        { className: 'header-left' },
        createElement(
          Link,
          { to: '/', className: 'logo', 'aria-label': 'Studio Lookbook home' },
          createElement(
            'span',
            { className: 'logo-wordmark', 'aria-hidden': true },
            createElement('span', { className: 'g-blue' }, 'S'),
            createElement('span', { className: 'g-red' }, 't'),
            createElement('span', { className: 'g-yellow' }, 'u'),
            createElement('span', { className: 'g-blue' }, 'd'),
            createElement('span', { className: 'g-green' }, 'i'),
            createElement('span', { className: 'g-red' }, 'o')
          ),
          createElement('span', { className: 'logo-sans' }, 'Lookbook')
        )
      ),
      createElement(
        'nav',
        { className: 'nav', 'aria-label': 'Primary navigation' },
        createElement(
          Link,
          {
            to: '/',
            className: pathname === '/' ? 'nav-link active' : 'nav-link',
          },
          'Gallery'
        ),
        createElement(
          Link,
          {
            to: '/albums',
            className: isAlbums ? 'nav-link active' : 'nav-link',
          },
          'Albums',
          albums.length > 0
            ? createElement('span', { className: 'nav-badge' }, albums.length)
            : null
        ),
        createElement(
          Link,
          {
            to: '/albums',
            className: 'header-icon-btn',
            'aria-label': 'Saved albums',
            title: 'Saved albums',
          },
          createElement(
            'svg',
            {
              width: '20',
              height: '20',
              viewBox: '0 0 24 24',
              fill: 'currentColor',
              'aria-hidden': true,
            },
            createElement('path', {
              d: 'M6 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0-6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-8c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm-6 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z',
            })
          )
        ),
        createElement(
          Link,
          { to: '/albums', className: 'header-avatar', title: 'My Albums' },
          'S'
        )
      )
    ),
    createElement('main', { className: 'main' }, children),
    createElement(
      'footer',
      { className: 'site-footer' },
      createElement(
        'div',
        { className: 'footer-top' },
        createElement('span', null, 'Studio Lookbook — Men · Seasonal Edit')
      ),
      createElement(
        'div',
        { className: 'footer-bottom' },
        createElement(
          'div',
          { className: 'footer-links' },
          createElement(Link, { to: '/' }, 'Gallery'),
          createElement(Link, { to: '/albums' }, 'Albums')
        ),
        createElement(
          'p',
          { className: 'footer-credit' },
          'Demo — photos via ',
          createElement(
            'a',
            {
              href: 'https://unsplash.com',
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            'Unsplash'
          ),
          '. Modern style, designed to last.'
        )
      )
    )
  );
}
