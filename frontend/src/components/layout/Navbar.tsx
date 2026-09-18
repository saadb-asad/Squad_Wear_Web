import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

import logoUrl from '../../assets/logo.png';

const CATEGORIES = [
  { name: 'Full Track Suits', path: '/catalog?category=Full%20Track%20Suits' },
  { name: 'Hoodies', path: '/catalog?category=Hoodies' },
  { name: 'Trousers', path: '/catalog?category=Trousers' },
];

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { items, openDrawer } = useCart();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="w-full sticky top-0 bg-surface z-50 border-b border-outline">
      <nav className="w-full max-w-max-width mx-auto px-4 lg:px- margin-desktop py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-on-surface hover:text-secondary focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        </button>

        {/* Logo and Brand Name */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logoUrl} alt="Squad Wear Logo" className="h-8 md:h-10 object-contain transition-transform duration-300 group-hover:scale-105" />
            <span className="font-heading font-black tracking-tighter text-lg md:text-xl uppercase text-on-surface">
              Squad Wear
            </span>
          </Link>
        </div>

        {/* Desktop Category Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={cat.path}
              className={`font-heading text-xs uppercase tracking-widest transition-colors duration-200 py-1 ${
                location.search.includes(encodeURIComponent(cat.name))
                  ? 'text-on-surface font-semibold border-b-2 border-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to="/catalog"
            className="font-heading text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors py-1"
          >
            Shop All
          </Link>
        </div>

        {/* Search & Icons */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Compact Search Bar */}
          <form onSubmit={handleSearch} className="relative hidden sm:block w-44 md:w-56">
            <label htmlFor="search-input" className="sr-only">Search products</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search apparel..."
              className="w-full pl-8 pr-3 py-1.5 bg-surface-container-low border border-outline rounded-none font-sans text-xs focus:outline-none focus:border-on-surface"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-on-surface-variant">
              search
            </span>
          </form>

          {/* User Account */}
          <Link
            to={isAuthenticated ? "/portal" : "/portal/login"}
            className="p-2 text-on-surface hover:text-secondary transition-colors"
            aria-label="Account"
          >
            <span className="material-symbols-outlined text-[22px]">person</span>
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={openDrawer}
            className="relative p-2 flex items-center justify-center text-on-surface hover:text-secondary transition-colors"
            aria-label="Open cart"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-on-surface text-surface text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-outline bg-surface px-6 py-4 space-y-4">
          <form onSubmit={handleSearch} className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Search apparel..."
              className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline font-sans text-xs"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant">
              search
            </span>
          </form>
          <div className="flex flex-col space-y-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={cat.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-heading text-xs uppercase tracking-widest text-on-surface py-1 hover:text-secondary"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-heading text-xs uppercase tracking-widest text-on-surface py-1 hover:text-secondary"
            >
              Shop All
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-heading text-xs uppercase tracking-widest text-on-surface-variant py-1 hover:text-secondary"
            >
              About
            </Link>
            {user?.role === 'internal_admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-heading text-xs uppercase tracking-widest text-secondary py-1 font-bold"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

