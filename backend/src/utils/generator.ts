import { randomBytes } from 'crypto';

export const generateUniqueId = (length: number = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = randomBytes(length);

  for (let i = 0; i < length; i++) {
    // We use the modulo operator to pick a character from our set
    result += chars[randomValues[i] % chars.length];
  }

  return result;
};