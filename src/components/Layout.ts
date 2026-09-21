import { createElement } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';

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
        createElement('span', { className: 'logo-serif' }, 'Studio'),
        createElement('span', { className: 'logo-sans' }, 'Lookbook'),
      ),
      createElement(
        'div',
        { className: 'header-end' },
        createElement(
          'nav',
          { className: 'nav' },
          createElement(
            Link,
            {
              to: '/',
              className: pathname === '/' ? 'nav-link active' : 'nav-link',
            },
            'Gallery',
          ),
          createElement(
            Link,
            {
              to: '/albums',
              className: isAlbums ? 'nav-link active' : 'nav-link',
            },
            'Albums',
          ),
        ),
        createElement(ThemeToggle),
      ),
    ),
    createElement('main', { className: 'main' }, children),
    createElement(
      'footer',
      { className: 'site-footer' },
      createElement(
        'p',
        null,
        'Demo — photos via ',
        createElement(
          'a',
          {
            href: 'https://unsplash.com',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          'Unsplash',
        ),
        '. Modern style, designed to last.',
      ),
    ),
  );
}
