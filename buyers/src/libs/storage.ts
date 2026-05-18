import * as SecureStore from 'expo-secure-store'
import type { User } from '@/types'

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
} as const

const SECURE_KEYS = {
  REFRESH_TOKEN: 'refresh_token',
} as const

export const storage = {
  // ─── SecureStore — sync reads for interceptors, persisted across launches ───

  setAccessToken(token: string) {
    SecureStore.setItem(KEYS.ACCESS_TOKEN, token)
  },

  getAccessToken(): string | undefined {
    return SecureStore.getItem(KEYS.ACCESS_TOKEN) ?? undefined
  },

  setUser(user: User) {
    SecureStore.setItem(KEYS.USER, JSON.stringify(user))
  },

  getUser(): User | null {
    const raw = SecureStore.getItem(KEYS.USER)
    return raw ? (JSON.parse(raw) as User) : null
  },

  // Refresh token lives here only — never in Redux state.

  setRefreshToken(token: string): Promise<void> {
    return SecureStore.setItemAsync(SECURE_KEYS.REFRESH_TOKEN, token)
  },

  getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(SECURE_KEYS.REFRESH_TOKEN)
  },

  deleteRefreshToken(): Promise<void> {
    return SecureStore.deleteItemAsync(SECURE_KEYS.REFRESH_TOKEN)
  },

  // ─── Clear all ────────────────────────────────────────────────────────────────

  async clearAll(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN)
    await SecureStore.deleteItemAsync(KEYS.USER)
    await SecureStore.deleteItemAsync(SECURE_KEYS.REFRESH_TOKEN)
  },
}
