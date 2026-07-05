import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  projectIds: string[];
  blogIds: string[];
}

const initialState: FavoritesState = { projectIds: [], blogIds: [] };

const toggle = (list: string[], id: string): string[] =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleProjectFavorite(state, action: PayloadAction<string>) {
      state.projectIds = toggle(state.projectIds, action.payload);
    },
    toggleBlogBookmark(state, action: PayloadAction<string>) {
      state.blogIds = toggle(state.blogIds, action.payload);
    },
    hydrateFavorites(_state, action: PayloadAction<FavoritesState>) {
      return action.payload;
    },
  },
});

export const { toggleProjectFavorite, toggleBlogBookmark, hydrateFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
