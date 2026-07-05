import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../../types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signedIn(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    profileUpdated(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    signedOut(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { signedIn, profileUpdated, signedOut } = authSlice.actions;
export default authSlice.reducer;
