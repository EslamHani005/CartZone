export const API_BASE_URL = 'http://localhost:7005/api';

export const STORAGE_KEYS = {
  TOKEN: 'cz_token',
  BASKET_KEY: 'cz_basket_key',
  THEME: 'cz_theme',
  WISHLIST: 'cz_wishlist',
} as const;

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT: (id: number | string) => `/products/${id}`,
  CATEGORIES: '/categories',
  SEARCH: '/search',
  CART: '/cart',
  WISHLIST: '/wishlist',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER: (id: number | string) => `/orders/${id}`,
  CHECKOUT: '/checkout',
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_FAILED: '/payment/failed',
} as const;

export const SORT_OPTIONS = [
  { label: 'Name A–Z',       value: 1 },
  { label: 'Name Z–A',       value: 2 },
  { label: 'Price: Low–High',value: 3 },
  { label: 'Price: High–Low',value: 4 },
] as const;
