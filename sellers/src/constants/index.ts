export const APP_NAME = 'City Commerce';

export const COLORS = {
    primary: '#1E1E1E',
    secondary: '#757575',
    border: '#E0E0E0',
    light: '#F5F5F5',
    white: '#FFFFFF',
    error: '#cc0000',
} as const;

export const ORDER_STATUSES = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
] as const;

export const ID_TYPES = [
    { id: 'national_id', label: 'National ID Card' },
    { id: 'passport', label: 'International Passport' },
    { id: 'drivers_license', label: "Driver's License" },
] as const;
