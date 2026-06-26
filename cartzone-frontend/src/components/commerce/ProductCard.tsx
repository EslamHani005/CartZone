import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ProductDto } from '../../types';
import { formatPrice, generateBasketKey } from '../../utils';
import { ROUTES } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleWishlist, setBasketKey } from '../../store';
import { useUpsertBasketMutation, useGetBasketQuery } from '../../services/cartZoneApi';
import { Skeleton } from '../ui';
import { useState } from 'react';

export function ProductCard({ product }: { product: ProductDto }) {
  const dispatch = useAppDispatch();
  const basketKey = useAppSelector(s => s.basket.basketKey);
  const wishlist = useAppSelector(s => s.wishlist.items);
  const isWishlisted = wishlist.some(i => i.id === product.id);
  const { data: basket } = useGetBasketQuery(basketKey!, { skip: !basketKey });
  const [upsert, { isLoading }] = useUpsertBasketMutation();
  const [added, setAdded] = useState(false);

  async function addToCart() {
    let key = basketKey;
    if (!key) {
      key = generateBasketKey();
      dispatch(setBasketKey(key));
    }
    const existing = basket?.items.find(i => i.id === product.id);
    const items = basket?.items ? [...basket.items] : [];
    if (existing) {
      const idx = items.findIndex(i => i.id === product.id);
      items[idx] = { ...existing, quantity: existing.quantity + 1 };
    } else {
      items.push({ id: product.id, productName: product.name, pictureUrl: product.pictureUrl, price: product.price, quantity: 1 });
    }
    await upsert({ id: key, items });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col"
    >
      <Link to={ROUTES.PRODUCT(product.id)} className="relative block aspect-square overflow-hidden bg-sand/30">
        <img
          src={product.pictureUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/e8e0d0/1a1a1a?text=No+Image'; }}
        />
        <button
          onClick={(e) => { e.preventDefault(); dispatch(toggleWishlist(product)); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-graphite/80 backdrop-blur-sm transition-transform hover:scale-110"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-ruby text-ruby' : 'text-graphite dark:text-porcelain'}`} />
        </button>
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex gap-1.5">
          <span className="text-xs text-[var(--muted)] border border-[var(--border)] rounded px-2 py-0.5">{product.productBrand}</span>
          <span className="text-xs text-[var(--muted)] border border-[var(--border)] rounded px-2 py-0.5">{product.productType}</span>
        </div>
        <Link to={ROUTES.PRODUCT(product.id)}>
          <h3 className="font-medium text-sm leading-snug line-clamp-2 hover:text-gold transition-colors">{product.name}</h3>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display font-semibold text-gold">{formatPrice(product.price)}</span>
          <button
            onClick={addToCart}
            disabled={isLoading}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              added
                ? 'bg-emerald text-white'
                : 'bg-graphite text-porcelain dark:bg-porcelain dark:text-graphite hover:opacity-80'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {added ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <Skeleton className="aspect-square rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
      </div>
    </div>
  );
}
