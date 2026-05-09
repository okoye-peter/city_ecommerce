import * as SecureStore from 'expo-secure-store';

const KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    STORE: 'store',
} as const;

// In-memory cache for sync reads (Axios interceptor needs getAccessToken() to be sync)
let _accessToken: string | null = null;
let _user: string | null = null;
let _store: string | null = null;

/**
 * Call once at app startup. Pre-loads access token, user, and store into memory
 * so the Axios request interceptor can read them synchronously.
 */
export async function initStorage(): Promise<void> {
    _accessToken = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
    _user = await SecureStore.getItemAsync(KEYS.USER);
    _store = await SecureStore.getItemAsync(KEYS.STORE);
}

export const secureStorage = {
    // ── Access token — SecureStore persisted, memory-cached for sync reads

    async setAccessToken(token: string): Promise<void> {
        _accessToken = token;
        await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
    },

    getAccessToken(): string | undefined {
        return _accessToken ?? undefined;
    },

    async deleteAccessToken(): Promise<void> {
        _accessToken = null;
        await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
    },

    // ── Refresh token — SecureStore only, never in memory (hardware-backed)

    async setRefreshToken(token: string): Promise<void> {
        await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
    },

    async getRefreshToken(): Promise<string | null> {
        return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
    },

    async deleteRefreshToken(): Promise<void> {
        await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
    },

    // ── User — SecureStore persisted, memory-cached for sync reads

    async setUser(user: object): Promise<void> {
        const serialized = JSON.stringify(user);
        if (typeof serialized !== 'string') {
            throw new Error('Cannot store an empty user session.');
        }
        _user = serialized;
        await SecureStore.setItemAsync(KEYS.USER, serialized);
    },

    getUser<T>(): T | null {
        return _user ? (JSON.parse(_user) as T) : null;
    },

    async deleteUser(): Promise<void> {
        _user = null;
        await SecureStore.deleteItemAsync(KEYS.USER);
    },

    // ── Store — SecureStore persisted, memory-cached for sync reads

    async setStore(store: object | null): Promise<void> {
        if (store) {
            const serialized = JSON.stringify(store);
            _store = serialized;
            await SecureStore.setItemAsync(KEYS.STORE, serialized);
        } else {
            _store = null;
            await SecureStore.deleteItemAsync(KEYS.STORE);
        }
    },

    getStore<T>(): T | null {
        return _store ? (JSON.parse(_store) as T) : null;
    },

    async deleteStore(): Promise<void> {
        _store = null;
        await SecureStore.deleteItemAsync(KEYS.STORE);
    },

    // ── Clear all (logout)

    async clearAll(): Promise<void> {
        await this.deleteAccessToken();
        await this.deleteUser();
        await this.deleteRefreshToken();
        await this.deleteStore();
    },
};
