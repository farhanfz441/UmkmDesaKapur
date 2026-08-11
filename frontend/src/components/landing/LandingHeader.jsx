import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Daftar UMKM', href: '/umkm' },
  { label: 'Peta UMKM', href: '/peta' },
];

export default function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, username } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHome ? 'bg-white shadow-soft' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            <span className={`font-display font-bold tracking-tight text-base ${scrolled || !isHome ? 'text-navy' : 'text-white'}`}>
              UMKM Digital <span className="hidden sm:inline">Desa Kapur</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    active
                      ? scrolled || !isHome ? 'bg-navy/10 text-navy' : 'bg-white/15 text-white'
                      : scrolled || !isHome ? 'text-secondary hover:text-navy hover:bg-surface-hover' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/admin/dashboard"
                className={`hidden md:inline-flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 transition-all duration-200 ${
                  scrolled || !isHome ? 'bg-navy/10 text-navy hover:bg-navy/20' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/15'
                }`}>
                <div className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center text-[10px] font-bold">
                  {username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className={`hidden lg:inline ${scrolled || !isHome ? '' : 'text-white'}`}>{username}</span>
              </Link>
            ) : (
              <Link to="/admin/login"
                className={`hidden md:inline-flex text-sm font-medium rounded-lg px-4 py-2 transition-all duration-200 ${
                  scrolled || !isHome
                    ? 'bg-navy text-white hover:bg-navy-light'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/15'
                }`}>
                Login Admin
              </Link>
            )}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${scrolled || !isHome ? 'text-navy hover:bg-surface-hover' : 'text-white hover:bg-white/10'}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Buka menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-5 py-4 flex flex-col gap-2 shadow-elevated">
          {NAV_LINKS.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link key={item.label} to={item.href} onClick={() => setMenuOpen(false)}
                className={`py-2 text-sm font-medium ${active ? 'text-navy' : 'text-secondary hover:text-navy'}`}>
                {item.label}
              </Link>
            );
          })}
          <hr className="my-2 border-border" />
          {isAuthenticated ? (
            <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="btn-primary text-center text-sm items-center justify-center flex gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[9px] font-bold">
                {username?.charAt(0).toUpperCase() || 'A'}
              </div>
              Dashboard
            </Link>
          ) : (
            <Link to="/admin/login" onClick={() => setMenuOpen(false)} className="btn-primary text-center text-sm">
              Login Admin
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
