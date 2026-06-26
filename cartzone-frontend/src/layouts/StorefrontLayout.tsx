import { Outlet } from 'react-router-dom';
import { Header } from '../components/commerce/Header';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-xl font-bold">Cart<span className="text-gold">Zone</span></span>
            <p className="mt-2 text-sm text-[var(--muted)]">Premium shopping experience built on quality and trust.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Shop</h4>
            <div className="flex flex-col gap-2 text-sm text-[var(--muted)]">
              <Link to={ROUTES.PRODUCTS} className="hover:text-[var(--fg)] transition-colors">All Products</Link>
              <Link to={ROUTES.CATEGORIES} className="hover:text-[var(--fg)] transition-colors">Categories</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Account</h4>
            <div className="flex flex-col gap-2 text-sm text-[var(--muted)]">
              <Link to={ROUTES.PROFILE} className="hover:text-[var(--fg)] transition-colors">Profile</Link>
              <Link to={ROUTES.ORDERS} className="hover:text-[var(--fg)] transition-colors">Orders</Link>
              <Link to={ROUTES.WISHLIST} className="hover:text-[var(--fg)] transition-colors">Wishlist</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Help</h4>
            <div className="flex flex-col gap-2 text-sm text-[var(--muted)]">
              <span>support@cartzone.com</span>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} CartZone. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
