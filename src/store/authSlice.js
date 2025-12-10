import { createSlice } from '@reduxjs/toolkit';
import { setAccessToken, clearAccessToken, scheduleTokenRefresh } from '../utils/tokenManager';

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      
      state.user = user;
      state.isAuthenticated = true;
      state.role = user.role;
      
      // Store access token in memory (not localStorage!)
      setAccessToken(accessToken);
      
      // Schedule automatic refresh (15 minutes = 900 seconds)
      scheduleTokenRefresh(900);
      
      console.log(`✅ Credentials set for: ${user.email} (${user.role})`);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      
      // Clear access token from memory
      clearAccessToken();
      
      console.log('👋 User logged out');
    },
    // This is called by Redux Persist when rehydrating
    // We don't restore the token (it's in memory), but we restore user info
    rehydrateAuth: (state, action) => {
      if (action.payload && action.payload.user) {
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.role = action.payload.role;
      }
    }
  }
});

export const { setCredentials, logout, rehydrateAuth } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentRole = (state) => state.auth.role;

// Note: No selectCurrentToken - token is in memory, not Redux!
