/**
 * store/authStore.ts
 *
 * `refreshToken` is NOT stored in Zustand — it lives only in Keychain/Keystore.
 * The store never holds it in memory.
 *
 * Why: Zustand state lives in the JS heap. Keeping the refresh token out of
 * JS memory entirely limits its exposure to the Keychain layer only.
 */

import { create } from 'zustand';
import { secureStorage } from '@/src/lib/storage';
import type { User, Store } from '@/src/types';

export type { User, Store } from '@/src/types';

function jwtExpiry(token: string): number | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function isExpired(token: string): boolean {
  const exp = jwtExpiry(token);
  return exp === null || Date.now() >= exp;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  store: Store | null;
  accessToken: string | null;
  status: AuthStatus;

  setSession: (payload: {
    user: User;
    store?: Store | null;
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;

  setUser: (user: User) => Promise<void>;
  setStore: (store: Store | null) => Promise<void>;
  updateTokens: (accessToken: string, refreshToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  store: null,
  accessToken: null,
  status: 'idle',

  async setSession({ user, store = null, accessToken, refreshToken }) {
    if (refreshToken) await secureStorage.setRefreshToken(refreshToken);
    if (accessToken) await secureStorage.setAccessToken(accessToken);
    if (user) await secureStorage.setUser(user);
    await secureStorage.setStore(store);

    set({ user, store, accessToken: accessToken ?? null, status: 'authenticated' });
  },

  async setUser(user: User) {
    if (!user) return;
    await secureStorage.setUser(user);
    set({ user });
  },

  async setStore(store: Store | null) {
    await secureStorage.setStore(store);
    set({ store });
  },

  async updateTokens(accessToken, refreshToken) {
    if(refreshToken) await secureStorage.setRefreshToken(refreshToken);
    await secureStorage.setAccessToken(accessToken);

    set({ accessToken });
  },

  async logout() {
    await secureStorage.clearAll();
    set({
      user: null,
      store: null,
      accessToken: null,
      status: 'unauthenticated',
    });
  },

  async initializeAuth() {
    set({ status: 'loading' });

    const accessToken = secureStorage.getAccessToken();
    const user = secureStorage.getUser<User>();

    if (!accessToken || !user) {
      set({ status: 'unauthenticated' });
      return;
    }

    const store = secureStorage.getStore<Store>();

    if (!isExpired(accessToken)) {
      set({ accessToken, user, store, status: 'authenticated' });
      return;
    }

    const refreshToken = await secureStorage.getRefreshToken();
    if (!refreshToken || isExpired(refreshToken)) {
      await secureStorage.clearAll();
      set({ user: null, store: null, accessToken: null, status: 'unauthenticated' });
      return;
    }

    set({ accessToken, user, store, status: 'authenticated' });
  },
}));


export const selectUser = (s: AuthState) => s.user;
export const selectStore = (s: AuthState) => s.store;
export const selectIsAuthenticated = (s: AuthState) => s.status === 'authenticated';
export const selectAuthStatus = (s: AuthState) => s.status;
