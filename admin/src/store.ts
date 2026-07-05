import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AdminUser } from './types';
import { setAccessToken } from './api/client';

interface AuthState {
  admin: AdminUser | null;
}

const persisted = sessionStorage.getItem('sujoydev.admin');

const authSlice = createSlice({
  name: 'auth',
  initialState: { admin: persisted ? (JSON.parse(persisted) as AdminUser) : null } as AuthState,
  reducers: {
    loggedIn(state, action: PayloadAction<{ admin: AdminUser; accessToken: string }>) {
      state.admin = action.payload.admin;
      setAccessToken(action.payload.accessToken);
      sessionStorage.setItem('sujoydev.admin', JSON.stringify(action.payload.admin));
    },
    loggedOut(state) {
      state.admin = null;
      setAccessToken(null);
      sessionStorage.removeItem('sujoydev.admin');
    },
  },
});

interface UiState {
  mode: 'light' | 'dark';
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mode: (localStorage.getItem('sujoydev.themeMode') as 'light' | 'dark') ?? 'light',
  } as UiState,
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('sujoydev.themeMode', state.mode);
    },
  },
});

export const { loggedIn, loggedOut } = authSlice.actions;
export const { toggleMode } = uiSlice.actions;

export const store = configureStore({
  reducer: { auth: authSlice.reducer, ui: uiSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
