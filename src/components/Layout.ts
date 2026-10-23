import { createElement, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
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
          { className: 'logo-mark', 'aria-hidden': true },
          '✳'
        ),
        createElement('span', { className: 'logo-serif' }, 'Studio'),
        createElement('span', { className: 'logo-sans' }, 'Lookbook')
      ),
      createElement(
        'nav',
        { className: 'nav' },
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
          'Albums'
        )
      ),
      createElement(
        Link,
        { to: '/albums', className: 'btn-pill dark header-cta' },
        'My albums'
      )
    ),
    createElement('main', { className: 'main' }, children),
    createElement(
      'footer',
      { className: 'site-footer' },
      createElement(
        'div',
        { className: 'footer-inner' },
        createElement(
          'div',
          { className: 'footer-brand' },
          createElement(
            'span',
            { className: 'logo-mark', 'aria-hidden': true },
            '✳'
          ),
          createElement('span', { className: 'logo-serif' }, 'Studio Lookbook')
        ),
        createElement(
          'div',
          { className: 'footer-col' },
          createElement('h4', null, 'Explore'),
          createElement(Link, { to: '/' }, 'Gallery'),
          createElement(Link, { to: '/albums' }, 'Albums')
        ),
        createElement(
          'div',
          { className: 'footer-col' },
          createElement('h4', null, 'Credits'),
          createElement(
            'a',
            {
              href: 'https://unsplash.com',
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            'Unsplash'
          )
        )
      ),
      createElement(
        'p',
        { className: 'footer-note' },
        'Demo — photos via Unsplash. Modern style, designed to last.'
      )
    )
  );
}
