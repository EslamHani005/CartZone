import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Sun, Moon, Menu, X, Search, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout, toggleTheme, setMobileNav } from '../../store';
import { useGetBasketQuery } from '../../services/cartZoneApi';
import { ROUTES } from '../../constants';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token } = useAppSelector(s => s.auth);
  const { theme, mobileNavOpen } = useAppSelector(s => s.ui);
  const basketKey = useAppSelector(s => s.basket.basketKey);
  const wishlistCount = useAppSelector(s => s.wishlist.items.length);
  const { data: basket } = useGetBasketQuery(basketKey!, { skip: !basketKey });
  const cartCount = basket?.items.reduce((acc, i) => acc + i.quantity, 0) || 0;
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) { navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(search)}`); setSearchOpen(false); }
  }

  const navLinks = [
    { to: ROUTES.HOME, label: 'Home' },
    { to: ROUTES.PRODUCTS, label: 'Products' },
    { to: ROUTES.CATEGORIES, label: 'Categories' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight">Cart<span className="text-gold">Zone</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className="text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-lg hover:bg-sand/40 dark:hover:bg-white/5 transition-colors">
              <Search className="w-4 h-4" />
            </button>

            {/* Theme */}
            <button onClick={() => dispatch(toggleTheme())} className="p-2 rounded-lg hover:bg-sand/40 dark:hover:bg-white/5 transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Wishlist */}
            <Link to={ROUTES.WISHLIST} className="relative p-2 rounded-lg hover:bg-sand/40 dark:hover:bg-white/5 transition-colors">
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-ruby text-white text-[10px] rounded-full flex items-center justify-center">{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link to={ROUTES.CART} className="relative p-2 rounded-lg hover:bg-sand/40 dark:hover:bg-white/5 transition-colors">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-white text-[10px] rounded-full flex items-center justify-center">{cartCount}</span>}
            </Link>

            {/* Auth */}
            {token ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-sand/40 dark:hover:bg-white/5 text-sm transition-colors">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{user?.displayName || 'Account'}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to={ROUTES.PROFILE} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-sand/30 dark:hover:bg-white/5 rounded-t-xl">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link to={ROUTES.ORDERS} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-sand/30 dark:hover:bg-white/5">
                    <Package className="w-4 h-4" /> My Orders
                  </Link>
                  <button onClick={() => dispatch(logout())} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-ruby hover:bg-ruby/10 rounded-b-xl">
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link to={ROUTES.LOGIN} className="px-4 py-1.5 bg-graphite text-porcelain dark:bg-porcelain dark:text-graphite text-sm rounded-lg hover:opacity-80 transition-opacity font-medium">
                Sign in
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => dispatch(setMobileNav(!mobileNavOpen))} className="md:hidden p-2 rounded-lg hover:bg-sand/40 dark:hover:bg-white/5">
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <form onSubmit={handleSearch} className="pb-3">
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm outline-none focus:ring-2 focus:ring-gold/40"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.nav initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden overflow-hidden border-t border-[var(--border)]">
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} onClick={() => dispatch(setMobileNav(false))} className="py-2.5 text-sm font-medium hover:text-gold transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
