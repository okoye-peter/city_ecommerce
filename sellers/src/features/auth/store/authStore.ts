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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: 'BUYER' | 'SELLER';
  verificationType?:
    | 'NATIONAL_ID'
    | 'DRIVERS_LICENSE'
    | 'INTERNATIONAL_PASSPORT';
  verificationId?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
}

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: AuthStatus;

  setSession: (payload: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;

  updateTokens: (accessToken: string, refreshToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: 'idle',

  async setSession({ user, accessToken, refreshToken }) {
    if (refreshToken) await secureStorage.setRefreshToken(refreshToken);
    if (accessToken) await secureStorage.setAccessToken(accessToken);
    if (user) await secureStorage.setUser(user);

    set({ user, accessToken: accessToken ?? null, status: 'authenticated' });
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

    // Access token still valid — nothing more to check
    if (!isExpired(accessToken)) {
      set({ accessToken, user, status: 'authenticated' });
      return;
    }

    // Access token expired — check if the refresh token can save the session
    const refreshToken = await secureStorage.getRefreshToken();
    if (!refreshToken || isExpired(refreshToken)) {
      // Both dead — clear storage and force re-login immediately
      await secureStorage.clearAll();
      set({ user: null, accessToken: null, status: 'unauthenticated' });
      return;
    }

    // Refresh token still valid — let the Axios interceptor handle the refresh
    // on the first API call rather than doing it eagerly here
    set({ accessToken, user, status: 'authenticated' });
  },
}));


export const selectUser = (s: AuthState) => s.user;
export const selectIsAuthenticated = (s: AuthState) =>
  s.status === 'authenticated';
export const selectAuthStatus = (s: AuthState) => s.status;
