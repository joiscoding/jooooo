import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <div className="header-top">
          <div className="header-top-inner">
            <Link to="/" className="logo">
              <span className="logo-mark" aria-hidden="true">
                R
              </span>
              <span className="logo-text">Studio Lookbook</span>
            </Link>
            <div className="header-util">
              <a href="#login" className="header-util-link">
                ログイン
              </a>
              <a href="#register" className="header-util-link header-util-link--accent">
                会員登録
              </a>
              <Link to="/albums" className="header-util-link">
                マイアルバム
              </Link>
            </div>
          </div>
        </div>

        <div className="header-search-row">
          <div className="header-search-inner">
            <form className="search-form" role="search" onSubmit={(e) => e.preventDefault()}>
              <input
                type="search"
                className="search-input"
                placeholder="キーワードから探す（例：ストリート、テーラード）"
                aria-label="Search looks"
              />
              <button type="submit" className="search-submit">
                検索
              </button>
            </form>
          </div>
        </div>

        <nav className="service-tabs" aria-label="Main navigation">
          <div className="service-tabs-inner">
            <Link
              to="/"
              className={isHome ? 'service-tab active' : 'service-tab'}
            >
              トップ
            </Link>
            <Link
              to="/"
              className="service-tab"
            >
              ランキング
            </Link>
            <Link
              to="/"
              className="service-tab"
            >
              セール
            </Link>
            <Link
              to="/albums"
              className={isAlbums ? 'service-tab active' : 'service-tab'}
            >
              アルバム
            </Link>
            <span className="service-tab">新作</span>
            <span className="service-tab">ブランド</span>
          </div>
        </nav>
      </header>
      <main className={`main${isHome ? ' main--home' : ''}`}>{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p className="footer-tagline">Shopping is Entertainment!</p>
          <p>
            Demo — photos via{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
            . Rakuten-inspired lookbook experience.
          </p>
        </div>
      </footer>
    </div>
  );
}
