import * as SecureStore from 'expo-secure-store';

const KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
} as const;

// In-memory cache — populated by initStorage() so sync reads work
let _cachedAccessToken: string | null = null;
let _cachedUser: string | null = null;
let _initialized = false;

/**
 * Call once at app startup before rendering any screen.
 * Pre-loads tokens into memory so sync getAccessToken() / getUser() work.
 */
export async function initStorage(): Promise<void> {
    if (_initialized) return;
    _cachedAccessToken = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
    _cachedUser = await SecureStore.getItemAsync(KEYS.USER);
    _initialized = true;
}

export const secureStorage = {
    // ── Access token — sync read from memory cache (required by Axios interceptor)

    setAccessToken(token: string): void {
        _cachedAccessToken = token;
        SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
    },

    getAccessToken(): string | undefined {
        return _cachedAccessToken ?? undefined;
    },

    deleteAccessToken(): void {
        _cachedAccessToken = null;
        SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
    },

    // ── Refresh token — always async, never cached in memory

    async setRefreshToken(token: string): Promise<void> {
        await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
    },

    async getRefreshToken(): Promise<string | null> {
        return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
    },

    async deleteRefreshToken(): Promise<void> {
        await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
    },

    // ── User — sync read from memory cache

    setUser(user: object): void {
        const serialized = JSON.stringify(user);
        _cachedUser = serialized;
        SecureStore.setItemAsync(KEYS.USER, serialized);
    },

    getUser<T>(): T | null {
        return _cachedUser ? (JSON.parse(_cachedUser) as T) : null;
    },

    deleteUser(): void {
        _cachedUser = null;
        SecureStore.deleteItemAsync(KEYS.USER);
    },

    // ── Clear all (logout)

    async clearAll(): Promise<void> {
        this.deleteAccessToken();
        this.deleteUser();
        await this.deleteRefreshToken();
    },
};
