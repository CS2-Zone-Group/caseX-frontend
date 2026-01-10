import { create } from "zustand";
import api from "@/lib/api";

interface FavouritesStore {
  favouriteIds: string[];
  count: number;
  isLoading: boolean;
  fetchFavouriteIds: () => Promise<void>;
  toggleFavourite: (skinId: string) => Promise<void>;
}

export const useFavouritesStore = create<FavouritesStore>((set, get) => ({
  favouriteIds: [],
  count: 0,
  isLoading: false,

  fetchFavouriteIds: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/favorites/ids');
      const ids = Array.isArray(data) ? data : (data.favoriteIds || data.ids || []);
      
      set({ 
        favouriteIds: ids, 
        count: ids.length, 
        isLoading: false 
      });
    } catch (error) {
      set({ favouriteIds: [], count: 0, isLoading: false });
    }
  },

  toggleFavourite: async (skinId: string) => {
    const state = get();
    const currentIds = Array.isArray(state.favouriteIds) ? state.favouriteIds : [];
    const isFavorite = currentIds.includes(skinId);

    if (isFavorite) {
      const newIds = currentIds.filter(id => id !== skinId);
      set({
        favouriteIds: newIds,
        count: Math.max(0, newIds.length)
      });
    } else {
      const newIds = [...currentIds, skinId];
      set({
        favouriteIds: newIds,
        count: newIds.length
      });
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${skinId}`);
      } else {
        await api.post(`/favorites/${skinId}`);
      }
    } catch (error) {
      console.log(error)
      // get().fetchFavouriteIds();
    }
  }
}));