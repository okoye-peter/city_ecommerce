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
    id: string;
    label: string;
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
