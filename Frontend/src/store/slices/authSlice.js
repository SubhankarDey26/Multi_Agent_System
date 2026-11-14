import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

/**
 * Async Thunk: Verify active backend session with Gateway (/api/me)
 * Verified against Redis 7-day TTL via withCredentials cookie
 */
export const verifySession = createAsyncThunk(
  'auth/verifySession',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/**
 * Async Thunk: Process Google Redirect result after returning from Google OAuth.
 * Call this on LoginPage mount to handle the redirect result.
 * Returns null if no pending redirect result (normal page load).
 */
export const processGoogleRedirect = createAsyncThunk(
  'auth/processGoogleRedirect',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.handleGoogleRedirectResult();
      return user; // null = no pending redirect, user object = success
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/**
 * Async Thunk: Logout via Gateway (/api/auth/logout)
 * Immediately purges client session credentials and clears Redux state
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    // 1. Immediately wipe local session data
    localStorage.removeItem('cortex_user');
    localStorage.removeItem('cortex_session_expires');
    localStorage.removeItem('cortex_token');
    dispatch(clearUser());

    // 2. Clear backend session cookie and Firebase credentials
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Backend /api/auth/logout warning:', err);
    }
    return true;
  }
);

const initialState = {
  user: authService.getStoredUser(),
  isAuthLoading: true,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthLoading = false;
      state.error = null;
    },
    loginDemo: (state, action) => {
      const demoUser = authService.loginDemo(
        action.payload?.email,
        action.payload?.name
      );
      state.user = demoUser;
      state.isAuthLoading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthLoading = false;
      state.error = null;
    },
    setAuthLoading: (state, action) => {
      state.isAuthLoading = action.payload;
    },
    setLoadingDone: (state) => {
      state.isAuthLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // verifySession
      .addCase(verifySession.pending, (state) => {
        state.isAuthLoading = true;
      })
      .addCase(verifySession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthLoading = false;
        state.error = null;
      })
      .addCase(verifySession.rejected, (state, action) => {
        // If expired or unauthorized in Redis, user is cleared
        state.user = null;
        state.isAuthLoading = false;
        state.error = action.payload;
      })
      // processGoogleRedirect
      .addCase(processGoogleRedirect.pending, (state) => {
        state.isAuthLoading = true;
        state.error = null;
      })
      .addCase(processGoogleRedirect.fulfilled, (state, action) => {
        // action.payload is null when no pending redirect — don't clobber existing session
        if (action.payload) {
          state.user = action.payload;
        }
        state.isAuthLoading = false;
        state.error = null;
      })
      .addCase(processGoogleRedirect.rejected, (state, action) => {
        state.isAuthLoading = false;
        state.error = action.payload;
      })
      // logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.user = null;
        state.isAuthLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthLoading = false;
      });
  },
});

export const { setUser, loginDemo, clearUser, setAuthLoading, setLoadingDone } = authSlice.actions;
export default authSlice.reducer;