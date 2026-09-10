import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PromoBar } from '../ui/PromoBar';
import { CartDrawer } from '../ui/CartDrawer';
import { useProducts } from '../../contexts/ProductsContext';

// Routes that actually render product data and therefore need to be gated
// on the products fetch (loading / error / empty-result states). Every
// other route (auth, admin, static/legal pages, etc.) should render
// immediately regardless of the catalog's fetch state.
const routeNeedsProductData = (pathname: string): boolean => {
  return (
    pathname === '/' ||
    pathname === '/catalog' ||
    pathname.startsWith('/catalog/') ||
    pathname === '/checkout'
  );
};

export const Layout = () => {
  const { loading, error, products } = useProducts();
  const { pathname } = useLocation();
  const needsProductData = routeNeedsProductData(pathname);

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <PromoBar message="Rs. 250 COD fee — FREE with bank transfer" />
      <Navbar />
      <main style={{ flex: 1, paddingBottom: '4rem' }}>
        {needsProductData && loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="font-ui text-sm text-on-surface-variant">Loading…</p>
          </div>
        ) : needsProductData && (error || products.length === 0) ? (
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
