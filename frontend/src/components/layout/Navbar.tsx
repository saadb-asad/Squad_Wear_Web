import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

import logoUrl from '../../assets/logo.png';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { items, openDrawer } = useCart();
  const location = useLocation();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full sticky top-0 px-4 lg:px-margin-desktop py-4 bg-surface z-50 border-b border-outline">
      <div className="flex justify-between items-center w-full max-w-max-width mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoUrl} alt="Squad Wear Logo" className="h-8 md:h-10 object-contain invert" />
          <span className="font-display text-shout text-display-md hidden text-on-surface sm:block">
            Squad Wear
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/catalog"
            className={`font-ui text-shout text-xs transition-colors duration-300 ${isActive('/catalog') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant font-medium hover:text-secondary'}`}
          >
            Shop
          </Link>
          <Link
            to="/about"
            className={`font-ui text-shout text-xs transition-colors duration-300 ${isActive('/about') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant font-medium hover:text-secondary'}`}
          >
            About
          </Link>
          {user?.role === 'internal_admin' && (
            <Link
              to="/admin"
              className={`font-ui text-shout text-xs transition-colors duration-300 ${isActive('/admin') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant font-medium hover:text-secondary'}`}
            >
              Dashboard
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="border border-outline flex items-center px-4 py-2 hidden lg:flex">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-32 font-ui outline-none" placeholder="Search gear..." type="text"/>
          </div>
          <button onClick={openDrawer} className="border border-outline p-3 flex items-center justify-center relative" aria-label="Open cart">
            <span className="material-symbols-outlined text-on-surface">shopping_bag</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
          <Link to={isAuthenticated ? "/portal" : "/portal/login"} className="border border-outline p-3 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface">person</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
