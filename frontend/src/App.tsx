import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Layout } from './components/layout/Layout';

// Pages
import { HomePage } from './pages/Home/HomePage';
import { CatalogPage } from './pages/Catalog/CatalogPage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';
import { AboutPage } from './pages/About/AboutPage';
import { PortalPage } from './pages/Portal/PortalPage';
import { AdminDashboard } from './pages/Admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="catalog" element={<CatalogPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="portal" element={<PortalPage />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
