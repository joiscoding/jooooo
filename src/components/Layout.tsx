import type { ReactNode } from 'react';

const navItems = [
  { label: 'Home', href: '#top' },
  { label: 'Deals', href: '#deals' },
  { label: 'New arrivals', href: '#new-arrivals' },
  { label: 'Packages', href: '#newsletter' },
];

const footerLinks = [
  'Support center',
  'Invoicing',
  'Contact',
  'Careers',
  'Blog',
  "FAQ's",
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <header className="site-header">
        <div className="top-banner">
          Free shipping on orders over $150. Easy returns and support seven days a
          week.
        </div>
        <div className="site-header-bar">
          <a href="#top" className="logo" aria-label="FASCO home">
            <span className="logo-wordmark">FASCO</span>
            <span className="logo-mark">.mel</span>
          </a>

          <nav className="nav" aria-label="Primary">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a href="#newsletter" className="header-button header-button-secondary">
              Sign in
            </a>
            <a href="#new-arrivals" className="header-button header-button-primary">
              Shop now
            </a>
          </div>
        </div>
      </header>

      <main className="main">{children}</main>

      <footer className="site-footer">
        <div className="footer-top">
          <a href="#top" className="footer-brand">
            FASCO<span>.mel</span>
          </a>
          <ul className="footer-links">
            {footerLinks.map((item) => (
              <li key={item}>
                <a href="#newsletter">{item}</a>
              </li>
            ))}
          </ul>
        </div>
        <p className="footer-copy">
          Copyright © 2026 FASCO.mel. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
