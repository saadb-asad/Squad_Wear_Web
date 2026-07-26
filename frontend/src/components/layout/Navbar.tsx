import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { items } = useCart();
  const location = useLocation();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full sticky top-0 px-4 lg:px-margin-desktop py-4 bg-surface z-50 shadow-[-8px_-8px_16px_#ffffff,8px_8px_16px_#d1d9e6]">
      <div className="flex justify-between items-center w-full max-w-max-width mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Squad Wear Logo" className="h-8 md:h-10 object-contain" />
          <span className="font-headline-lg text-headline-md md:text-headline-lg font-extrabold text-on-surface tracking-tighter hidden sm:block">
            Squad Wear
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/catalog" 
            className={`font-label-md text-label-md transition-colors duration-300 ${isActive('/catalog') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant font-medium hover:text-secondary'}`}
          >
            Shop
          </Link>
          <Link 
            to="/about" 
            className={`font-label-md text-label-md transition-colors duration-300 ${isActive('/about') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant font-medium hover:text-secondary'}`}
          >
            About
          </Link>
          {user?.role === 'internal_admin' && (
            <Link 
              to="/admin" 
              className={`font-label-md text-label-md transition-colors duration-300 ${isActive('/admin') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-on-surface-variant font-medium hover:text-secondary'}`}
            >
              Dashboard
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="neo-recessed flex items-center px-4 py-2 rounded-full hidden lg:flex">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-32 font-label-md outline-none" placeholder="Search gear..." type="text"/>
          </div>
          <Link to="/checkout" className="neo-extruded-sm neo-interactive p-3 rounded-full flex items-center justify-center relative">
            <span className="material-symbols-outlined text-primary">shopping_bag</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <Link to={isAuthenticated ? "/portal" : "/portal/login"} className="neo-extruded-sm neo-interactive p-3 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">person</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
