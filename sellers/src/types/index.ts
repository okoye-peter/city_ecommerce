export type IdType = 'national_id' | 'passport' | 'drivers_license';

export type OrderStatus =
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'returned';

export type TransactionType = 'credit' | 'debit';

export interface Bank {
    id: bigint;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    status: OrderStatus;
    imageUrl?: string;
}

export interface Order {
    id: string;
    product: Product;
    quantity: number;
    status: OrderStatus;
    createdAt: string;
}

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    description: string;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    [key: string]: unknown;
}

export interface Market {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    
}
