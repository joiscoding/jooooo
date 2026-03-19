import { Link, NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-mist/80 bg-paper/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-6">
          <Link
            to="/"
            className="font-display text-xl sm:text-2xl tracking-tight text-ink no-underline hover:opacity-70 transition-opacity"
          >
            Atelier
          </Link>
          <nav className="flex items-center gap-6 text-sm uppercase tracking-widest text-stone">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `no-underline hover:text-ink transition-colors ${
                  isActive ? 'text-ink' : ''
                }`
              }
            >
              Lookbooks
            </NavLink>
            <NavLink
              to="/albums"
              className={({ isActive }) =>
                `no-underline hover:text-ink transition-colors ${
                  isActive ? 'text-ink' : ''
                }`
              }
            >
              Albums
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-mist mt-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 text-xs text-stone uppercase tracking-widest">
          Modern style, designed to last — MVP demo. No checkout.
        </div>
      </footer>
    </div>
  );
}
