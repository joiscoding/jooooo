import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/albums', label: 'Albums' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-warm-50/90 backdrop-blur-md border-b border-warm-200/60">
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-serif text-xl tracking-wide text-stone-925 hover:opacity-70 transition-opacity"
        >
          ÉDIT
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-xs tracking-[0.2em] uppercase transition-colors duration-200 ${
                location.pathname === to
                  ? 'text-stone-925'
                  : 'text-warm-500 hover:text-stone-925'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-warm-200/60 bg-warm-50 px-6 py-6 space-y-4">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm tracking-[0.15em] uppercase ${
                location.pathname === to ? 'text-stone-925' : 'text-warm-500'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
