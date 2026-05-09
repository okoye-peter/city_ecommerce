export type IdType = 'national_id' | 'passport' | 'drivers_license';

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    nextPage: number | null;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type OrderGroupStatus =
    | 'PENDING'
    | 'PAYMENT_CONFIRMED'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';

export type TransactionType = 'credit' | 'debit';

export interface Bank {
  id: bigint;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface Market {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
}

// Simplified product reference used within order data
export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  status: OrderStatus;
  imageUrl?: string;
}

export interface OrderGroup {
    id: string;
    refNo: string;
    status: OrderGroupStatus;
    buyerId: string;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
    orders?: Order[];
}

export interface Order {
  id: string;
  orderGroupId: bigint;
  productId: bigint;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  deliveredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  product?: OrderProduct;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  createdAt: string;
}

// Auth types
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: 'BUYER' | 'SELLER';
  verificationType?: 'NATIONAL_ID' | 'DRIVERS_LICENSE' | 'INTERNATIONAL_PASSPORT';
  verificationId?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
}

export interface Store {
  id: number;
  name: string;
  imageUrl: string | null;
  description: string | null;
  marketId: number | null;
  openDays: string[];
  openingTime: string | null;
  closingTime: string | null;
}

export interface AuthResponse extends AuthTokens {
    user: User;
    store: Store | null;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    role: 'SELLER';
}

export type RegisterResponse = ApiResponse<{ email: string; message: string }>;

export interface SignInPayload {
    email: string;
    password: string;
}

// Product types
export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    storeId: string;
    isAvailable: boolean;
    categoryId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    order?: 'asc' | 'desc';
    storeId?: string;
}

export interface ProductsResponse {
    data: Product[];
    meta: PaginationMeta;
    message: string;
    success: boolean;
}

export interface StoreSummary {
    store: {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        ownerId: string;
        marketId: string | null;
        openDays: string[];
        openingTime: string | null;
        closingTime: string | null;
        createdAt: string;
        updatedAt: string;
        market?: Market;
        categories: { id: string; categoryId: string; storeId: string; category: Category }[];
    };
    orderCount: number;
}

// Store service types
export interface CreateStoreProduct {
    name: string;
    description: string;
    price: number;
    isAvailable: boolean;
    categoryId: number;
    imageUrl: string;
}

export interface CreateStorePayload {
    name: string;
    imageUrl: string;
    description?: string;
    marketId: number;
    categoryIds?: number[];
    products?: CreateStoreProduct[];
    bank: {
        bankId: number;
        accountNumber: string;
    };
    openDays?: string[];
    openingTime?: string;
    closingTime?: string;
}

export interface CreatedStore {
    id: number;
    name: string;
    imageUrl: string;
    description: string | null;
    isOpen: boolean;
    marketId: number;
    openDays: string[];
    openingTime: string | null;
    closingTime: string | null;
}

// Utility types
export type StatusType = 'accepted' | 'ready_for_pickup' | 'pending' | 'picked_up' | 'delivered' | 'cancel' | 'processing' | 'shipped' | 'cancelled' | 'returned' | 'payment_confirmed';

export interface PriceFormatOptions {
  currency?: string;
  locale?: string;
  decimalPlaces?: number;
  showSymbol?: boolean;
}

export type CloudinaryFolder = 'stores' | 'products' | 'avatars' | 'identity';

// Order screen types
export interface OrderItem {
    id: number;
    productImageUrl: string;
    productName: string;
    orderTotal: number;
    orderRef: string;
    date: string;
    status: StatusType;
}

// Form types
export interface ProductItem {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    categoryId: string;
}

export interface ProductFormHandle {
    validate: () => boolean;
    getData: () => { products: ProductItem[] };
}

export interface ShopFormData {
    image: string | null;
    shopName: string;
    shopDescription: string;
    marketSelected: string;
    selectedCategories: string[];
    openDays: string[];
    openingTime: string;
    closingTime: string;
}

export interface ShopFormHandle {
    validate: () => boolean;
    getData: () => ShopFormData;
}

export interface BankFormData {
    bank: string;
    accountNumber: string;
}

export interface BankFormHandle {
    validate: () => boolean;
    getData: () => BankFormData;
}

export type daysEnum = 'MONDAY'| 'TUESDAY'| 'WEDNESDAY'| 'THURSDAY'| 'FRIDAY'| 'SATURDAY'| 'SUNDAY'
export interface storeUpdateFormData { 
    name: string;
    imageUrl: string;
    description: string;
    marketId: string;
    categoryIds: string[] | number[];
    openDays: daysEnum[];
    openingTime: string;
    closingTime: string
}