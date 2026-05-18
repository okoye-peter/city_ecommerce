import { refreshToken } from "./../../../../backend/src/controllers/auth.controller";
import { ApiResponse } from "./../../types/index";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import api from "@/libs/axios";
import { storage } from "@/libs/storage";
import { setCredentials, clearCredentials } from "@/store/slices/authSlice";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types";

// ─── Base query ───────────────────────────────────────────────────────────────
// Wraps our configured axios instance so RTK Query uses the same interceptors
// (token injection, 401 refresh, session-expired handler) for free.

type AxiosBaseQueryError = { status: number | undefined; data: unknown };

const axiosBaseQuery =
  (): BaseQueryFn<AxiosRequestConfig, unknown, AxiosBaseQueryError> =>
  async (config) => {
    try {
      const result = await api(config);
      return { data: result.data };
    } catch (err) {
      const error = err as AxiosError;
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data ?? error.message,
        },
      };
    }
  };

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({ url: "/auth/login", method: "POST", data: body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          storage.setAccessToken(data.accessToken);
          storage.setUser(data.user);
          await storage.setRefreshToken(data.refreshToken);
          dispatch(
            setCredentials({ user: data.user, accessToken: data.accessToken }),
          );
        } catch {
          // error surfaced via the mutation's `error` return value
        }
      },
    }),

    register: builder.mutation<ApiResponse<AuthResponse>, RegisterPayload>({
      query: (body) => ({
        url: "/auth/buyers/register",
        method: "POST",
        data: body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { user, accessToken, refreshToken } = data.data;
          storage.setAccessToken(accessToken);
          storage.setUser(user);
          await storage.setRefreshToken(refreshToken);
          dispatch(setCredentials({ user, accessToken }));
        } catch {
          // error surfaced via the mutation's `error` return value
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        // Clear locally first — UX stays responsive even if the server is slow.
        await storage.clearAll();
        dispatch(clearCredentials());
        try {
          await queryFulfilled;
        } catch {
          // Server logout is best-effort; local session is already cleared.
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApi;
