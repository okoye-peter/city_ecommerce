import crypto from 'crypto';
import { env } from '../config/env';

const ALGORITHM = 'aes-256-cbc';
// Fixed IV makes encryption deterministic: same input → same ciphertext
const IV = Buffer.alloc(16, 0);

export function encrypt(value: string): string {
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(env.ENCRYPTION_KEY), IV);
    return Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]).toString('hex');
}

export function decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(env.ENCRYPTION_KEY), IV);
    return Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]).toString('utf8');
}
