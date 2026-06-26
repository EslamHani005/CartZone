import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetBasketQuery, useUpsertBasketMutation, useCreateOrderMutation, useGetDeliveryMethodsQuery, useGetAddressQuery } from '../services/cartZoneApi';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { clearBasketKey } from '../store';
import { Button, Input, PageLoader } from '../components/ui';
import { formatPrice } from '../utils';
import { ROUTES } from '../constants';
import type { AddressDto } from '../types';

const addressSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName:  z.string().min(1, 'Required'),
  street:    z.string().min(1, 'Required'),
  city:      z.string().min(1, 'Required'),
  country:   z.string().min(1, 'Required'),
});

export function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const basketKey = useAppSelector(s => s.basket.basketKey);
  const { data: basket, isLoading: basketLoading } = useGetBasketQuery(basketKey!, { skip: !basketKey });
  const { data: deliveryMethods } = useGetDeliveryMethodsQuery();
  const { data: savedAddress } = useGetAddressQuery();
  const [upsertBasket] = useUpsertBasketMutation();
  const [createOrder, { isLoading: placing }] = useCreateOrderMutation();
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [step, setStep] = useState<'address' | 'delivery' | 'review'>('address');

  const { register, handleSubmit, formState: { errors } } = useForm<AddressDto>({
    resolver: zodResolver(addressSchema),
    values: savedAddress,
  });

  const subtotal = basket?.items.reduce((acc, i) => acc + i.price * i.quantity, 0) || 0;
  const shipping = deliveryMethods?.find(m => m.id === selectedMethod)?.cost || 0;

  async function placeOrder(address: AddressDto) {
    if (!basket || !selectedMethod) return;
    // Update basket with delivery method
    await upsertBasket({ ...basket, deliveryMethodId: selectedMethod, shippingPrice: shipping });
    // Create order
    await createOrder({ basketId: basket.id, deliveryMethodId: selectedMethod, shipToAddress: address }).unwrap();
    dispatch(clearBasketKey());
    navigate(ROUTES.PAYMENT_SUCCESS);
  }

  if (basketLoading) return <PageLoader />;
  if (!basket || basket.items.length === 0) { navigate(ROUTES.CART); return null; }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Steps indicator */}
          <div className="flex items-center gap-4 mb-8 text-sm">
            {(['address', 'delivery', 'review'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === s || (s === 'address' && step !== 'address') || (s === 'delivery' && step === 'review') ? 'bg-gold text-graphite' : 'bg-[var(--border)] text-[var(--muted)]'}`}>{i + 1}</div>
                <span className={step === s ? 'font-medium' : 'text-[var(--muted)] capitalize'}>{s}</span>
                {i < 2 && <div className="w-8 h-px bg-[var(--border)]" />}
              </div>
            ))}
          </div>

          {/* Step 1: Address */}
          {step === 'address' && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-semibold mb-6">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
                <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
                <Input label="Street" className="col-span-2" {...register('street')} error={errors.street?.message} />
                <Input label="City" {...register('city')} error={errors.city?.message} />
                <Input label="Country" {...register('country')} error={errors.country?.message} />
              </div>
              <Button className="mt-6" onClick={handleSubmit(() => setStep('delivery'))}>Continue to Delivery</Button>
            </div>
          )}

          {/* Step 2: Delivery */}
          {step === 'delivery' && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-semibold mb-6">Delivery Method</h2>
              <div className="flex flex-col gap-3">
                {deliveryMethods?.map(m => (
                  <label key={m.id} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${selectedMethod === m.id ? 'border-gold bg-gold/5' : 'border-[var(--border)] hover:border-gold/40'}`}>
                    <input type="radio" name="delivery" checked={selectedMethod === m.id} onChange={() => setSelectedMethod(m.id)} className="accent-gold" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{m.shortName}</p>
                      <p className="text-xs text-[var(--muted)] mt-0.5">{m.description} · {m.deliveryTime}</p>
                    </div>
                    <span className="font-semibold text-sm text-gold">{formatPrice(m.cost)}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" onClick={() => setStep('address')}>Back</Button>
                <Button disabled={!selectedMethod} onClick={() => setStep('review')}>Review Order</Button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-semibold mb-6">Review & Place Order</h2>
              <div className="flex flex-col gap-3 mb-6">
                {basket.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <img src={item.pictureUrl} alt={item.productName} className="w-12 h-12 object-cover rounded-lg bg-sand/30"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/e8e0d0/1a1a1a?text=?'; }} />
                    <span className="flex-1 truncate">{item.productName} × {item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep('delivery')}>Back</Button>
                <Button loading={placing} onClick={handleSubmit(placeOrder)} className="flex-1 justify-center">Place Order · {formatPrice(subtotal + shipping)}</Button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 h-fit">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-[var(--muted)]"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-[var(--muted)]"><span>Shipping</span><span>{selectedMethod ? formatPrice(shipping) : '—'}</span></div>
            <div className="border-t border-[var(--border)] pt-3 flex justify-between font-bold">
              <span>Total</span><span className="text-gold">{formatPrice(subtotal + shipping)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
