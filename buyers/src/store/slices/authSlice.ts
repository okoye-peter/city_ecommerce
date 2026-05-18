import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { storage } from '@/libs/storage'
import type { User } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

interface AuthState {
  user: User | null
  accessToken: string | null
  status: AuthStatus
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function jwtExpiry(token: string): number | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

function isTokenExpired(token: string): boolean {
  const exp = jwtExpiry(token)
  return exp === null || Date.now() >= exp
}

// ─── Thunk ────────────────────────────────────────────────────────────────────

// Runs once at app startup. Reads MMKV + SecureStore and hydrates the store.
// The axios interceptor handles proactive refresh on first 401 — we only
// gate routing here on whether credentials exist and are not obviously stale.
export const initializeAuth = createAsyncThunk<void, void>(
  'auth/initialize',
  async (_, { dispatch }) => {
    const accessToken = storage.getAccessToken()
    const user = storage.getUser()

    if (!accessToken || !user) {
      dispatch(authSlice.actions.setStatus('unauthenticated'))
      return
    }

    if (!isTokenExpired(accessToken)) {
      dispatch(authSlice.actions.setCredentials({ user, accessToken }))
      return
    }

    // Access token is expired — check if we have a refresh token before
    // marking the session as unauthenticated. The actual refresh will be
    // handled by the axios interceptor on the first API call.
    const refreshToken = await storage.getRefreshToken()
    if (!refreshToken || isTokenExpired(refreshToken)) {
      await storage.clearAll()
      dispatch(authSlice.actions.clearCredentials())
      return
    }

    // Refresh token is still valid — keep the session alive. The axios
    // interceptor will exchange it for a new access token on the next request.
    dispatch(authSlice.actions.setCredentials({ user, accessToken }))
  },
)

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'idle',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; accessToken: string }>) {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.status = 'authenticated'
    },

    updateAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
    },

    clearCredentials(state) {
      state.user = null
      state.accessToken = null
      state.status = 'unauthenticated'
    },

    setStatus(state, action: PayloadAction<AuthStatus>) {
      state.status = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeAuth.pending, (state) => {
      state.status = 'loading'
    })
  },
})

export const { setCredentials, updateAccessToken, clearCredentials, setStatus } = authSlice.actions

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.status === 'authenticated'
