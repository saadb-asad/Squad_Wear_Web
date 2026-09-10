import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PromoBar } from '../ui/PromoBar';
import { CartDrawer } from '../ui/CartDrawer';
import { useProducts } from '../../contexts/ProductsContext';

export const Layout = () => {
  const { loading, error } = useProducts();

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <PromoBar message="Rs. 250 COD fee — FREE with bank transfer" />
      <Navbar />
      <main style={{ flex: 1, paddingBottom: '4rem' }}>
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="font-ui text-sm text-on-surface-variant">Loading…</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <p className="font-ui text-sm text-on-surface-variant">Couldn't load products.</p>
            <button
              onClick={() => window.location.reload()}
              className="border border-outline px-6 py-3 font-ui text-shout text-xs text-on-surface hover:border-secondary hover:text-secondary transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};
