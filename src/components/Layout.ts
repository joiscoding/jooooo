import { createElement, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

function reset_scroll() {
  const previous_behavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.documentElement.style.scrollBehavior = previous_behavior;
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  const isHome = pathname === '/';

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    reset_scroll();
    const frame = window.requestAnimationFrame(reset_scroll);
    const timer = window.setTimeout(reset_scroll, 0);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return createElement(
    'div',
    { className: 'layout' },
    createElement(
      'header',
      { className: 'site-header' },
      createElement(
        Link,
        { to: '/', className: 'logo', 'aria-label': 'Studio Lookbook home' },
        createElement('span', { className: 'logo-mark', 'aria-hidden': true }),
        createElement('span', { className: 'logo-word' }, 'Studio'),
      ),
      createElement(
        'nav',
        { className: 'nav', 'aria-label': 'Primary' },
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
      createElement(
        'div',
        { className: 'header-actions' },
        createElement(
          Link,
          { to: '/albums', className: 'header-text' },
          'Saved looks',
        ),
        createElement(
          Link,
          {
            to: isHome ? '/#looks' : '/',
            className: 'btn primary header-cta',
          },
          isHome ? 'Browse looks' : 'Gallery',
        ),
      ),
    ),
    createElement(
      'main',
      { className: isHome ? 'main main-home' : 'main' },
      children,
    ),
    createElement(
      'footer',
      { className: 'site-footer' },
      createElement(
        'div',
        { className: 'footer-grid' },
        createElement(
          'div',
          null,
          createElement('p', { className: 'footer-brand' }, 'Studio Lookbook'),
          createElement(
            'p',
            { className: 'footer-note' },
            'Modern style, designed to last.',
          ),
        ),
        createElement(
          'div',
          { className: 'footer-col' },
          createElement('p', { className: 'footer-label' }, 'Lookbook'),
          createElement(Link, { to: '/' }, 'Gallery'),
          createElement(Link, { to: '/albums' }, 'Albums'),
        ),
        createElement(
          'div',
          { className: 'footer-col' },
          createElement('p', { className: 'footer-label' }, 'Photos'),
          createElement(
            'a',
            {
              href: 'https://unsplash.com',
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            'Unsplash',
          ),
        ),
      ),
      createElement(
        'p',
        { className: 'footer-legal' },
        'Demo - photos via ',
        createElement(
          'a',
          {
            href: 'https://unsplash.com',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          'Unsplash',
        ),
        '.',
      ),
    ),
  );
}
