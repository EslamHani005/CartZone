// Cart Page
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useGetBasketQuery, useUpsertBasketMutation, useDeleteBasketMutation } from '../services/cartZoneApi';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { clearBasketKey } from '../store';
import { Button, EmptyState, PageLoader } from '../components/ui';
import { formatPrice } from '../utils';
import { ROUTES } from '../constants';

export function CartPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const basketKey = useAppSelector(s => s.basket.basketKey);
  const token = useAppSelector(s => s.auth.token);
  const { data: basket, isLoading } = useGetBasketQuery(basketKey!, { skip: !basketKey });
  const [upsert] = useUpsertBasketMutation();
  const [deleteBasket] = useDeleteBasketMutation();

  if (isLoading) return <PageLoader />;

  async function updateQty(id: number, qty: number) {
    if (!basket) return;
    const items = basket.items.map(i => i.id === id ? { ...i, quantity: qty } : i).filter(i => i.quantity > 0);
    await upsert({ ...basket, items });
  }

  async function removeItem(id: number) {
    if (!basket) return;
    const items = basket.items.filter(i => i.id !== id);
    if (items.length === 0) { await deleteBasket(basket.id); dispatch(clearBasketKey()); }
    else await upsert({ ...basket, items });
  }

  const subtotal = basket?.items.reduce((acc, i) => acc + i.price * i.quantity, 0) || 0;
  const shipping = basket?.shippingPrice || 0;

  if (!basket || basket.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <EmptyState icon={<ShoppingBag />} title="Your cart is empty" description="Browse our catalog and add items to get started."
          action={<Link to={ROUTES.PRODUCTS}><Button>Browse Products</Button></Link>} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {basket.items.map(item => (
            <div key={item.id} className="flex gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
              <img src={item.pictureUrl} alt={item.productName} className="w-20 h-20 object-cover rounded-lg bg-sand/30 flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/e8e0d0/1a1a1a?text=?'; }} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.productName}</p>
                <p className="text-gold font-semibold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden text-sm">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-sand/40 dark:hover:bg-white/5">−</button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-sand/40 dark:hover:bg-white/5">+</button>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="p-2 text-[var(--muted)] hover:text-ruby transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        {/* Summary */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 h-fit">
          <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between"><span className="text-[var(--muted)]">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--muted)]">Shipping</span><span>{shipping > 0 ? formatPrice(shipping) : 'Calculated at checkout'}</span></div>
            <div className="border-t border-[var(--border)] pt-3 flex justify-between font-semibold text-base">
              <span>Total</span><span className="text-gold">{formatPrice(subtotal + shipping)}</span>
            </div>
          </div>
          <Button className="w-full justify-center mt-6" onClick={() => token ? navigate(ROUTES.CHECKOUT) : navigate(ROUTES.LOGIN)}>
            {token ? 'Proceed to Checkout' : 'Sign in to Checkout'} <ArrowRight className="w-4 h-4" />
          </Button>
          <Link to={ROUTES.PRODUCTS} className="block text-center text-sm text-[var(--muted)] hover:text-[var(--fg)] mt-4 transition-colors">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
