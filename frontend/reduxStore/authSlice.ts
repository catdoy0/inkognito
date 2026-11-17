import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";

import * as authApi from "@/api/auth-api";
import type { AuthSession, SignUpPayload } from "@/types/auth";

interface AuthState {
  session: AuthSession | null;
  status: "loading" | "authenticated" | "unauthenticated";
  sessionChecked: boolean;
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  status: "loading",
  sessionChecked: false,
  error: null,
};

type RejectValue = { rejectValue: string };

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export const refreshSession = createAsyncThunk<AuthSession | null, void, RejectValue>(
  "auth/refreshSession",
  async () => authApi.refreshSession(),
);

export const signIn = createAsyncThunk<
  AuthSession,
  { email: string; password: string },
  RejectValue
>("auth/signIn", async ({ email, password }, { rejectWithValue }) => {
  try {
    return await authApi.signIn(email, password);
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const signUp = createAsyncThunk<AuthSession, SignUpPayload, RejectValue>(
  "auth/signUp",
  async (payload, { rejectWithValue }) => {
    try {
      return await authApi.signUp(payload);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const signInWithGoogle = createAsyncThunk<AuthSession, string, RejectValue>(
  "auth/signInWithGoogle",
  async (credential, { rejectWithValue }) => {
    try {
      return await authApi.signInWithGoogle(credential);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<AuthSession | null>) {
      state.session = action.payload;
      state.status = action.payload ? "authenticated" : "unauthenticated";
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(refreshSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.session = action.payload;
        state.status = action.payload ? "authenticated" : "unauthenticated";
        state.sessionChecked = true;
      })
      .addCase(refreshSession.rejected, (state) => {
        state.session = null;
        state.status = "unauthenticated";
        state.sessionChecked = true;
      })
      .addMatcher(isAnyOf(signIn.pending, signUp.pending, signInWithGoogle.pending), (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addMatcher(
        isAnyOf(signIn.fulfilled, signUp.fulfilled, signInWithGoogle.fulfilled),
        (state, action) => {
          state.session = action.payload;
          state.status = "authenticated";
          state.sessionChecked = true;
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(signIn.rejected, signUp.rejected, signInWithGoogle.rejected),
        (state, action) => {
          state.status = state.session ? "authenticated" : "unauthenticated";
          state.error = action.payload ?? action.error.message ?? "Something went wrong. Please try again.";
        },
      );
  },
});

export const { clearAuthError, setSession } = authSlice.actions;
export default authSlice.reducer;
