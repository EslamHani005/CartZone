import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { StorefrontLayout } from '../layouts/StorefrontLayout';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { LoginPage, RegisterPage } from '../pages/AuthPages';
import { OrdersPage, OrderDetailPage } from '../pages/OrderPages';
import {
  CategoriesPage, WishlistPage, SearchResultsPage,
  ProfilePage, PaymentSuccessPage, PaymentFailedPage, NotFoundPage
} from '../pages/OtherPages';
import { CheckoutPage } from '../pages/CheckoutPage';
import { useEffect } from 'react';
import { useAppSelector } from '../hooks/redux';

function ThemeSync() {
  const theme = useAppSelector(s => s.ui.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return null;
}

function AppInner() {
  return (
    <>
      <ThemeSync />
      <BrowserRouter>
        <Routes>
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/failed" element={<PaymentFailedPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}
