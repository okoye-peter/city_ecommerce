/**
 * Utility to format prices consistently throughout the application.
 * Defaults to Nigerian Naira (NGN).
 */

export interface PriceFormatOptions {
  currency?: string;
  locale?: string;
  decimalPlaces?: number;
  showSymbol?: boolean;
}

/**
 * Formats a number or string into a localized currency string.
 * 
 * @param amount - The numeric or string value to format
 * @param options - Configuration options for formatting
 * @returns A formatted currency string
 * 
 * @example
 * formatPrice(5000) // "₦5,000.00"
 * formatPrice(1200.5, { currency: 'USD', locale: 'en-US' }) // "$1,200.50"
 * formatPrice(2500, { showSymbol: false }) // "2,500.00"
 */
export const formatPrice = (
  amount: number | string | undefined | null,
  options: PriceFormatOptions = {}
): string => {
  const {
    currency = 'NGN',
    locale = 'en-NG',
    decimalPlaces = 2,
    showSymbol = true,
  } = options;

  // Handle null/undefined/empty cases
  if (amount === undefined || amount === null || amount === '') {
    return showSymbol ? (currency === 'NGN' ? '₦0.00' : `${currency} 0.00`) : '0.00';
  }

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Handle invalid numbers
  if (isNaN(numericAmount)) {
    return showSymbol ? (currency === 'NGN' ? '₦0.00' : `${currency} 0.00`) : '0.00';
  }

  try {
    // Try using standard Intl.NumberFormat
    return new Intl.NumberFormat(locale, {
      style: showSymbol ? 'currency' : 'decimal',
      currency: currency,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(numericAmount);
  } catch (error) {
    // Fallback for environments where Intl might not be fully supported or locale is missing
    const formatted = numericAmount.toFixed(decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    if (!showSymbol) return formatted;
    
    // Simple symbol fallback
    const symbols: Record<string, string> = {
      'NGN': '₦',
      'USD': '$',
      'GBP': '£',
      'EUR': '€',
    };
    
    const symbol = symbols[currency] || `${currency} `;
    return `${symbol}${formatted}`;
  }
};

/**
 * Formats a large number into a compact form (e.g., 1.5k, 100.12k, 1.2m).
 * Supports up to 2 decimal places and removes unnecessary trailing zeros.
 */
export const formatCompactNumber = (number: number): string => {
  if (number === 0 || !number) return '0';

  const absNumber = Math.abs(number);
  const sign = number < 0 ? '-' : '';

  if (absNumber < 1000) {
    return `${sign}${absNumber}`;
  }

  const units = [
    { value: 1e12, symbol: 't' },
    { value: 1e9, symbol: 'b' },
    { value: 1e6, symbol: 'm' },
    { value: 1e3, symbol: 'k' },
  ];

  for (const { value, symbol } of units) {
    if (absNumber >= value) {
      const formatted = (absNumber / value).toFixed(2);
      // parseFloat + toString removes unnecessary trailing zeros (e.g., 1.50 -> 1.5)
      const trimmed = parseFloat(formatted).toString();
      return `${sign}${trimmed}${symbol}`;
    }
  }

  return `${sign}${absNumber}`;
};
