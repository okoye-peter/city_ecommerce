import type { StatusType } from '@/src/types';

export type { StatusType } from '@/src/types';

export const statusClass = (status: StatusType | string): { container: string; text: string } => {
    switch (status.trim().toLowerCase()) {
        case 'accepted':
        case 'processing':
        case 'payment_confirmed':
            return {
                container: 'bg-light-gray-2 border-light-gray',
                text: 'text-gray-accepted',
            };
        case 'ready_for_pickup':
            return {
                container: 'bg-blue-light-2 border-blue-light',
                text: 'text-blue-dark',
            };
        case 'pending':
            return {
                container: 'bg-indigo-light-2 border-indigo-light',
                text: 'text-indigo-dark',
            };
        case 'picked_up':
        case 'shipped':
            return {
                container: 'bg-warning-light-2 border-warning-light',
                text: 'text-warning-dark',
            };
        case 'delivered':
            return {
                container: 'bg-success-light-2 border-success-light',
                text: 'text-success-dark',
            };
        case 'cancel':
        case 'cancelled':
        case 'returned':
            return {
                container: 'bg-error-light-2 border-error-light',
                text: 'text-error-dark',
            };
        default:
            return {
                container: 'bg-light-gray-2 border-light-gray',
                text: 'text-gray-500',
            };
    }
}