import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { cartZoneApi } from '../services/cartZoneApi';
import type { UserDto, ProductDto } from '../types';
import { STORAGE_KEYS } from '../constants';

// Auth slice
interface AuthState { user: UserDto | null; token: string | null; status: 'idle'|'loading'|'authenticated'|'anonymous'; }
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem(STORAGE_KEYS.TOKEN), status: 'idle' } as AuthState,
  reducers: {
    setCredentials(state, action: PayloadAction<UserDto>) {
      state.user = action.payload; state.token = action.payload.token; state.status = 'authenticated';
      localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
    },
    logout(state) {
      state.user = null; state.token = null; state.status = 'anonymous';
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    },
  },
});

// Basket slice
interface BasketState { basketKey: string | null; }
const basketSlice = createSlice({
  name: 'basket',
  initialState: { basketKey: localStorage.getItem(STORAGE_KEYS.BASKET_KEY) } as BasketState,
  reducers: {
    setBasketKey(state, action: PayloadAction<string>) {
      state.basketKey = action.payload; localStorage.setItem(STORAGE_KEYS.BASKET_KEY, action.payload);
    },
    clearBasketKey(state) { state.basketKey = null; localStorage.removeItem(STORAGE_KEYS.BASKET_KEY); },
  },
});

// UI slice
interface UIState { theme: 'light'|'dark'; mobileNavOpen: boolean; }
const uiSlice = createSlice({
  name: 'ui',
  initialState: { theme: (localStorage.getItem(STORAGE_KEYS.THEME) as 'light'|'dark') || 'light', mobileNavOpen: false } as UIState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    },
    setMobileNav(state, action: PayloadAction<boolean>) { state.mobileNavOpen = action.payload; },
  },
});

// Wishlist slice
interface WishlistState { items: ProductDto[]; }
const savedWishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]');
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: savedWishlist } as WishlistState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<ProductDto>) {
      const idx = state.items.findIndex(i => i.id === action.payload.id);
      if (idx >= 0) state.items.splice(idx, 1); else state.items.push(action.payload);
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(state.items));
    },
  },
});

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer, basket: basketSlice.reducer, ui: uiSlice.reducer,
    wishlist: wishlistSlice.reducer, [cartZoneApi.reducerPath]: cartZoneApi.reducer,
  },
  middleware: (gDM) => gDM().concat(cartZoneApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const { setCredentials, logout } = authSlice.actions;
export const { setBasketKey, clearBasketKey } = basketSlice.actions;
export const { toggleTheme, setMobileNav } = uiSlice.actions;
export const { toggleWishlist } = wishlistSlice.actions;
