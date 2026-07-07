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
        createElement('span', { className: 'logo-mark' }, 'R'),
        createElement('span', { className: 'logo-word' }, 'Style Rewards')
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
          'Shop looks'
        ),
        createElement(
          Link,
          {
            to: '/albums',
            className: isAlbums ? 'nav-link active' : 'nav-link',
          },
          'Saved'
        )
      )
    ),
    createElement('main', { className: 'main' }, children),
    createElement(
      'footer',
      { className: 'site-footer' },
      createElement(
        'p',
        null,
        'Demo storefront — photos via ',
        createElement(
          'a',
          {
            href: 'https://unsplash.com',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          'Unsplash'
        ),
        '. Rewards-inspired shopping experience.'
      )
    )
  );
}
