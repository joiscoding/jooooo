import { createElement } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return createElement(
    'div',
    { className: 'layout' },
    createElement(
      'header',
      { className: 'site-header' },
      createElement(
        Link,
        { to: '/', className: 'logo' },
        createElement('span', { className: 'logo-mark' }, 'Studio Lookbook')
      ),
      createElement(
        'nav',
        { className: 'nav' },
        createElement(
          Link,
          { to: '/', className: isHome ? 'nav-link active' : 'nav-link' },
          'Gallery'
        ),
        createElement(
          Link,
          {
            to: '/albums',
            className: isAlbums ? 'nav-link active' : 'nav-link',
          },
          'Albums'
        ),
        createElement(
          Link,
          { to: '/albums', className: 'btn primary nav-cta' },
          'Start an album'
        )
      )
    ),
    createElement('main', { className: isHome ? 'main main-wide' : 'main' }, children),
    createElement(
      'footer',
      { className: 'site-footer' },
      createElement(
        'div',
        { className: 'wrap' },
        createElement(
          'div',
          { className: 'footer-grid' },
          createElement(
            'div',
            { className: 'footer-brand' },
            createElement('span', { className: 'logo-mark' }, 'Studio Lookbook'),
            createElement(
              'p',
              { className: 'footer-note' },
              "An image-led edit of men's outfits, kept deliberately small. Photography via ",
              createElement(
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
          ),
          createElement(
            'div',
            null,
            createElement('h2', { className: 'footer-h' }, 'Browse'),
            createElement(
              'ul',
              { className: 'footer-links' },
              createElement('li', null, createElement(Link, { to: '/' }, 'Gallery')),
              createElement('li', null, createElement(Link, { to: '/albums' }, 'Albums'))
            )
          ),
          createElement(
            'div',
            null,
            createElement('h2', { className: 'footer-h' }, 'Aesthetics'),
            createElement(
              'ul',
              { className: 'footer-links' },
              STYLE_ORDER.map((tag) =>
                createElement(
                  'li',
                  { key: tag },
                  createElement(Link, { to: `/?style=${tag}` }, STYLE_LABELS[tag])
                )
              )
            )
          ),
          createElement(
            'div',
            null,
            createElement('h2', { className: 'footer-h' }, 'About'),
            createElement(
              'ul',
              { className: 'footer-links' },
              createElement(
                'li',
                null,
                createElement(Link, { to: '/albums' }, 'Saved looks')
              ),
              createElement(
                'li',
                null,
                createElement(
                  'a',
                  {
                    href: 'https://unsplash.com',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  },
                  'Photo credits'
                )
              )
            )
          )
        ),
        createElement(
          'div',
          { className: 'footer-bottom' },
          createElement('p', null, 'Demo project. Modern style, designed to last.')
        )
      )
    )
  );
}
