// Orders page
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useGetOrdersQuery } from '../services/cartZoneApi';
import { Badge, EmptyState, PageLoader } from '../components/ui';
import { formatPrice } from '../utils';
import { ROUTES } from '../constants';

export function OrdersPage() {
  const { data: orders, isLoading } = useGetOrdersQuery();
  if (isLoading) return <PageLoader />;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>
      {!orders?.length ? (
        <EmptyState icon={<Package />} title="No orders yet" description="Your orders will appear here once you complete a purchase."
          action={<Link to={ROUTES.PRODUCTS}><button className="px-6 py-2.5 bg-graphite text-porcelain rounded-lg text-sm font-medium">Start Shopping</button></Link>} />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(order => (
            <Link key={order.id} to={ROUTES.ORDER(order.id)} className="block p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-gold/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-[var(--muted)] mt-1">{new Date(order.orderDate).toLocaleDateString()}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{order.items.length} item(s) · {order.deliveryMethod}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <Badge color={order.status === 'PaymentReceived' ? 'emerald' : order.status === 'Pending' ? 'amber' : 'default'}>{order.status}</Badge>
                  <p className="font-display font-semibold text-gold">{formatPrice(order.total)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Order Detail
import { useParams } from 'react-router-dom';
import { useGetOrderQuery } from '../services/cartZoneApi';
import { ArrowLeft } from 'lucide-react';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useGetOrderQuery(Number(id));
  if (isLoading) return <PageLoader />;
  if (!order) return <div className="text-center py-20 text-[var(--muted)]">Order not found.</div>;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to={ROUTES.ORDERS} className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--fg)] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </Link>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Order #{order.id}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{new Date(order.orderDate).toLocaleString()}</p>
        </div>
        <Badge color={order.status === 'PaymentReceived' ? 'emerald' : 'amber'}>{order.status}</Badge>
      </div>
      <div className="flex flex-col gap-4 mb-8">
        {order.items.map(item => (
          <div key={item.productId} className="flex gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
            <img src={item.pictureUrl} alt={item.productName} className="w-16 h-16 object-cover rounded-lg bg-sand/30 flex-shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/e8e0d0/1a1a1a?text=?'; }} />
            <div className="flex-1">
              <p className="font-medium text-sm">{item.productName}</p>
              <p className="text-xs text-[var(--muted)] mt-1">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 flex flex-col gap-3 text-sm">
        <h3 className="font-semibold mb-2">Summary</h3>
        <div className="flex justify-between text-[var(--muted)]"><span>Subtotal</span><span>{formatPrice(order.subTotal)}</span></div>
        <div className="flex justify-between text-[var(--muted)]"><span>Shipping ({order.deliveryMethod})</span><span>{formatPrice(order.total - order.subTotal)}</span></div>
        <div className="flex justify-between font-bold text-base border-t border-[var(--border)] pt-3"><span>Total</span><span className="text-gold">{formatPrice(order.total)}</span></div>
      </div>
    </div>
  );
}
