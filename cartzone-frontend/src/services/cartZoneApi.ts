import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import type {
  PaginatedResult, ProductDto, BrandDto, TypeDto,
  BasketDto, LoginDto, RegisterDto, UserDto,
  AddressDto, DeliveryMethodDto, OrderToReturnDto, OrderDto, ProductQueryParams,
} from '../types';

export const cartZoneApi = createApi({
  reducerPath: 'cartZoneApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Basket', 'Orders', 'Address', 'User'],
  endpoints: (build) => ({
    // Products
    getProducts: build.query<PaginatedResult<ProductDto>, ProductQueryParams>({
      query: (params = {}) => ({ url: '/Products', params }),
    }),
    getProduct: build.query<ProductDto, number>({
      query: (id) => `/Products/${id}`,
    }),
    getBrands: build.query<BrandDto[], void>({
      query: () => '/Products/brands',
    }),
    getTypes: build.query<TypeDto[], void>({
      query: () => '/Products/types',
    }),

    // Basket
    getBasket: build.query<BasketDto, string>({
      query: (key) => ({ url: '/Basket', params: { key } }),
      providesTags: ['Basket'],
    }),
    upsertBasket: build.mutation<BasketDto, BasketDto>({
      query: (basket) => ({ url: '/Basket', method: 'POST', body: basket }),
      invalidatesTags: ['Basket'],
    }),
    deleteBasket: build.mutation<boolean, string>({
      query: (key) => ({ url: '/Basket', method: 'DELETE', params: { key } }),
      invalidatesTags: ['Basket'],
    }),

    // Auth
    login: build.mutation<UserDto, LoginDto>({
      query: (body) => ({ url: '/Authentication/Login', method: 'POST', body }),
    }),
    register: build.mutation<UserDto, RegisterDto>({
      query: (body) => ({ url: '/Authentication/Register', method: 'POST', body }),
    }),
    getCurrentUser: build.query<UserDto, void>({
      query: () => '/Authentication/CurrentUser',
      providesTags: ['User'],
    }),
    getAddress: build.query<AddressDto, void>({
      query: () => '/Authentication/Address',
      providesTags: ['Address'],
    }),
    updateAddress: build.mutation<AddressDto, AddressDto>({
      query: (body) => ({ url: '/Authentication/Address', method: 'PUT', body }),
      invalidatesTags: ['Address'],
    }),

    // Orders
    getDeliveryMethods: build.query<DeliveryMethodDto[], void>({
      query: () => '/Order/DeliveryMethods',
    }),
    createOrder: build.mutation<OrderToReturnDto, OrderDto>({
      query: (body) => ({ url: '/Order', method: 'POST', body }),
      invalidatesTags: ['Orders'],
    }),
    getOrders: build.query<OrderToReturnDto[], void>({
      query: () => '/Order',
      providesTags: ['Orders'],
    }),
    getOrder: build.query<OrderToReturnDto, number>({
      query: (id) => `/Order/${id}`,
    }),

    // Payments
    createPaymentIntent: build.mutation<BasketDto, string>({
      query: (basketId) => ({ url: `/Payments/${basketId}`, method: 'POST' }),
      invalidatesTags: ['Basket'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetBrandsQuery,
  useGetTypesQuery,
  useGetBasketQuery,
  useUpsertBasketMutation,
  useDeleteBasketMutation,
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useGetAddressQuery,
  useUpdateAddressMutation,
  useGetDeliveryMethodsQuery,
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreatePaymentIntentMutation,
} = cartZoneApi;
