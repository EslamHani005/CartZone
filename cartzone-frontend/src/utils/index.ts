import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(price);
}

export function generateBasketKey() {
  return 'basket_' + Math.random().toString(36).slice(2, 11);
}

export function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'data' in err) {
    const data = (err as { data: { errorMessage?: string } }).data;
    return data?.errorMessage || 'Something went wrong';
  }
  return 'Something went wrong';
}
