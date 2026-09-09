import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PromoBar } from '../ui/PromoBar';
import { CartDrawer } from '../ui/CartDrawer';

export const Layout = () => {
  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <PromoBar message="Rs. 250 COD fee — FREE with bank transfer" />
      <Navbar />
      <main style={{ flex: 1, paddingBottom: '4rem' }}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};
