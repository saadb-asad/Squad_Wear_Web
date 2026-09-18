import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

import logoUrl from '../../assets/logo.png';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { items, openDrawer } = useCart();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <nav className="w-full sticky top-0 px-4 lg:px-margin-desktop py-4 bg-surface z-50 border-b border-outline">
      <div className="flex justify-between items-center w-full max-w-max-width mx-auto">
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoUrl} alt="Squad Wear Logo" className="h-9 md:h-11 object-contain" />
            <span className="font-display text-shout text-display-md text-on-surface">
              Squad Wear
            </span>
          </Link>
        </div>

        {/* Search Bar - Prominent and Always Visible */}
        <div className="flex-1 mx-8 lg:mx-12">
          <form onSubmit={handleSearch} className="relative">
            <label htmlFor="search-input" className="sr-only">Search products</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search gear..."
              className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline rounded-lg font-ui text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary focus:ring-offset-0"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">
              search
            </span>
            {searchTerm && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant hover:text-secondary"
                onClick={() => setSearchTerm('')}
              >
                close
              </button>
            )}
          </form>
        </div>

        {/* Navigation Menu with Dropdowns */}
        <div className="hidden md:flex items-center gap-6">
          {/* Catalog Link */}
          <Link
            to="/catalog"
            className={`font-ui text-shout text-xs transition-colors duration-200 ${isActive('/catalog') ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}`}
          >
            Shop
          </Link>

          {/* About Link */}
          <Link
            to="/about"
            className={`font-ui text-shout text-xs transition-colors duration-200 ${isActive('/about') ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}`}
          >
            About
          </Link>

          {/* Admin Dashboard Link (conditional) */}
          {user?.role === 'internal_admin' && (
            <Link
              to="/admin"
              className={`font-ui text-shout text-xs transition-colors duration-200 ${isActive('/admin') ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-secondary'}`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Action Icons: Cart and User */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <button onClick={openDrawer} className="relative p-3 flex items-center justify-center" aria-label="Open cart">
            <span className="material-symbols-outlined text-on-surface">shopping_bag</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
          
          {/* User Account */}
          <Link to={isAuthenticated ? "/portal" : "/portal/login"} className="p-3 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface">person</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
