export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface State {
  id: string;
  name: string;
}

export interface Market {
  id: string;
  name: string;
  description?: string;
  url?: string;
  state?: State;
  stores?: Store[];
}
export interface Category {
  id: string;
  name: string;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  ownerId?: string;
  marketId?: string;
  openDays?: string[];
  openingTime?: string;
  closingTime?: string;
  user?: User;
  categories?: Category[];
  market?: Market;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: string;
    imageUrl?: string;
    storeId?: string
    store?: Store;
    isAvailable: boolean;
    categoryId: string;
    category?: Category;
}
