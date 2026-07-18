import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { items } = useCart();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: '1rem', zIndex: 50, margin: '1rem', padding: '1rem 2rem' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="heading-3 text-gradient" style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>
            SquadGear
          </Link>
          
          <nav className="flex gap-4" style={{ marginLeft: '2rem' }}>
            <Link to="/catalog" className="text-muted hover:text-primary transition-fast">Catalog</Link>
            <Link to="/about" className="text-muted hover:text-primary transition-fast">B2B / About</Link>
            {user?.role === 'internal_admin' && (
              <Link to="/admin" className="text-muted hover:text-primary transition-fast">Dashboard</Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-muted hover:text-primary transition-fast" aria-label="Search">
            <Search size={20} />
          </button>
          
          <Link to={isAuthenticated ? "/portal" : "/login"} className="text-muted hover:text-primary transition-fast" aria-label="User Portal">
            <User size={20} />
          </Link>
          
          <Link to="/checkout" className="text-muted hover:text-primary transition-fast" style={{ position: 'relative' }} aria-label="Cart">
            <ShoppingBag size={20} />
            {cartItemsCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--color-primary)', color: 'white', fontSize: '0.7rem', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {cartItemsCount}
              </span>
            )}
          </Link>
          
          <button className="text-muted hover:text-primary transition-fast md:hidden" aria-label="Menu">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
