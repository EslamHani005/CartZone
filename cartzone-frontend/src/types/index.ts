export interface PaginatedResult<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export interface ProductDto {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  price: number;
  productBrand: string;
  productType: string;
}

export interface BrandDto { id: number; name: string; }
export interface TypeDto  { id: number; name: string; }

export interface BasketItemDto {
  id: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface BasketDto {
  id: string;
  items: BasketItemDto[];
  clientSecret?: string | null;
  paymentIntentId?: string | null;
  deliveryMethodId?: number | null;
  shippingPrice?: number | null;
}

export interface LoginDto { email: string; password: string; }

export interface RegisterDto {
  email: string;
  password: string;
  userName?: string;
  displayName: string;
  phoneNumber?: string;
}

export interface UserDto {
  email: string;
  token: string;
  displayName: string;
}

export interface AddressDto {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  country: string;
}

export interface DeliveryMethodDto {
  id: number;
  shortName: string;
  description: string;
  deliveryTime: string;
  cost: number;
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface OrderToReturnDto {
  id: number;
  buyerEmail: string;
  orderDate: string;
  shipToAddress: AddressDto;
  deliveryMethod: string;
  items: OrderItemDto[];
  status: string;
  subTotal: number;
  total: number;
}

export interface OrderDto {
  basketId: string;
  deliveryMethodId: number;
  shipToAddress: AddressDto;
}

export interface ErrorToReturn {
  statusCode: number;
  errorMessage?: string;
  errors?: string[];
}

export interface ProductQueryParams {
  brandId?: number;
  typeId?: number;
  sort?: number;
  search?: string;
  pageIndex?: number;
  pageSize?: number;
}
