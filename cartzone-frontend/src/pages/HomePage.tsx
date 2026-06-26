import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Truck } from 'lucide-react';
import { ROUTES } from '../constants';
import { useGetProductsQuery, useGetTypesQuery } from '../services/cartZoneApi';
import { ProductCard, ProductCardSkeleton } from '../components/commerce/ProductCard';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

export function HomePage() {
  const { data: featured, isLoading } = useGetProductsQuery({ pageSize: 8 });
  const { data: types } = useGetTypesQuery();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-graphite dark:bg-[#0d0d0c] text-porcelain">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-gold blur-2xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 relative">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-2xl">
            <motion.p variants={fadeUp} className="text-gold text-sm font-medium tracking-widest uppercase mb-4">Premium Shopping</motion.p>
            <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Discover products worth loving
            </motion.h1>
            <motion.p variants={fadeUp} className="text-porcelain/70 text-lg mb-10 max-w-lg">
              Curated selection of quality products, delivered with care. Browse our catalog and find exactly what you need.
            </motion.p>
            <motion.div variants={fadeUp} className="flex gap-4 flex-wrap">
              <Link to={ROUTES.PRODUCTS} className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-graphite font-semibold rounded-xl hover:bg-gold/90 transition-colors">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to={ROUTES.CATEGORIES} className="inline-flex items-center gap-2 px-8 py-3.5 border border-porcelain/30 text-porcelain rounded-xl hover:bg-white/5 transition-colors">
                Browse Categories
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Truck className="w-5 h-5" />, title: 'Fast Delivery', desc: 'Multiple shipping options' },
              { icon: <Star className="w-5 h-5" />, title: 'Quality Assured', desc: 'Curated product catalog' },
              { icon: <ShoppingBag className="w-5 h-5" />, title: 'Easy Returns', desc: 'Hassle-free policy' },
            ].map(b => (
              <div key={b.title} className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gold/10 text-gold">{b.icon}</div>
                <div>
                  <p className="font-semibold text-sm">{b.title}</p>
                  <p className="text-xs text-[var(--muted)]">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {types && types.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-gold text-xs font-medium tracking-widest uppercase mb-1">Browse</p>
              <h2 className="font-display text-3xl font-bold">Shop by Category</h2>
            </div>
            <Link to={ROUTES.CATEGORIES} className="text-sm text-[var(--muted)] hover:text-[var(--fg)] flex items-center gap-1 transition-colors">
              All categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {types.slice(0, 8).map(t => (
              <Link
                key={t.id}
                to={`${ROUTES.PRODUCTS}?typeId=${t.id}`}
                className="group p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-gold/40 hover:bg-gold/5 transition-all text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-sand/50 dark:bg-graphite/50 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="font-medium text-sm">{t.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-gold text-xs font-medium tracking-widest uppercase mb-1">Hand-picked</p>
            <h2 className="font-display text-3xl font-bold">Featured Products</h2>
          </div>
          <Link to={ROUTES.PRODUCTS} className="text-sm text-[var(--muted)] hover:text-[var(--fg)] flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <motion.div key={i} variants={fadeUp}><ProductCardSkeleton /></motion.div>)
            : featured?.data.map(p => <motion.div key={p.id} variants={fadeUp}><ProductCard product={p} /></motion.div>)
          }
        </motion.div>
      </section>
    </div>
  );
}
