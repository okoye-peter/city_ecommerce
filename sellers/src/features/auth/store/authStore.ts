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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
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

  updateTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: 'idle',

  async setSession({ user, accessToken, refreshToken }) {
    await secureStorage.setRefreshToken(refreshToken);
    secureStorage.setAccessToken(accessToken);
    secureStorage.setUser(user);

    set({ user, accessToken, status: 'authenticated' });
  },

  async updateTokens(accessToken, refreshToken) {
    await secureStorage.setRefreshToken(refreshToken);
    secureStorage.setAccessToken(accessToken);

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

  initializeAuth() {
    set({ status: 'loading' });

    const accessToken = secureStorage.getAccessToken();
    const user = secureStorage.getUser<User>();

    if (accessToken && user) {
      set({ accessToken, user, status: 'authenticated' });
    } else {
      set({ status: 'unauthenticated' });
    }
  },
}));

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectUser = (s: AuthState) => s.user;
export const selectIsAuthenticated = (s: AuthState) =>
  s.status === 'authenticated';
export const selectAuthStatus = (s: AuthState) => s.status;
