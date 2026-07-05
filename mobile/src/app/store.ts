import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themeReducer, { setThemeMode, ThemeMode } from './slices/themeSlice';
import authReducer, { signedIn } from './slices/authSlice';
import favoritesReducer, { hydrateFavorites } from './slices/favoritesSlice';
import submissionsReducer, { hydrateSubmissions } from './slices/submissionsSlice';
import { STORAGE_KEYS } from '../config/constants';

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  favorites: favoritesReducer,
  submissions: submissionsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

/** Restore persisted state on app launch. */
export async function hydrateStore(): Promise<void> {
  try {
    const map = await AsyncStorage.getMany([
      STORAGE_KEYS.theme,
      STORAGE_KEYS.auth,
      STORAGE_KEYS.favorites,
      STORAGE_KEYS.requests,
    ]);

    const theme = map[STORAGE_KEYS.theme];
    if (theme) {
      store.dispatch(setThemeMode(JSON.parse(theme) as ThemeMode));
    }
    const auth = map[STORAGE_KEYS.auth];
    if (auth) {
      store.dispatch(signedIn(JSON.parse(auth)));
    }
    const favorites = map[STORAGE_KEYS.favorites];
    if (favorites) {
      store.dispatch(hydrateFavorites(JSON.parse(favorites)));
    }
    const submissions = map[STORAGE_KEYS.requests];
    if (submissions) {
      store.dispatch(hydrateSubmissions(JSON.parse(submissions)));
    }
  } catch {
    // Corrupt cache is non-fatal — the app starts with defaults.
  }
}

/** Persist relevant slices whenever they change. */
let lastSnapshot = '';
store.subscribe(() => {
  const state = store.getState();
  const snapshot = JSON.stringify([
    state.theme.mode,
    state.auth.user,
    state.favorites,
    state.submissions,
  ]);
  if (snapshot === lastSnapshot) {
    return;
  }
  lastSnapshot = snapshot;

  void AsyncStorage.setMany({
    [STORAGE_KEYS.theme]: JSON.stringify(state.theme.mode),
    [STORAGE_KEYS.favorites]: JSON.stringify(state.favorites),
    [STORAGE_KEYS.requests]: JSON.stringify(state.submissions),
    ...(state.auth.user
      ? { [STORAGE_KEYS.auth]: JSON.stringify(state.auth.user) }
      : {}),
  });
  if (!state.auth.user) {
    void AsyncStorage.removeItem(STORAGE_KEYS.auth);
  }
});
