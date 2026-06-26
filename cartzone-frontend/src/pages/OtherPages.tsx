import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, CheckCircle, XCircle } from 'lucide-react';
import { useGetTypesQuery, useGetBrandsQuery, useGetProductsQuery, useGetAddressQuery, useUpdateAddressMutation } from '../services/cartZoneApi';
import { useAppSelector } from '../hooks/redux';

import { ProductCard, ProductCardSkeleton } from '../components/commerce/ProductCard';
import { Button, EmptyState, PageLoader, Input } from '../components/ui';
import { ROUTES } from '../constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AddressDto } from '../types';
import { useState } from 'react';

// Categories Page
export function CategoriesPage() {
  const { data: types, isLoading } = useGetTypesQuery();
  const { data: brands } = useGetBrandsQuery();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold mb-2">Categories</h1>
      <p className="text-[var(--muted)] text-sm mb-10">Browse by product type or brand</p>
      {isLoading ? <PageLoader /> : (
        <>
          <h2 className="font-semibold mb-4 text-sm uppercase tracking-wide text-[var(--muted)]">By Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
            {types?.map(t => (
              <Link key={t.id} to={`${ROUTES.PRODUCTS}?typeId=${t.id}`}
                className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-gold/40 hover:bg-gold/5 transition-all text-center group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-sand/40 dark:bg-graphite/40 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="font-medium text-sm">{t.name}</p>
              </Link>
            ))}
          </div>
          <h2 className="font-semibold mb-4 text-sm uppercase tracking-wide text-[var(--muted)]">By Brand</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {brands?.map(b => (
              <Link key={b.id} to={`${ROUTES.PRODUCTS}?brandId=${b.id}`}
                className="p-5 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-gold/40 hover:bg-gold/5 transition-all text-center">
                <p className="font-medium text-sm">{b.name}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Wishlist Page
export function WishlistPage() {
  
  const items = useAppSelector(s => s.wishlist.items);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Wishlist</h1>
      {items.length === 0 ? (
        <EmptyState icon={<Heart />} title="Your wishlist is empty" description="Save items you love by clicking the heart icon on any product."
          action={<Link to={ROUTES.PRODUCTS}><Button>Browse Products</Button></Link>} />
      ) : (
        <>
          <p className="text-[var(--muted)] text-sm mb-6">{items.length} saved item(s)</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}

// Search Results Page
export function SearchResultsPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { data, isLoading } = useGetProductsQuery({ search: q, pageSize: 10 }, { skip: !q });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold mb-2">Search Results</h1>
      {q && <p className="text-[var(--muted)] text-sm mb-8">Showing results for "<span className="text-[var(--fg)] font-medium">{q}</span>" — {data?.count || 0} found</p>}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>
      ) : data?.data.length === 0 ? (
        <EmptyState title={`No results for "${q}"`} description="Try a different keyword or browse all products."
          action={<Link to={ROUTES.PRODUCTS}><Button>Browse All</Button></Link>} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{data?.data.map(p => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}

// Profile Page
const addressSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  street: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
});

export function ProfilePage() {
  const user = useAppSelector(s => s.auth.user);
  const { data: address, isLoading } = useGetAddressQuery();
  const [updateAddress, { isLoading: saving }] = useUpdateAddressMutation();
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<AddressDto>({
    resolver: zodResolver(addressSchema),
    values: address,
  });

  async function onSubmit(data: AddressDto) {
    await updateAddress(data).unwrap();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (isLoading) return <PageLoader />;
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4">Account</h2>
        <p className="text-sm"><span className="text-[var(--muted)]">Name: </span>{user?.displayName}</p>
        <p className="text-sm mt-2"><span className="text-[var(--muted)]">Email: </span>{user?.email}</p>
      </div>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-semibold mb-6">Shipping Address</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
          <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
          <Input label="Street" className="col-span-2" {...register('street')} error={errors.street?.message} />
          <Input label="City" {...register('city')} error={errors.city?.message} />
          <Input label="Country" {...register('country')} error={errors.country?.message} />
          <div className="col-span-2">
            <Button type="submit" loading={saving} className={saved ? '!bg-emerald' : ''}>{saved ? 'Saved!' : 'Save Address'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Payment pages
export function PaymentSuccessPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="w-20 h-20 text-emerald mx-auto mb-6" />
        <h1 className="font-display text-3xl font-bold mb-3">Order Confirmed!</h1>
        <p className="text-[var(--muted)] mb-8">Your payment was successful. We'll get your order ready shortly.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate(ROUTES.ORDERS)}>View Orders</Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.HOME)}>Continue Shopping</Button>
        </div>
      </div>
    </div>
  );
}

export function PaymentFailedPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <XCircle className="w-20 h-20 text-ruby mx-auto mb-6" />
        <h1 className="font-display text-3xl font-bold mb-3">Payment Failed</h1>
        <p className="text-[var(--muted)] mb-8">Something went wrong with your payment. Your cart is still saved — please try again.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate(ROUTES.CHECKOUT)}>Try Again</Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.CART)}>Back to Cart</Button>
        </div>
      </div>
    </div>
  );
}

// Not Found
export function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display text-9xl font-bold text-gold/20">404</p>
        <h1 className="font-display text-3xl font-bold -mt-4 mb-3">Page not found</h1>
        <p className="text-[var(--muted)] mb-8">The page you're looking for doesn't exist or has moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to={ROUTES.HOME}><Button>Go Home</Button></Link>
          <Link to={ROUTES.PRODUCTS}><Button variant="secondary">Browse Products</Button></Link>
        </div>
      </div>
    </div>
  );
}
