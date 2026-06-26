import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { useGetProductQuery } from '../services/cartZoneApi';
import { useGetBasketQuery, useUpsertBasketMutation } from '../services/cartZoneApi';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleWishlist, setBasketKey } from '../store';
import { Button, PageLoader, Badge } from '../components/ui';
import { formatPrice, generateBasketKey } from '../utils';
import { ROUTES } from '../constants';
import { useState } from 'react';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useGetProductQuery(Number(id));
  const dispatch = useAppDispatch();
  const basketKey = useAppSelector(s => s.basket.basketKey);
  const wishlist = useAppSelector(s => s.wishlist.items);
  const isWishlisted = wishlist.some(i => i.id === Number(id));
  const { data: basket } = useGetBasketQuery(basketKey!, { skip: !basketKey });
  const [upsert, { isLoading: adding }] = useUpsertBasketMutation();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  async function addToCart() {
    if (!product) return;
    let key = basketKey;
    if (!key) { key = generateBasketKey(); dispatch(setBasketKey(key)); }
    const items = basket?.items ? [...basket.items] : [];
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      const idx = items.findIndex(i => i.id === product.id);
      items[idx] = { ...existing, quantity: existing.quantity + qty };
    } else {
      items.push({ id: product.id, productName: product.name, pictureUrl: product.pictureUrl, price: product.price, quantity: qty });
    }
    await upsert({ id: key, items });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (isLoading) return <PageLoader />;
  if (isError || !product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="text-[var(--muted)]">Product not found.</p>
      <Link to={ROUTES.PRODUCTS} className="text-gold mt-4 inline-block">← Back to products</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to={ROUTES.PRODUCTS} className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--fg)] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to products
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-sand/30">
          <img
            src={product.pictureUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/e8e0d0/1a1a1a?text=No+Image'; }}
          />
        </div>
        {/* Info */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-2 flex-wrap">
            <Badge>{product.productBrand}</Badge>
            <Badge color="gold">{product.productType}</Badge>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight">{product.name}</h1>
          <p className="font-display text-3xl font-semibold text-gold">{formatPrice(product.price)}</p>
          <p className="text-[var(--muted)] leading-relaxed">{product.description}</p>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-sand/40 dark:hover:bg-white/5 transition-colors text-lg">−</button>
              <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 hover:bg-sand/40 dark:hover:bg-white/5 transition-colors text-lg">+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={addToCart} loading={adding} className={`flex-1 justify-center ${added ? '!bg-emerald' : ''}`}>
              <ShoppingCart className="w-4 h-4" />
              {added ? 'Added to cart!' : 'Add to Cart'}
            </Button>
            <button
              onClick={() => dispatch(toggleWishlist(product))}
              className="p-3 border border-[var(--border)] rounded-lg hover:bg-sand/30 dark:hover:bg-white/5 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-ruby text-ruby' : ''}`} />
            </button>
          </div>

          <Link to={ROUTES.CART} className="text-center text-sm text-gold hover:underline">View Cart →</Link>
        </div>
      </div>
    </div>
  );
}
