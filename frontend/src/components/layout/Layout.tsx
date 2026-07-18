import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout = () => {
  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, paddingBottom: '4rem' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
