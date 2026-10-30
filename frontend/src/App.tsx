import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { Layout } from './components/layout/Layout';

// Lazy loaded page components
const HomePage = lazy(() => import('./pages/Home/HomePage').then(m => ({ default: m.HomePage })));
const CatalogPage = lazy(() => import('./pages/Catalog/CatalogPage').then(m => ({ default: m.CatalogPage })));
const ProductPage = lazy(() => import('./pages/Catalog/ProductPage').then(m => ({ default: m.ProductPage })));
const CheckoutPage = lazy(() => import('./pages/Checkout/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const AboutPage = lazy(() => import('./pages/About/AboutPage').then(m => ({ default: m.AboutPage })));
const PortalPage = lazy(() => import('./pages/Portal/PortalPage').then(m => ({ default: m.PortalPage })));
const LoginPage = lazy(() => import('./pages/Portal/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/Portal/SignupPage').then(m => ({ default: m.SignupPage })));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const TermsPage = lazy(() => import('./pages/Legal/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/Legal/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const ReturnsPage = lazy(() => import('./pages/Support/ReturnsPage').then(m => ({ default: m.ReturnsPage })));
const ShippingPage = lazy(() => import('./pages/Support/ShippingPage').then(m => ({ default: m.ShippingPage })));

const PageLoader = () => (
  <div className="flex min-h-[50vh] w-full items-center justify-center py-20">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-on-surface border-t-transparent" />
      <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <ProductsProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="catalog" element={<CatalogPage />} />
                  <Route path="catalog/:id" element={<ProductPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="portal" element={<PortalPage />} />
                  <Route path="portal/login" element={<LoginPage />} />
                  <Route path="portal/signup" element={<SignupPage />} />
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="terms" element={<TermsPage />} />
                  <Route path="privacy" element={<PrivacyPage />} />
                  <Route path="returns" element={<ReturnsPage />} />
                  <Route path="shipping" element={<ShippingPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ProductsProvider>
  );
}

export default App;
